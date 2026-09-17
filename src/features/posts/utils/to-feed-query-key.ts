import { FEED_QUERY_KEY } from "@/features/posts/constants/feed-query-key";
import type { FeedSort } from "@/features/posts/types/feed-sort";

interface Props {
  sort: FeedSort;
}

// Each order is cached on its own, under the FEED_QUERY_KEY prefix the cache helpers write through
export const toFeedQueryKey = ({ sort }: Props) => [...FEED_QUERY_KEY, sort];
