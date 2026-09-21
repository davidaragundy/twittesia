"use client";

import { Toggle } from "@/shared/components/ui/toggle";

import { ReactionPicker } from "@/features/posts/components/reaction-picker";
import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
  // Shown but not yet pressable, for something the server hasn't saved
  disabled?: boolean;
}

// The chips and the picker, for a post or a comment
export const Reactions = ({ reactions, onToggle, disabled }: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    {reactions.map(({ emoji, count, isMine }) => (
      <Toggle
        key={emoji}
        size="sm"
        pressed={isMine}
        disabled={disabled}
        onPressedChange={() => onToggle(emoji)}
        aria-label={`${emoji} ${count}`}
      >
        <span className="text-base leading-none">{emoji}</span>
        {count}
      </Toggle>
    ))}
    <ReactionPicker reactions={reactions} onToggle={onToggle} disabled={disabled} />
  </div>
);
