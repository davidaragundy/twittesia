import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/features/auth/lib/auth-client";
import type { AuthClientError } from "@/features/auth/types/auth-client-error";
import { handleAuthError } from "@/features/auth/utils/handle-auth-error";
import { unwrapAuthResponse } from "@/features/auth/utils/unwrap-auth-response";
import type { ChangeNameFormValues } from "@/features/settings/types/change-name-form-values";

interface Props {
  form: UseFormReturn<ChangeNameFormValues>;
}

export const useChangeNameMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ name }: ChangeNameFormValues) =>
      unwrapAuthResponse(authClient.updateUser({ name })),
    onSuccess: (_data, values) => {
      toast.success("Name updated");
      form.reset(values);

      // The session is read per request, so a refresh shows the new name right away
      router.refresh();
    },
    onError: (error: AuthClientError) => {
      handleAuthError(error, {
        fallback: () => {
          toast.error("Something went wrong", {
            description: "Please try again in a moment.",
          });
        },
      });
    },
  });
};
