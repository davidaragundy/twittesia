import type { ProfileComment } from "@/features/comments/types/profile-comment";
import { SEARCH_URL } from "@/features/explore/constants/search-url";
import type { SearchPage } from "@/features/explore/types/search-page";
import type { SearchScope } from "@/features/explore/types/search-scope";
import type { FeedPost } from "@/features/posts/types/feed-post";

interface Props {
  query: string;
  scope: SearchScope;
  offset: number;
}

type Serialized<T> = Omit<T, "createdAt"> & { createdAt: string };

type SerializedSearchPage = Omit<SearchPage, "results"> & {
  results: (
    | { kind: "post"; post: Serialized<FeedPost> }
    | { kind: "comment"; comment: Serialized<ProfileComment> }
  )[];
};

// JSON has no dates, so the timestamps come back as strings
export const fetchSearchPage = async ({ query, scope, offset }: Props): Promise<SearchPage> => {
  const params = new URLSearchParams({ q: query, in: scope, offset: String(offset) });
  const response = await fetch(`${SEARCH_URL}?${params}`);

  if (!response.ok) throw new Error("Couldn't search");

  const page: SerializedSearchPage = await response.json();

  return {
    ...page,
    results: page.results.map((result) =>
      result.kind === "post"
        ? {
            kind: result.kind,
            post: { ...result.post, createdAt: new Date(result.post.createdAt) },
          }
        : {
            kind: result.kind,
            comment: { ...result.comment, createdAt: new Date(result.comment.createdAt) },
          },
    ),
  };
};
