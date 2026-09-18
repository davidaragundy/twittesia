import type { ChangeEvent } from "react";
import { useRef } from "react";

interface Props {
  onPick: (files: File[]) => void;
}

export const useMediaPicker = ({ onPick }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    // Cleared, so choosing the same file again after removing it still counts as a change
    event.target.value = "";

    if (files.length) onPick(files);
  };

  return { inputRef, open: () => inputRef.current?.click(), onChange };
};
