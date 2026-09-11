import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";

import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { changeEmailFormSchema } from "@/features/settings/schemas/change-email-form-schema";
import type { ChangeEmailFormValues } from "@/features/settings/types/change-email-form-values";

export const useChangeEmailForm = () => {
  const router = useRouter();
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailFormSchema),
    values: {
      email: session?.user.email ?? "",
    },
  });

  const { isDirty, isValid } = form.formState;
  const email = useWatch({ control: form.control, name: "email" });

  const canSubmit = isDirty && isValid && email?.trim() !== session?.user.email;

  // better-auth answers an address that is already taken with success too, so nobody can
  // probe which emails have accounts; every error left is unexpected
  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    toast.error("Something went wrong 😢", {
      description: "Please try again later",
      duration: 10_000,
    });
  };

  const onSubmit = ({ email }: ChangeEmailFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.changeEmail({
        newEmail: email,
        callbackURL: "/home?settings=account",
      });

      if (error) return handleError(error);

      toast.success("Change email confirmation", {
        description:
          "We sent a confirmation to your current email address. Please check your inbox (or spam folder) to approve the changes in order to update it.",
        duration: 20_000,
      });
      form.reset({ email });

      startTransition(() => router.refresh());
    });

  return { form, canSubmit, onSubmit, isPending };
};
