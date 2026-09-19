import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(toExplorePath({ query: value.trim(), scope }));
  };

  const onScopeChange = (next: SearchScope) =>
    router.push(toExplorePath({ query: query.trim(), scope: next }));

  const onClear = () => {
    setValue("");
    router.push(toExplorePath({ query: "", scope }));
  };

  return { value, setValue, onSubmit, onScopeChange, onClear };
};
