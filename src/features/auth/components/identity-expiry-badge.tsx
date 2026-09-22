import { Clock01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { RelativeTime } from "@/shared/components/relative-time";
import { Badge } from "@/shared/components/ui/badge";

type Props = {
  expiresAt: Date;
};

// How long an identity has left, which is the one thing about it that always matters here
export function IdentityExpiryBadge({ expiresAt }: Props) {
  return (
    <Badge variant="secondary">
      <Icon icon={Clock01Icon} data-icon="inline-start" />
      Ends <RelativeTime date={expiresAt} />
    </Badge>
  );
}
