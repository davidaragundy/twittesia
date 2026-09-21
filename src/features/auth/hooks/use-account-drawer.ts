import { useState } from "react";

import { useSession } from "@/features/auth/hooks/use-session";

export const useAccountDrawer = () => {
  const session = useSession();
  const [isOpen, setOpen] = useState(false);

  return { user: session?.user, isOpen, setOpen, close: () => setOpen(false) };
};
