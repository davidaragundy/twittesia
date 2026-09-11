import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { authClient } from "@/features/auth/lib/auth-client";
import { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import type { TwoFactorFormValues } from "@/features/auth/types/two-factor-form-values";
import { getAuthErrorCode } from "@/features/auth/utils/get-auth-error-code";

interface Props {
  totpURI: string;
  closeDialog: () => void;
}

export const useSetupTwoFactorDialog = ({ totpURI, closeDialog }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  // URL.parse returns null instead of throwing on a malformed URI
  const key = URL.parse(totpURI)?.searchParams.get("secret") ?? "";

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (getAuthErrorCode(error)) {
      case "INVALID_CODE":
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

  const onSubmit = ({ code }: TwoFactorFormValues) =>
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

  return { form, onSubmit, isPending, key };
};
