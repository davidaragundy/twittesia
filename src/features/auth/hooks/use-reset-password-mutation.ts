import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, ResetPasswordFormValues } from "@/features/auth/types";

interface Props {
  token: string;
}

export const useResetPasswordMutation = ({ token }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "INVALID_TOKEN":
        toast.error("Invalid token 😢", {
          description: "Please request a new password reset link.",
          duration: 10_000,
          action: {
            label: "Request new link",
            onClick: () => router.push("/forgot-password"),
          },
        });
        return;

      default:
        toast.error("Something went wrong 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const mutate = (values: ResetPasswordFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.resetPassword({ newPassword: values.password, token });

      if (error) return handleError(error);

      toast.success("Password reset successfully 🎉", {
        description: "You can now sign in with your new password.",
        duration: 10_000,
      });

      startTransition(() => router.push("/sign-in"));
    });

  return { mutate, isPending };
};
