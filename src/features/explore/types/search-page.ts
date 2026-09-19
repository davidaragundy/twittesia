import type { SearchResult } from "@/features/explore/types/search-result";

export type SearchPage = {
  results: SearchResult[];
  // How many results the page after this one skips; null once the results end
  nextOffset: number | null;
};
