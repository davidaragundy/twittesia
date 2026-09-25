"use client";

import { ViewOffIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";

import { useModeratedContent } from "@/features/moderation/hooks/use-moderated-content";
import type { ModerationFlags } from "@/features/moderation/types/moderation-flags";

interface Props {
  flags: ModerationFlags | null;
  // The words themselves, for muted words
  text: string;
  isMine: boolean;
  // Singular, for the button: "post" or "comment"
  subject: string;
  children: React.ReactNode;
}

/**
 * Writing a reader would rather not see, blurred behind why, until they choose to see it.
 *
 * Blurred rather than removed: a flag is a model's judgment, and the reader is the one who
 * decides. What is blurred is kept away from screen readers and the keyboard until revealed.
 */
export const ModeratedContent = ({ flags, text, isMine, subject, children }: Props) => {
  const { reasons, isFlagged, isHidden, isRevealed, reveal, hide } = useModeratedContent({
    flags,
    text,
    isMine,
  });

  if (!reasons.length) return children;

  if (isHidden) {
    return (
      <div className="relative min-h-36 overflow-hidden rounded-2xl">
        <div aria-hidden inert className="pointer-events-none blur-lg select-none">
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/30 p-4 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-background/80">
            <Icon icon={ViewOffIcon} className="size-5" />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">Hidden for {reasons.join(", ")}</p>
            <p className="text-xs text-muted-foreground">
              {isFlagged ? "Flagged automatically." : "It contains a word you muted."} You can
              change this in Settings.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={reveal}>
            Show {subject}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {children}
      <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        <Icon icon={ViewOffIcon} className="size-3.5" />
        {isMine
          ? `Others see this hidden at first, for ${reasons.join(", ")}`
          : `${isFlagged ? "Flagged" : "Muted"} for ${reasons.join(", ")}`}
        {isRevealed && (
          <Button variant="link" size="xs" onClick={hide} className="-mx-2.5">
            Hide again
          </Button>
        )}
      </p>
    </div>
  );
};
