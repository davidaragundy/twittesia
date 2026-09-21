"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useSortMenu } from "@/shared/hooks/use-sort-menu";
import type { SortOption } from "@/shared/types/sort-option";

type Props<Value extends string> = {
  // What the choice is about, as the menu's heading and for screen readers
  label: string;
  options: readonly SortOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  disabled?: boolean;
};

// The current order, with its icon, opening onto the others
export function SortMenu<Value extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: Props<Value>) {
  const { current, select } = useSortMenu({ options, value, onChange });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            aria-label={`${label}: ${current.label}`}
          />
        }
      >
        <Icon icon={current.icon} data-icon="inline-start" />
        {current.label}
        <Icon icon={ArrowDown01Icon} data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={value} onValueChange={select}>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <Icon icon={option.icon} />
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
