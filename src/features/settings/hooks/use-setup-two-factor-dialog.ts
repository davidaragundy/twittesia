import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { twoFactorSchema } from "@/features/auth/schemas/two-factor-schema";
import type { TwoFactorFormValues } from "@/features/auth/types/two-factor-form-values";
import { useVerifyTotpMutation } from "@/features/settings/hooks/use-verify-totp-mutation";

interface Props {
  totpURI: string;
  closeDialog: () => void;
}

export const useSetupTwoFactorDialog = ({ totpURI, closeDialog }: Props) => {
  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  // URL.parse returns null instead of throwing on a malformed URI
  const key = URL.parse(totpURI)?.searchParams.get("secret") ?? "";

  const { mutate, isPending } = useVerifyTotpMutation({ form, closeDialog });

  const onSubmit = (values: TwoFactorFormValues) => mutate(values);

  return { form, onSubmit, isPending, key };
};
