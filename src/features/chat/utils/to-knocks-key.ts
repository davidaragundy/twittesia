interface Props {
  chatId: string;
}

// Everyone waiting to be let into one chat, a field per asker, so the chat's end takes them with it
export const toKnocksKey = ({ chatId }: Props) => `knocks:chat:${chatId}`;
