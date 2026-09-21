import type { SortOption } from "@/shared/types/sort-option";

type Props<Value extends string> = {
  options: readonly SortOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
};

export const useSortMenu = <Value extends string>({ options, value, onChange }: Props<Value>) => {
  const current = options.find((option) => option.value === value) ?? options[0];

  // The menu hands back a plain string; only one of the options is ever accepted
  const select = (next: unknown) => {
    const chosen = options.find((option) => option.value === next);

    if (chosen) onChange(chosen.value);
  };

  return { current, select };
};
