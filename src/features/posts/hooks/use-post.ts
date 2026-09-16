import { useQuery } from "@tanstack/react-query";

import { POST_QUERY_KEY } from "@/features/posts/constants/post-query-key";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  // Read on the server for the page; reactions and comments then update it in the cache
  initialPost: FeedPost;
}

export const usePost = ({ initialPost }: Props) => {
  const { data } = useQuery({
    queryKey: [POST_QUERY_KEY, initialPost.id],
    queryFn: () => initialPost,
    initialData: initialPost,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return { post: data };
};
