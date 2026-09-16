import { useSearchParams } from "next/navigation";

import { LEAVE_SEARCH_PARAM } from "@/features/auth/constants/leave-search-param";
import { useLeaveMutation } from "@/features/auth/hooks/use-leave-mutation";
import { writeLeaveOpen } from "@/features/auth/utils/write-leave-open";

// Open state lives in the URL, so the mobile button and the account menu open the one dialog
// the layout renders, from two different parts of the tree
export const useLeaveDialog = () => {
  const searchParams = useSearchParams();
  const { mutate, isPending } = useLeaveMutation();

  const onOpenChange = (open: boolean) => {
    // Closing mid-request would leave the spinner nowhere to live
    if (!isPending) writeLeaveOpen(open);
  };

  return {
    isOpen: searchParams.get(LEAVE_SEARCH_PARAM) !== null,
    isPending,
    onOpenChange,
    confirm: () => {
      if (!isPending) mutate();
    },
  };
};
