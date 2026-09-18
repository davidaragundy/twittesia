import { useEffect, useState } from "react";

import type { CarouselApi } from "@/shared/components/ui/carousel";

// Which slide is showing, for the counter and the dots
export const useMediaCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelected(api.selectedScrollSnap());

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return { setApi, selected, scrollTo: (index: number) => api?.scrollTo(index) };
};
