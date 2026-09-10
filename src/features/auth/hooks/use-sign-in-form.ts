import { useSignInSocialMutation } from "@/features/auth/hooks/use-sign-in-social-mutation";

export const useSignInForm = () => {
  const { mutate, isPending } = useSignInSocialMutation();

  const handleSignInWithGitHub = () => mutate({ provider: "github" });
  const handleSignInWithGoogle = () => mutate({ provider: "google" });

  return { isPending, handleSignInWithGitHub, handleSignInWithGoogle };
};
