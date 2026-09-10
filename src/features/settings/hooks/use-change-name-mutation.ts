import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants";
import { authClient } from "@/shared/lib/better-auth/client";

import { SESSION_QUERY_KEY } from "@/features/auth/lib/query-keys";
import type { AuthClientError, Session } from "@/features/auth/types";
import type { ChangeNameFormValues } from "@/features/settings/types";

interface Props {
  form: UseFormReturn<ChangeNameFormValues>;
}

export const useChangeNameMutation = ({ form }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ChangeNameFormValues) => {
      const { error } = await authClient.updateUser({
        name: values.name,
      });

      if (error) return Promise.reject(error);
    },
    onSuccess: (_data, values) => {
      toast.success("Name updated successfully 🎉", {
        duration: 10_000,
      });

      queryClient.setQueryData([SESSION_QUERY_KEY], (old: Session) => ({
        ...old,
        user: {
          ...old.user,
          name: values.name,
        },
      }));

      form.reset({ name: values.name });
    },
    onError: (error: AuthClientError) => {
      if (error.status === RATE_LIMIT_ERROR_CODE) return;

      switch (error.code) {
        default:
          toast.error("Something went wrong 😢", {
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
