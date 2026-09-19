import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { leave } from "@/features/settings/actions/leave";

export const useLeaveMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leave,
    onSuccess: ({ error }) => {
      if (error) {
        toast.error("Couldn't leave", { description: error.message });
        return;
      }

      // Nothing cached for this identity may show to whoever uses the browser next
      queryClient.clear();
      router.push("/");
    },
    onError: () => {
      toast.error("Couldn't leave", { description: "Please try again in a moment." });
    },
  });
};
