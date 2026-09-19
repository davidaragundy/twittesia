interface Props {
  // The post or comment hash seen
  targetKey: string;
}

// A HyperLogLog of the readers who have seen one post or comment: it counts each once, and keeps
// no record of who they were
export const toViewsKey = ({ targetKey }: Props) => `views:${targetKey}`;
