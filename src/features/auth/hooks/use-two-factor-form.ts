import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTwoFactorMutation } from "@/features/auth/hooks/use-two-factor-mutation";
import { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";
import type { TwoFactorFormValues } from "@/features/auth/types";

export const useTwoFactorForm = () => {
  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const { mutate: verifyTwoFactor, isPending } = useTwoFactorMutation({ form });

  const onSubmit = (values: TwoFactorFormValues) => verifyTwoFactor(values);

  return { form, onSubmit, isPending };
};
