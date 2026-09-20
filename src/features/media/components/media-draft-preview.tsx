import { MusicNote03Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

import type { MediaDraft } from "@/features/media/types/media-draft";

interface Props {
  draft: MediaDraft;
}

// A chosen file, shown from the device: nothing has been uploaded yet
export const MediaDraftPreview = ({ draft }: Props) => {
  if (draft.kind === "image") {
    return (
      <Image
        src={draft.previewUrl}
        alt={draft.file.name}
        fill
        unoptimized
        className="object-cover"
      />
    );
  }

  if (draft.kind === "video") {
    return (
      <>
        <video
          src={draft.previewUrl}
          muted
          playsInline
          preload="metadata"
          aria-label={draft.file.name}
          className="size-full object-cover"
        />
        <span className="absolute bottom-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-background/80 backdrop-blur">
          <HugeiconsIcon icon={PlayIcon} className="size-3" />
        </span>
      </>
    );
  }

  return (
    <div className="flex size-full flex-col items-center justify-center gap-1.5 p-2 text-muted-foreground">
      <HugeiconsIcon icon={MusicNote03Icon} className="size-5" />
      <span className="w-full truncate text-center text-2xs">{draft.file.name}</span>
    </div>
  );
};
