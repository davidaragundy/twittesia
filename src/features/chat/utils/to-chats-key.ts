interface Props {
  identityId: string;
}

// The chats one identity is in, newest first, so their page reads in one query
export const toChatsKey = ({ identityId }: Props) => `chats:${identityId}`;
