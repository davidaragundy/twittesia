import type { CarouselApi } from "@/shared/components/ui/carousel";

type CarouselOptions = NonNullable<Parameters<NonNullable<CarouselApi>["reInit"]>[0]>;

// A drag that starts on a seek bar moves through the clip, not to the next slide
export const MEDIA_CAROUSEL_OPTIONS: CarouselOptions = {
  align: "start",
  watchDrag: (_, event) =>
    !(event.target instanceof Element && event.target.closest("[data-slot=slider]")),
};
