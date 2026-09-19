"use client";

import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { SegmentedControl } from "@/shared/components/segmented-control";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/ui/input-group";

import { MAX_SEARCH_QUERY_LENGTH } from "@/features/explore/constants/max-search-query-length";
import { SEARCH_SCOPES } from "@/features/explore/constants/search-scopes";
import { useSearchForm } from "@/features/explore/hooks/use-search-form";
import type { SearchScope } from "@/features/explore/types/search-scope";

interface Props {
  query: string;
  scope: SearchScope;
}

export const SearchForm = ({ query, scope }: Props) => {
  const { value, setValue, onSubmit, onScopeChange, onClear } = useSearchForm({ query, scope });

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSubmit} role="search">
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon icon={Search01Icon} />
          </InputGroupAddon>
          <InputGroupInput
            name="q"
            type="search"
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
                <HugeiconsIcon icon={Cancel01Icon} />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </form>

      {/* Nothing to narrow until something has been searched for */}
      {!!query && (
        <div className="flex justify-end">
          <SegmentedControl
            label="Search in"
            options={[...SEARCH_SCOPES]}
            value={scope}
            onChange={onScopeChange}
          />
        </div>
      )}
    </div>
  );
};
