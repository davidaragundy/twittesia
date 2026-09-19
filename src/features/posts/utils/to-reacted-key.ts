interface Props {
  // The post or comment hash reacted to
  targetKey: string;
  identityId: string;
}

// The emoji one reader added to one post or comment
export const toReactedKey = ({ targetKey, identityId }: Props) =>
  `reacted:${targetKey}:${identityId}`;
