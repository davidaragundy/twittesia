import type { InfiniteData } from "@tanstack/react-query";

import type { CommentsPage } from "@/features/comments/types/comments-page";

// A post's comments as TanStack Query caches them under [COMMENTS_QUERY_KEY, postId]
export type CommentsData = InfiniteData<CommentsPage, string | null>;
