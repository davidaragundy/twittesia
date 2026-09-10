import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { AuthClientError } from "@/features/auth/types";
import { SESSION_QUERY_KEY } from "@/features/auth/lib/query-keys";
import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import type { ChangeUsernameFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeUsernameFormValues>;
}

export const useChangeUsernameMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      const { error } = await authClient.updateUser({
        username,
        displayUsername: username,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, values) => {
      toast.success("Username updated successfully 🎉", {
        duration: 10_000,
      });

      form.reset({ username: values.username });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        case "USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER":
          form.setError("username", {
            message: "Username is already taken. Please try another.",
          });
          return;

        default:
          toast.error("Failed to change username 😢", {
            description: "Please try again later",
            duration: 10_000,
          });
          return;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SESSION_QUERY_KEY] });
    },
  });
};
