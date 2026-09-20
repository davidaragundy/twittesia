import { cn } from "cn";

interface Props {
  name: string;
  isHere: boolean;
  isConnected: boolean;
}

// Whether the other person has the chat open. It comes from their connection rather than from
// anything kept, so it is only ever about right now.
export const ChatPresence = ({ name, isHere, isConnected }: Props) => (
  <span className="flex items-center gap-2 truncate text-xs text-muted-foreground">
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full",
        !isConnected
          ? "bg-muted-foreground/40"
          : isHere
            ? "bg-emerald-500"
            : "bg-muted-foreground/40",
      )}
    />
    <span className="truncate">
      {!isConnected ? "Reconnecting…" : isHere ? `${name} is here` : `${name} isn't here`}
    </span>
  </span>
);
