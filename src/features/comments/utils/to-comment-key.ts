interface Props {
  id: string;
}

export const toCommentKey = ({ id }: Props) => `comment:${id}`;
