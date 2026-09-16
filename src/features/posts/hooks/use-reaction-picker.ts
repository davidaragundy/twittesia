import { useState } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

import type { Reaction } from "@/features/posts/types/reaction";

interface Props {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
}

export const useReactionPicker = ({ reactions, onToggle }: Props) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const select = (emoji: string) => {
    onToggle(emoji);
    setIsOpen(false);
  };

  const mine = new Set(reactions.filter((item) => item.isMine).map((item) => item.emoji));

  return { isMobile, isOpen, onOpenChange: setIsOpen, select, mine };
};
