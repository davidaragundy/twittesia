interface Props {
  id: string;
}

// Where a chat's messages pass. Pub/sub channels are not keys: publishing to this writes nothing
// and leaves nothing behind, which is the whole point of it.
export const toChatChannel = ({ id }: Props) => `chat:${id}`;
