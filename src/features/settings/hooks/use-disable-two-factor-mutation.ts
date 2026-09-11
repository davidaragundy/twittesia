import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { ToggleTwoFactorFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ToggleTwoFactorFormValues>;
}

export const useDisableTwoFactorMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "INVALID_PASSWORD":
        form.setError("currentPassword", { message: "Invalid password" });
        return;

      default:
        toast.error("Failed to disable two-factor authentication 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const mutate = ({ password }: { password: string }) =>
    startTransition(async () => {
      const { error } = await authClient.twoFactor.disable({ password });

      if (error) return handleError(error);

      toast.success("Two-factor authentication has been disabled successfully 🎉", {
        duration: 10_000,
      });
      form.reset({ enableTwoFactor: false, currentPassword: "" });

      startTransition(() => router.refresh());
    });

  return { mutate, isPending };
};
