import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";
import type { TwoFactorFormValues } from "@/features/auth/types/two-factor-form-values";
import { verifyTwoFactor } from "@/features/settings/actions/verify-two-factor";

interface Props {
  totpURI: string;
  closeDialog: () => void;
}

export const useSetupTwoFactorDialog = ({ totpURI, closeDialog }: Props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  // URL.parse returns null instead of throwing on a malformed URI
  const key = URL.parse(totpURI)?.searchParams.get("secret") ?? "";

  const onSubmit = (values: TwoFactorFormValues) =>
    startTransition(async () => {
      const { error } = await verifyTwoFactor(values);

      switch (error?.code) {
        case undefined:
          toast.success("Two-factor authentication enabled successfully 🎉", {
            duration: 10_000,
          });
          form.reset();
          startTransition(() => closeDialog());
          return;

        case "INVALID_CODE":
          form.setError("code", { message: "Invalid one-time password" });
          return;

        case "RATE_LIMITED":
          toastRateLimited();
          return;

        default:
          toast.error("An error occurred 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    });

  return { form, onSubmit, isPending, key };
};
