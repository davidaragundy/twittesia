import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { AuthClientError } from "@/features/auth/types";
import type { ChangeNameFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeNameFormValues>;
}

export const useChangeNameMutation = ({ form }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleError = (error: AuthClientError) => {
    if (error.status === RATE_LIMIT_ERROR_CODE) return;

    toast.error("Something went wrong 😢", {
      description: "Please try again later",
      duration: 10_000,
    });
  };

  const mutate = (values: ChangeNameFormValues) =>
    startTransition(async () => {
      const { error } = await authClient.updateUser({ name: values.name });

      if (error) return handleError(error);

      toast.success("Name updated successfully 🎉", { duration: 10_000 });
      form.reset({ name: values.name });

      // Re-renders the server parts with the new name, inside this transition
      startTransition(() => router.refresh());
    });

  return { mutate, isPending };
};
