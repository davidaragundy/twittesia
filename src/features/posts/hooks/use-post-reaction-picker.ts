import { useState } from "react";

import type { FeedPostReaction } from "@/features/posts/types/feed-post-reaction";
import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";

interface Props {
  reactions: FeedPostReaction[];
  onToggle: (reaction: PostReactionKey) => void;
}

export const usePostReactionPicker = ({ reactions, onToggle }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const select = (reaction: PostReactionKey) => {
    onToggle(reaction);
    setIsOpen(false);
  };

  const mine = new Set(reactions.filter((item) => item.isMine).map((item) => item.reaction));

  return { isOpen, onOpenChange: setIsOpen, select, mine };
};
