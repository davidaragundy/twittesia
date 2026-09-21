import { useState } from "react";
import { toast } from "sonner";

import { useIsMobile } from "@/shared/hooks/use-mobile";

export const usePostComposeDialog = () => {
  const isMobile = useIsMobile();
  const [isOpen, setOpen] = useState(false);

  // Written from wherever the reader was, so it says it went, rather than leaving them to look
  const onPublished = () => {
    setOpen(false);
    toast.success("Posted");
  };

  return { isMobile, isOpen, setOpen, onPublished };
};
