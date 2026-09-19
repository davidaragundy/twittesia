import type { SearchScope } from "@/features/explore/types/search-scope";
import type { ContentType } from "@/features/posts/types/content-type";

interface Props {
  scope: SearchScope;
}

// What a scope narrows the index to; everything narrows to nothing
export const toSearchType = ({ scope }: Props): ContentType | null => {
  if (scope === "posts") return "post";
  if (scope === "comments") return "comment";

  return null;
};
