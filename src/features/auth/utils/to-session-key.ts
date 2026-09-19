interface Props {
  id: string;
}

export const toSessionKey = ({ id }: Props) => `session:${id}`;
