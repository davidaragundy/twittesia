import { useState } from "react";

import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";

interface Props {
  reactions: FeedPostReaction[];
  onToggle: (emoji: string) => void;
}

export const usePostReactionPicker = ({ reactions, onToggle }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const select = (emoji: string) => {
    onToggle(emoji);
    setIsOpen(false);
  };

  const mine = new Set(reactions.filter((item) => item.isMine).map((item) => item.emoji));

  return { isOpen, onOpenChange: setIsOpen, select, mine };
};
