export const parseCommentCursor = (cursor: string | null | undefined) => {
  if (!cursor) return null;

  const [createdAt, ...rest] = cursor.split("_");
  const id = rest.join("_");
  const createdAtDate = createdAt ? new Date(createdAt) : null;

  if (!id || !createdAtDate || Number.isNaN(createdAtDate.getTime())) return null;

  return { createdAt: createdAtDate, id };
};
