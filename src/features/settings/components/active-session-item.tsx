"use client";

import { ComputerIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/shared/components/ui/item";

import type { Session } from "@/features/auth/types";
import { useActiveSessionItem } from "@/features/settings/hooks/use-active-session-item";

interface Props {
  session: Omit<Session["session"], "id">;
  isCurrentSession: boolean;
  isSessionsFetching: boolean;
}

export const ActiveSessionItem = ({ session, isCurrentSession, isSessionsFetching }: Props) => {
  const { handleRevokeSession } = useActiveSessionItem();

  return (
    <Item>
      <ItemMedia variant="icon">
        <HugeiconsIcon icon={ComputerIcon} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {session.userAgent || "Unknown device"}
          {isCurrentSession && <Badge variant="secondary">Current</Badge>}
        </ItemTitle>
        <ItemDescription>
          {session.ipAddress || "Unknown IP"} · Last active{" "}
          {new Date(session.updatedAt).toLocaleString()}
        </ItemDescription>
      </ItemContent>
      {!isCurrentSession && (
        <ItemActions>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSessionsFetching}
            onClick={() => handleRevokeSession(session.token)}
          >
            Revoke
          </Button>
        </ItemActions>
      )}
    </Item>
  );
};
