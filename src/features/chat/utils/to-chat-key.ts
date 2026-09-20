interface Props {
  id: string;
}

export const toChatKey = ({ id }: Props) => `chat:${id}`;
