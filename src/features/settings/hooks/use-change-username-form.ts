import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { useSession } from "@/features/auth/hooks/use-session";
import { useChangeUsernameMutation } from "@/features/settings/hooks/use-change-username-mutation";
import { changeUsernameFormSchema } from "@/features/settings/schemas/change-username-form-schema";
import type { ChangeUsernameFormValues } from "@/features/settings/types";

export const useChangeUsernameForm = () => {
  const session = useSession();

  const form = useForm<ChangeUsernameFormValues>({
    resolver: zodResolver(changeUsernameFormSchema),
    values: {
      username: session?.user.displayUsername ?? "",
    },
  });

  const { mutate, isPending } = useChangeUsernameMutation({
    form,
  });

  const { isDirty, isValid } = form.formState;
  const username = useWatch({ control: form.control, name: "username" });

  const canSubmit = isDirty && isValid && username?.trim() !== session?.user.displayUsername;

  const onSubmit = (values: ChangeUsernameFormValues) => mutate(values);

  return {
    form,
    canSubmit,
    onSubmit,
    isPending,
  };
};
