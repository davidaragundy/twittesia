import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useMagicLinkMutation } from "@/features/auth/hooks/use-magic-link-mutation";
import { magicLinkFormSchema } from "@/features/auth/schemas/magic-link-form-schema";
import type { MagicLinkFormValues } from "@/features/auth/types/magic-link-form-values";

export const useMagicLinkForm = () => {
  const form = useForm<MagicLinkFormValues>({
    resolver: zodResolver(magicLinkFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMagicLinkMutation({ form });

  const onSubmit = (values: MagicLinkFormValues) => mutate(values);

  return { form, onSubmit, isPending };
};
