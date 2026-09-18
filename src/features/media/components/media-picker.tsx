"use client";

import { ImageAdd02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { InputGroupButton } from "@/shared/components/ui/input-group";

import { MEDIA_ACCEPT } from "@/features/media/constants/media-accept";
import { useMediaPicker } from "@/features/media/hooks/use-media-picker";

interface Props {
  onPick: (files: File[]) => void;
  // Whether more than one file can be chosen at once
  multiple: boolean;
  disabled?: boolean;
}

export const MediaPicker = ({ onPick, multiple, disabled }: Props) => {
  const { inputRef, open, onChange } = useMediaPicker({ onPick });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={MEDIA_ACCEPT}
        multiple={multiple}
        onChange={onChange}
        tabIndex={-1}
        hidden
      />
      <InputGroupButton
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={open}
        disabled={disabled}
        aria-label="Attach images, video or audio"
        title="Attach images, video or audio"
        className="rounded-full"
      >
        <HugeiconsIcon icon={ImageAdd02Icon} />
      </InputGroupButton>
    </>
  );
};
