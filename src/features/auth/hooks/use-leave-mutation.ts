import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

export const useLeaveMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unwrapAuthResponse(authClient.signOut()),
    onSuccess: () => {
      // Nothing cached for this identity may show to whoever uses the browser next
      queryClient.clear();
      router.push("/");
    },
    onError: () => {
      toast.error("Couldn't leave", { description: "Please try again in a moment." });
    },
  });
};
