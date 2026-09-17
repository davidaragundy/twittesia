import { COMMENTS_QUERY_KEY } from "@/features/comments/constants/comments-query-key";
import { PROFILE_COMMENTS_QUERY_KEY } from "@/features/comments/constants/profile-comments-query-key";

// Every cache a comment can appear in: a post's comments, and a person's. A change to one comment
// has to reach both, because the reader may have either on screen.
export const COMMENT_LIST_QUERY_ROOTS = [COMMENTS_QUERY_KEY, PROFILE_COMMENTS_QUERY_KEY];
