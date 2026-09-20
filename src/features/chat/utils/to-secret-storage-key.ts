interface Props {
  chatId: string;
}

// Where a tab keeps the secret it read out of an invite, so following a link, starting an
// identity and coming back does not lose it
export const toSecretStorageKey = ({ chatId }: Props) => `chat-secret:${chatId}`;
