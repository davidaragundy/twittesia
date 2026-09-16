import { VIEW_COUNT_FORMAT } from "@/features/posts/constants/view-count-format";

// "1 view", "12 views", "1.2K views"
export const formatViewCount = (count: number) =>
  `${VIEW_COUNT_FORMAT.format(count)} ${count === 1 ? "view" : "views"}`;
