import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import type { ChangeEmailFormValues } from "@/features/settings/types/change-email-form-values";

interface Props {
  form: UseFormReturn<ChangeEmailFormValues>;
}

export const useChangeEmailMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email }: ChangeEmailFormValues) =>
      unwrapAuthResponse(
        authClient.changeEmail({ newEmail: email, callbackURL: "/home?settings=account" }),
      ),
    onSuccess: (_data, values) => {
      toast.success("Change email confirmation", {
        description:
          "We sent a confirmation to your current email address. Please check your inbox (or spam folder) to approve the changes in order to update it.",
        duration: 20_000,
      });
      form.reset(values);
      router.refresh();
    },
    // better-auth answers an address that is already taken with success too, so nobody can
    // probe which emails have accounts; every error left is unexpected
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      toast.error("Something went wrong 😢", {
        description: "Please try again later",
        duration: 10_000,
      });
    },
  });
};
