"use client";

import { Delete02Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type Props = {
  // What the menu belongs to, as "Post" or "Comment"
  subject: string;
  onDelete: () => void;
};

export const DeleteActionsMenu = ({ subject, onDelete }: Props) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`${subject} actions`}
          className="-mt-1 -mr-1 rounded-full text-muted-foreground"
        />
      }
    >
      <HugeiconsIcon icon={MoreHorizontalIcon} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="min-w-44">
      <DropdownMenuItem variant="destructive" onClick={onDelete}>
        <HugeiconsIcon icon={Delete02Icon} />
        Delete {subject.toLowerCase()}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
