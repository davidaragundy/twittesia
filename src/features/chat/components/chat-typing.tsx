interface Props {
  name: string;
}

// The other side is writing. It says nothing about what, and goes by itself when they stop.
export const ChatTyping = ({ name }: Props) => (
  <p className="px-2 pb-1 text-xs text-muted-foreground" aria-live="polite">
    {name} is writing…
  </p>
);
