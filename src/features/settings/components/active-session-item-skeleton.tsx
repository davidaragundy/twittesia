import { Item, ItemContent, ItemMedia } from "@/shared/components/ui/item";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ActiveSessionItemSkeleton = () => {
  return (
    <Item>
      <ItemMedia variant="icon">
        <Skeleton className="size-4" />
      </ItemMedia>
      <ItemContent>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </ItemContent>
    </Item>
  );
};
