interface Props {
  id: string;
}

export const toIdentityKey = ({ id }: Props) => `identity:${id}`;
