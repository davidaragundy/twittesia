import { MAX_MESSAGE_LENGTH } from "@/features/chat/constants/max-message-length";

// A message as it travels: base64 of the text, its padding and its tag, with room to spare. The
// server cannot read a message to check its length, so it checks the only thing it can see.
export const MAX_CIPHER_LENGTH = MAX_MESSAGE_LENGTH * 3;
