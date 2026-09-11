import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

export const useSignOutMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unwrapAuthResponse(authClient.signOut()),
    onSuccess: () => {
      // Nothing cached for this account may show to whoever signs in next
      queryClient.clear();
      router.push("/sign-in");
    },
    onError: () => {
      toast.error("Failed to sign out. Please try again later.");
    },
  });
};
