"use client";

import { Toggle } from "@/shared/components/ui/toggle";

import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
  // Shown but not yet pressable, for something the server hasn't saved
  disabled?: boolean;
}

// The reactions given so far, for a post or a comment, each one a chip to add yours to. Nothing is
// drawn when there are none; adding the first is the picker's job.
export const Reactions = ({ reactions, onToggle, disabled }: Props) => {
  if (!reactions.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
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
          <span className="tabular-nums">{count}</span>
        </Toggle>
      ))}
    </div>
  );
};
