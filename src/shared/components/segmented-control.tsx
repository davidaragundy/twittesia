"use client";

import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

interface Props<Value extends string> {
  // What the choice is about, for anyone reading the page with a screen reader
  label: string;
  disabled?: boolean;
  options: { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
}

export const SegmentedControl = <Value extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: Props<Value>) => (
  <ToggleGroup
    aria-label={label}
    disabled={disabled}
    size="sm"
    spacing={1}
    value={[value]}
    onValueChange={([next]) => {
      const chosen = options.find((option) => option.value === next);

      // Pressing the option that is already on leaves the group empty, and the choice unchanged
      if (chosen) onChange(chosen.value);
    }}
  >
    {options.map((option) => (
      <ToggleGroupItem key={option.value} value={option.value}>
        {option.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);
