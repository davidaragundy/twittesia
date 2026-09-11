import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useSignUpEmailMutation } from "@/features/auth/hooks/use-sign-up-email-mutation";
import { signUpFormSchema } from "@/features/auth/schemas/sign-up-form-schema";
import type { SignUpFormValues } from "@/features/auth/types/sign-up-form-values";

export const useSignUpForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useSignUpEmailMutation({ form });

  const onSubmit = (values: SignUpFormValues) => mutate(values);

  return { form, onSubmit, isPending };
};
