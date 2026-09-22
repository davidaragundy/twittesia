import { cn } from "cn";

interface Props {
  isHere: boolean;
  isConnected: boolean;
}

// Whether the other person has the chat open. It comes from their connection rather than from
// anything kept, so it is only ever about right now. Their name is right above it, so it says
// only which.
export const ChatPresence = ({ isHere, isConnected }: Props) => (
  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <span
      aria-hidden
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        isConnected && isHere ? "bg-success" : "bg-muted-foreground/40",
      )}
    />
    {!isConnected ? "Reconnecting…" : isHere ? "Here now" : "Away"}
  </span>
);
