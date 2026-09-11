import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError, TwoFactorFormValues } from "@/features/auth/types";

interface Props {
  form: UseFormReturn<TwoFactorFormValues>;
}

export const useTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "INVALID_TWO_FACTOR_AUTHENTICATION":
        form.setError("code", { message: "Invalid one-time password" });
        return;

      default:
        toast.error("An error occurred, please try again later 😢");
        return;
    }
  };

  const mutate = (values: TwoFactorFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.twoFactor.verifyTotp({ code: values.code });

      if (error) return handleError(error);

      startTransition(() => router.push("/home"));
    });

  return { mutate, isPending };
};
