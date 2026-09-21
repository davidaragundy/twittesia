import { Marker, MarkerContent } from "@/shared/components/ui/marker";

interface Props {
  name: string;
}

// The other side is writing. It says nothing about what, and goes by itself when they stop.
export const ChatTyping = ({ name }: Props) => (
  <Marker role="status">
    <MarkerContent>
      <span className="shimmer">{name} is writing…</span>
    </MarkerContent>
  </Marker>
);
