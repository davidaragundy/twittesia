import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { useSession } from "@/features/auth/hooks/use-session";
import { changeEmail } from "@/features/settings/actions/change-email";
import { changeEmailFormSchema } from "@/features/settings/schemas/change-email-form-schema";
import type { ChangeEmailFormValues } from "@/features/settings/types/change-email-form-values";

export const useChangeEmailForm = () => {
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
  const onSubmit = (values: ChangeEmailFormValues) =>
    startTransition(async () => {
      const { error } = await changeEmail(values);

      if (error?.code === "RATE_LIMITED") return void toastRateLimited();

      if (error) {
        toast.error("Something went wrong 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
      }

      toast.success("Change email confirmation", {
        description:
          "We sent a confirmation to your current email address. Please check your inbox (or spam folder) to approve the changes in order to update it.",
        duration: 20_000,
      });
      form.reset(values);
    });

  return { form, canSubmit, onSubmit, isPending };
};
