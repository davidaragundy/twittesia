interface Props {
  // The post or comment hash seen
  targetKey: string;
}

// Every reader who has seen one post or comment, each once
export const toViewersKey = ({ targetKey }: Props) => `viewers:${targetKey}`;
