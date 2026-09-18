import { MusicNote03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Media } from "@/features/media/types/media";

interface Props {
  media: Media;
}

// Nothing loads until someone presses play, to spare the plan's monthly transfer
export const MediaAudio = ({ media }: Props) => (
  <div className="flex items-center gap-3 rounded-3xl bg-muted/60 py-2 pr-2 pl-4 ring-1 ring-foreground/5">
    <HugeiconsIcon icon={MusicNote03Icon} className="size-5 shrink-0 text-muted-foreground" />
    <audio
      src={media.url}
      controls
      preload="none"
      aria-label="Attached audio"
      className="h-10 min-w-0 flex-1"
    />
  </div>
);
