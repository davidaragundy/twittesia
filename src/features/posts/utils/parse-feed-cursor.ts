interface Props {
  cursor: string | null | undefined;
}

// Where the last page ended — a creation time or a rank, depending on the order — or null for the
// first page and for anything the browser sends that isn't a whole number
export const parseFeedCursor = ({ cursor }: Props) => {
  const value = Number(cursor);

  return cursor && Number.isSafeInteger(value) && value > 0 ? value : null;
};
