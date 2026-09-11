import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { ChangeEmailFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeEmailFormValues>;
}

export const useChangeEmailMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    switch (error.code) {
      case "COULDNT_UPDATE_YOUR_EMAIL":
        form.setError("email", { message: "A user with that email already exists" });
        return;

      default:
        toast.error("Something went wrong 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
    }
  };

  const mutate = (values: ChangeEmailFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.changeEmail({
        newEmail: values.email,
        callbackURL: "/home?settings=account",
      });

      if (error) return handleError(error);

      toast.success("Change email confirmation", {
        description:
          "We sent a confirmation to your current email address. Please check your inbox (or spam folder) to approve the changes in order to update it.",
        duration: 20_000,
      });
      form.reset({ email: values.email });

      startTransition(() => router.refresh());
    });

  return { mutate, isPending };
};
