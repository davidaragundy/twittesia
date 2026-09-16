import { useEffect } from "react";

type Props = {
  id: string;
};

// The browser scrolls to a #fragment only if the element exists when navigation ends, and content
// that streams in behind Suspense arrives later
export const useScrollToHash = ({ id }: Props) => {
  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [id]);
};
