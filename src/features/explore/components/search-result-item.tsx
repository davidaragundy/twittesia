import { ProfileCommentItem } from "@/features/comments/components/profile-comment-item";
import type { SearchResult } from "@/features/explore/types/search-result";
import { PostItem } from "@/features/posts/components/post-item";

interface Props {
  result: SearchResult;
  // Where it sits in the list, for anyone reading the page with a screen reader
  position: number;
  total: number;
}

// A hit, as the card it would be anywhere else: a post in the feed, a comment on a profile
export const SearchResultItem = ({ result, position, total }: Props) =>
  result.kind === "post" ? (
    <PostItem post={result.post} position={position} total={total} />
  ) : (
    <ProfileCommentItem comment={result.comment} />
  );
