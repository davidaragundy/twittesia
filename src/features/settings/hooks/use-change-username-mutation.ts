import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { changeUsername } from "@/features/settings/actions/change-username";
import type { ChangeUsernameFormValues } from "@/features/settings/types/change-username-form-values";

interface Props {
  form: UseFormReturn<ChangeUsernameFormValues>;
}

export const useChangeUsernameMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: changeUsername,
    onSuccess: ({ error }, values) => {
      if (error?.code === "USERNAME_TAKEN") {
        form.setError("username", { message: error.message });
        return;
      }

      if (error) {
        toast.error("Couldn't change your username", { description: error.message });
        return;
      }

      toast.success("Username updated");
      form.reset({ username: values.username.toLowerCase() });
      router.refresh();
    },
    onError: () => {
      toast.error("Couldn't change your username", {
        description: "Please try again in a moment.",
      });
    },
  });
};
