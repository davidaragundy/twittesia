"use client";

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { SortMenu } from "@/shared/components/sort-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";

import { MAX_SEARCH_QUERY_LENGTH } from "@/features/explore/constants/max-search-query-length";
import { SEARCH_SCOPES } from "@/features/explore/constants/search-scopes";
import { useSearchForm } from "@/features/explore/hooks/use-search-form";
import type { SearchScope } from "@/features/explore/types/search-scope";

interface Props {
  query: string;
  scope: SearchScope;
}

export const SearchForm = ({ query, scope }: Props) => {
  const { value, setValue, onSubmit, onScopeChange, onClear, isSearching } = useSearchForm({
    query,
    scope,
  });

  return (
    // What a search covers sits beside it, once there is something to narrow
    <div className="flex items-center gap-2">
      <form onSubmit={onSubmit} role="search" className="flex-1">
        <InputGroup>
          <InputGroupAddon>
            {isSearching ? <Spinner /> : <Icon icon={Search01Icon} />}
          </InputGroupAddon>
          <InputGroupInput
            name="q"
            // Text rather than search, so the browser adds no clear button of its own beside
            // ours; the keyboard still offers to search
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            placeholder="Search posts and comments"
            aria-label="Search posts and comments"
            autoComplete="off"
          />
          {!!value && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Clear search"
                onClick={onClear}
              >
                <Icon icon={Cancel01Icon} />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </form>

      {/* Nothing to narrow until something has been searched for */}
      {!!query && (
        <SortMenu
          label="Search in"
          options={SEARCH_SCOPES}
          value={scope}
          onChange={onScopeChange}
        />
      )}
    </div>
  );
};
