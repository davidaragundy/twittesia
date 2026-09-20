interface Props {
  chatId: string;
}

// The connection a room holds open for as long as it is on screen
export const toChatLivePath = ({ chatId }: Props) => `/api/chats/${chatId}/live`;
