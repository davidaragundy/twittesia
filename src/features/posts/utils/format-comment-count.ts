// "1 comment", "12 comments"
export const formatCommentCount = (count: number) =>
  `${count} ${count === 1 ? "comment" : "comments"}`;
