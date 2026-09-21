"use client";

import { ImageAdd02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { InputGroupButton } from "@/shared/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

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
      <Tooltip>
        <TooltipTrigger
          render={
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={open}
              disabled={disabled}
              aria-label="Attach images, video or audio"
            />
          }
        >
          <Icon icon={ImageAdd02Icon} />
        </TooltipTrigger>
        <TooltipContent>Attach images, video or audio</TooltipContent>
      </Tooltip>
    </>
  );
};
