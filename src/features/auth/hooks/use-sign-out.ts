import { useSignOutMutation } from "@/features/auth/hooks/use-sign-out-mutation";

export const useSignOut = () => {
  const { mutate, isPending } = useSignOutMutation();

  const signOut = () => {
    if (!isPending) mutate();
  };

  return { signOut, isSigningOut: isPending };
};
