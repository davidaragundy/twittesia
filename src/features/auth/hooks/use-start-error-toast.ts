import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { START_ERROR_COPY } from "@/features/auth/constants/start-error-copy";
import { START_ERROR_PARAM } from "@/features/auth/constants/start-error-param";

export const useStartErrorToast = () => {
  const searchParams = useSearchParams();
  const reason = searchParams.get(START_ERROR_PARAM);

  useEffect(() => {
    const copy = reason ? START_ERROR_COPY[reason] : undefined;

    if (!copy) return;

    // An id, so an effect that runs twice still shows it once
    toast.error(copy.title, { id: `start-error-${reason}`, description: copy.description });

    // Said once: a reload or a shared link doesn't say it again
    const url = new URL(window.location.href);

    url.searchParams.delete(START_ERROR_PARAM);
    window.history.replaceState(null, "", url);
  }, [reason]);
};
