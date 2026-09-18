"use client";

import { cn } from "cn";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";

import { MediaSlide } from "@/features/media/components/media-slide";
import { MEDIA_CAROUSEL_OPTIONS } from "@/features/media/constants/media-carousel-options";
import { useMediaCarousel } from "@/features/media/hooks/use-media-carousel";
import type { Media } from "@/features/media/types/media";
import { getMediaAspectRatio } from "@/features/media/utils/get-media-aspect-ratio";

interface Props {
  media: Media[];
}

// One file at a time, swiped on a touch screen, where the arrows would only cover the file, and
// stepped through with the arrows or the keyboard elsewhere. Every slide takes the shape of the first image or video, so the post never jumps.
export const MediaCarousel = ({ media }: Props) => {
  const { setApi, selected, scrollTo } = useMediaCarousel();
  const aspectRatio = getMediaAspectRatio(
    media.find((item) => item.kind !== "audio") ?? { width: null, height: null },
  );

  return (
    <Carousel
      setApi={setApi}
      opts={MEDIA_CAROUSEL_OPTIONS}
      aria-label="Attached media"
      className="group/carousel flex flex-col gap-3"
    >
      <div className="relative">
        <CarouselContent className="-ml-2">
          {media.map((item, index) => (
            <CarouselItem
              key={item.id}
              aria-label={`${index + 1} of ${media.length}`}
              className="pl-2"
            >
              <MediaSlide media={item} aspectRatio={aspectRatio} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium tabular-nums backdrop-blur">
          {selected + 1}/{media.length}
        </span>

        <CarouselPrevious
          variant="secondary"
          className="left-3 bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 disabled:opacity-0! pointer-coarse:hidden"
        />
        <CarouselNext
          variant="secondary"
          className="right-3 bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover/carousel:opacity-100 focus-visible:opacity-100 disabled:opacity-0! pointer-coarse:hidden"
        />
      </div>

      <div className="flex justify-center gap-1.5">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Show ${index + 1} of ${media.length}`}
            aria-current={index === selected}
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === selected
                ? "w-4 bg-foreground"
                : "w-1.5 bg-foreground/25 hover:bg-foreground/50",
            )}
          />
        ))}
      </div>
    </Carousel>
  );
};
