import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { SearchScope } from "@/features/explore/types/search-scope";
import { toExplorePath } from "@/features/explore/utils/to-explore-path";

interface Props {
  // What the URL currently says, which is what the page rendered
  query: string;
  scope: SearchScope;
}

/**
 * The search box. A search is a URL, so submitting one navigates to it: it can be shared,
 * reloaded, and gone back to. Changing the kind keeps whatever was typed.
 */
export const useSearchForm = ({ query, scope }: Props) => {
  const router = useRouter();
  const [value, setValue] = useState(query);
  // A search is a navigation, and a navigation to a page that has to be read takes a moment;
  // the box says so rather than looking as though nothing happened
  const [isSearching, startSearching] = useTransition();

  const search = (next: string) => startSearching(() => router.push(next));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search(toExplorePath({ query: value.trim(), scope }));
  };

  const onScopeChange = (next: SearchScope) =>
    search(toExplorePath({ query: query.trim(), scope: next }));

  const onClear = () => {
    setValue("");
    search(toExplorePath({ query: "", scope }));
  };

  return { value, setValue, onSubmit, onScopeChange, onClear, isSearching };
};
