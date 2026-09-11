import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { useSession } from "@/features/auth/hooks/use-session";
import { changeUsername } from "@/features/settings/actions/change-username";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import type { ChangeUsernameFormValues } from "@/features/settings/types/change-username-form-values";

export const useChangeUsernameForm = () => {
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangeUsernameFormValues>({
    // Validates as you type, so a disabled Save button always comes with the reason
    mode: "onChange",
    resolver: zodResolver(changeUsernameFormSchema),
    values: {
      username: session?.user.displayUsername ?? "",
    },
  });

  const { isDirty, isValid } = form.formState;
  const username = useWatch({ control: form.control, name: "username" });

  const canSubmit = isDirty && isValid && username?.trim() !== session?.user.displayUsername;

  const onSubmit = (values: ChangeUsernameFormValues) =>
    startTransition(async () => {
      const { error } = await changeUsername(values);

      switch (error?.code) {
        case undefined:
          toast.success("Username updated successfully 🎉", { duration: 10_000 });
          form.reset(values);
          return;

        case "USERNAME_IS_ALREADY_TAKEN":
          form.setError("username", { message: "Username is already taken. Please try another." });
          return;

        case "RATE_LIMITED":
          toastRateLimited();
          return;

        // Client validation normally stops this first; show why the server refused
        case "INVALID_INPUT":
          toast.error(error.message, { duration: 10_000 });
          return;

        default:
          toast.error("Failed to change username 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    });

  return { form, canSubmit, onSubmit, isPending };
};
