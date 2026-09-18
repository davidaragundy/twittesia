"use client";

import { cn } from "cn";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";

import type { Media } from "@/features/media/types/media";

interface Props {
  media: Media;
  className?: string;
  style?: React.CSSProperties;
}

// Unoptimised: Blob's CDN already serves the file, and optimising it would spend the Hobby plan's
// image transformations on content that is gone within a day. Opens full size on a tap.
export const MediaImage = ({ media, className, style }: Props) => (
  <Dialog>
    <DialogTrigger
      aria-label="Open image"
      className={cn(
        "relative block overflow-hidden bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        className,
      )}
      style={style}
    >
      <Image
        src={media.url}
        alt="Attached image"
        fill
        unoptimized
        className="object-cover transition-opacity hover:opacity-90"
      />
    </DialogTrigger>

    {/* An explicit width: centred from the middle of the screen, a shrink-to-fit popup could
        never be wider than half of it */}
    <DialogContent className="w-[min(calc(100vw-2rem),64rem)] max-w-none bg-transparent p-0 shadow-none ring-0 sm:max-w-none">
      <DialogTitle className="sr-only">Attached image</DialogTitle>
      <Image
        src={media.url}
        alt="Attached image"
        width={media.width ?? 1200}
        height={media.height ?? 900}
        unoptimized
        className="h-auto max-h-[85svh] w-full rounded-3xl object-contain"
      />
    </DialogContent>
  </Dialog>
);
