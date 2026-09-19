interface Props {
  id: string;
}

export const toPostKey = ({ id }: Props) => `post:${id}`;
