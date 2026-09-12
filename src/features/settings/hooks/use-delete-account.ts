import { useState } from "react";

import { useDeleteAccountMutation } from "@/features/settings/hooks/use-delete-account-mutation";

export const useDeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = useDeleteAccountMutation({ closeDialog: () => setIsOpen(false) });

  return {
    isOpen,
    onOpenChange: setIsOpen,
    isPending,
    confirm: () => mutate(),
  };
};
