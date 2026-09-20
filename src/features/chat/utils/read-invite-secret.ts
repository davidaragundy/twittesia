import { toSecretStorageKey } from "@/features/chat/utils/to-secret-storage-key";

interface Props {
  chatId: string;
}

/**
 * The secret for one chat, from the address bar or from where this tab put it earlier.
 *
 * It is taken out of the address bar as soon as it is read, so the rest of a visit — and anything
 * the browser keeps about it — carries a link without the key in it. Session storage is per tab
 * and is cleared when the tab closes, and is never read by anything on a server.
 */
export const readInviteSecret = ({ chatId }: Props) => {
  const key = toSecretStorageKey({ chatId });
  const fromAddress = window.location.hash.replace("#", "");

  if (fromAddress) {
    sessionStorage.setItem(key, fromAddress);
    history.replaceState(null, "", window.location.pathname + window.location.search);

    return fromAddress;
  }

  return sessionStorage.getItem(key);
};
