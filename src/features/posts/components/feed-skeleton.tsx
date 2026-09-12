import { Item, ItemContent, ItemGroup, ItemMedia } from "@/shared/components/ui/item";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const FeedSkeleton = () => (
  <ItemGroup className="gap-8">
    {[0, 1, 2].map((item) => (
      <Item key={item} className="items-start">
        <ItemMedia>
          <Skeleton className="size-8 rounded-full" />
        </ItemMedia>
        <ItemContent className="gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </ItemContent>
      </Item>
    ))}
  </ItemGroup>
);
