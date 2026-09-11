import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, TwoFactorFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<TwoFactorFormValues>;
  closeDialog: () => void;
}

export const useVerifyTotpMutation = ({ form, closeDialog }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "INVALID_TWO_FACTOR_AUTHENTICATION":
        form.setError("code", { message: "Invalid one-time password" });
        return;

      default:
        toast.error("An error occurred 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const mutate = ({ code }: { code: string }) =>
    startTransition(async () => {
      const { error } = await authClient.twoFactor.verifyTotp({ code });

      if (error) return handleError(error);

      toast.success("Two-factor authentication enabled successfully 🎉", { duration: 10_000 });
      form.reset();

      // Closing and the refreshed session land together
      startTransition(() => {
        closeDialog();
        router.refresh();
      });
    });

  return { mutate, isPending };
};
