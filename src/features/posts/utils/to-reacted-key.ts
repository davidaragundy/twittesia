interface Props {
  // The post or comment hash reacted to
  targetKey: string;
}

// Who reacted to one post or comment, a field per reader holding the emoji they added
export const toReactedKey = ({ targetKey }: Props) => `reacted:${targetKey}`;
