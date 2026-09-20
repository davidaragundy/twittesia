import { INVITE_SECRET_BYTES } from "@/features/chat/constants/invite-secret-bytes";

/**
 * The secret half of an invite, made in the browser.
 *
 * Nothing on a server ever generates it or is told it: it is created here, put after the `#` of
 * the link, which browsers never send, and kept for as long as the chat is open in this tab.
 *
 * Base64url, so it survives being pasted into anything.
 */
export const generateInviteSecret = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(INVITE_SECRET_BYTES));

  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
};
