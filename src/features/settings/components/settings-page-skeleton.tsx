import { Skeleton } from "@/shared/components/ui/skeleton";

import { AccountDetailsSkeleton } from "@/features/settings/components/account-details-skeleton";

// The settings page as it will arrive: its heading, the sections and the first section's fields
export const SettingsPageSkeleton = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-5 w-full max-w-sm" />
    </div>
    <Skeleton className="h-9 w-28" />
    <AccountDetailsSkeleton />
  </div>
);
