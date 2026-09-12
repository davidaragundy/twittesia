import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";

interface Props {
  closeDialog: () => void;
}

// Deleting is confirmed from the email better-auth sends, so nothing is gone when this resolves
export const useDeleteAccountMutation = ({ closeDialog }: Props) =>
  useMutation({
    mutationFn: () => unwrapAuthResponse(authClient.deleteUser({ callbackURL: "/" })),
    onSuccess: () => {
      toast.success("Check your email to finish", {
        description: "We sent a link that deletes your account. It expires in an hour.",
      });
      closeDialog();
    },
    onError: (error: AuthClientError) =>
      handleAuthError(error, {
        fallback: () =>
          toast.error("Couldn't start deleting your account", {
            description: "Please try again in a moment.",
          }),
      }),
  });
