interface Props {
  handle: string;
}

// Points a handle at its identity; claimed with SET NX, so a handle belongs to one identity at most
export const toHandleKey = ({ handle }: Props) => `handle:${handle}`;
