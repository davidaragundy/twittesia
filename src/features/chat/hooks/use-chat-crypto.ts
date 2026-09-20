import { useCallback, useEffect, useRef, useState } from "react";

import { announceKey } from "@/features/chat/actions/announce-key";
import type { ChatEvent } from "@/features/chat/types/chat-event";
import { deriveChatKey } from "@/features/chat/utils/derive-chat-key";
import { exportPublicKey } from "@/features/chat/utils/export-public-key";
import { generateChatKeyPair } from "@/features/chat/utils/generate-chat-key-pair";
import { importPublicKey } from "@/features/chat/utils/import-public-key";
import { readInviteSecret } from "@/features/chat/utils/read-invite-secret";
import { toSafetyNumber } from "@/features/chat/utils/to-safety-number";

interface Props {
  chatId: string;
  // The other person, since a key is only agreed with them
  otherId: string;
}

/**
 * The key this page encrypts with, agreed with the other side and known to nothing else.
 *
 * A pair is made when the page opens and its public half goes on the channel; the other side's
 * arrives the same way, and the two are combined with the secret from the invite — the part of
 * the link browsers never send. A server passing these keys back and forth learns nothing it
 * could use: swapping them would give it two conversations it still cannot read, and the safety
 * number the two people compare would stop matching.
 *
 * Nothing here is written down. The pair lasts as long as the page, and the secret lasts as long
 * as this tab; a tab that never had the secret says so rather than falling back to anything
 * weaker.
 */
export const useChatCrypto = ({ chatId, otherId }: Props) => {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [safetyNumber, setSafetyNumber] = useState<string | null>(null);
  const [hasSecret, setHasSecret] = useState(true);
  // Whether this page has a pair yet: it has nothing to say to the other side until it does
  const [isReady, setReady] = useState(false);
  const pair = useRef<CryptoKeyPair | null>(null);
  const mine = useRef<string | null>(null);
  const secret = useRef<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const start = async () => {
      secret.current = readInviteSecret({ chatId });

      if (!secret.current) {
        setHasSecret(false);
        return;
      }

      const generated = await generateChatKeyPair();

      if (!isCurrent) return;

      pair.current = generated;
      mine.current = await exportPublicKey({ key: generated.publicKey });
      setReady(true);
    };

    void start();

    return () => {
      isCurrent = false;
      pair.current = null;
      mine.current = null;
      secret.current = null;
      setReady(false);
      setKey(null);
      setSafetyNumber(null);
    };
  }, [chatId]);

  // Says who this page is to the other side, and asks for theirs when it is the one arriving
  const announce = useCallback(
    async ({ reply }: { reply: boolean }) => {
      if (!mine.current) return;

      await announceKey({ chatId, publicKey: mine.current, reply });
    },
    [chatId],
  );

  const onKeyEvent = useCallback(
    async (event: Extract<ChatEvent, { type: "key" }>) => {
      if (event.identityId !== otherId || !pair.current || !mine.current || !secret.current) return;

      if (event.reply) void announce({ reply: false });

      try {
        const theirs = await importPublicKey({ value: event.publicKey });

        setKey(
          await deriveChatKey({
            privateKey: pair.current.privateKey,
            publicKey: theirs,
            secret: secret.current,
            chatId,
          }),
        );

        setSafetyNumber(
          await toSafetyNumber({
            keys: [mine.current, event.publicKey],
            secret: secret.current,
          }),
        );
      } catch {
        // Anything that isn't a key leaves the handshake unfinished, which the room already shows
      }
    },
    [announce, chatId, otherId],
  );

  return { key, safetyNumber, hasSecret, isReady, announce, onKeyEvent };
};
