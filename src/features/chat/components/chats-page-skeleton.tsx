import { Item, ItemContent, ItemGroup, ItemMedia } from "@/shared/components/ui/item";
import { Skeleton } from "@/shared/components/ui/skeleton";

// The chats page as it will arrive: its heading and button, then a few chats
export const ChatsPageSkeleton = () => (
  <div className="flex flex-col gap-8">
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </div>
      <Skeleton className="h-9 w-32 shrink-0" />
    </div>

    <ItemGroup>
      {[0, 1, 2].map((index) => (
        <Item key={index} variant="muted">
          <ItemMedia>
            <Skeleton className="size-10" />
          </ItemMedia>
          <ItemContent>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-24" />
          </ItemContent>
          <Skeleton className="h-5 w-24" />
        </Item>
      ))}
    </ItemGroup>
  </div>
);
