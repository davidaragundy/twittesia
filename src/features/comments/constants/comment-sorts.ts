import { Clock01Icon, FireIcon } from "@hugeicons/core-free-icons";

import type { SortOption } from "@/shared/types/sort-option";

import type { CommentSort } from "@/features/comments/types/comment-sort";

// The orders a post's comments can be read in, as the menu above them offers them
export const COMMENT_SORTS: SortOption<CommentSort>[] = [
  { value: "latest", label: "Latest", icon: Clock01Icon },
  { value: "popular", label: "Most popular", icon: FireIcon },
];
