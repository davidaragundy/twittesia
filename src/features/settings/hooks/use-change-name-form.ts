import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import { useSession } from "@/features/auth/hooks/use-session";
import { changeName } from "@/features/settings/actions/change-name";
import { changeNameFormSchema } from "@/features/settings/schemas/change-name-form-schema";
import type { ChangeNameFormValues } from "@/features/settings/types/change-name-form-values";

export const useChangeNameForm = () => {
  const session = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ChangeNameFormValues>({
    resolver: zodResolver(changeNameFormSchema),
    values: {
      name: session?.user.name ?? "",
    },
  });

  const { isDirty, isValid } = form.formState;
  const name = useWatch({ control: form.control, name: "name" });

  const canSubmit = isDirty && isValid && name?.trim() !== session?.user.name;

  // The action refreshes the page in the same response, so the new name shows everywhere
  const onSubmit = (values: ChangeNameFormValues) =>
    startTransition(async () => {
      const { error } = await changeName(values);

      if (error?.code === "RATE_LIMITED") return void toastRateLimited();

      if (error) {
        toast.error("Something went wrong 😢", {
          description: "Please try again later",
          duration: 10_000,
        });
        return;
      }

      toast.success("Name updated successfully 🎉", { duration: 10_000 });
      form.reset(values);
    });

  return { form, canSubmit, onSubmit, isPending };
};
