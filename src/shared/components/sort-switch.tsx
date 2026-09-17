"use client";

import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

interface Props<Value extends string> {
  // What the switch orders, for anyone reading the page with a screen reader
  label: string;
  options: { value: Value; label: string }[];
  value: Value;
  onChange: (value: Value) => void;
}

export const SortSwitch = <Value extends string>({
  label,
  options,
  value,
  onChange,
}: Props<Value>) => (
  <ToggleGroup
    aria-label={label}
    variant="outline"
    size="sm"
    spacing={0}
    value={[value]}
    onValueChange={([next]) => {
      const chosen = options.find((option) => option.value === next);

      // Pressing the option that is already on leaves the group empty, and the order unchanged
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
