import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { changeName } from "@/features/settings/actions/change-name";
import type { ChangeNameFormValues } from "@/features/settings/types/change-name-form-values";

interface Props {
  form: UseFormReturn<ChangeNameFormValues>;
}

export const useChangeNameMutation = ({ form }: Props) => {
  const router = useRouter();

  return useMutation({
    mutationFn: changeName,
    onSuccess: ({ error }, values) => {
      if (error) {
        toast.error("Couldn't change your name", { description: error.message });
        return;
      }

      toast.success("Name updated");
      form.reset(values);

      // The session is read per request, so a refresh shows the new name right away
      router.refresh();
    },
    onError: () => {
      toast.error("Something went wrong", { description: "Please try again in a moment." });
    },
  });
};
