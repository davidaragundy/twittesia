import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { FeedSort } from "@/features/posts/types/feed-sort";

interface Props {
  sort: FeedSort;
  // An identity, when the feed is one person's posts rather than everyone's
  authorId?: string;
}

// Each order, and each person's posts, is cached on its own under the FEED_QUERY_KEY prefix the
// cache helpers write through
export const toFeedQueryKey = ({ sort, authorId }: Props) => [
  ...FEED_QUERY_KEY,
  { sort, authorId },
];
