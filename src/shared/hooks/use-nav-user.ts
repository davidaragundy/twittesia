import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export const useNavUser = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(
    async (event?: Event) => {
      event?.preventDefault();

      if (isSigningOut) return;

      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        setIsSigningOut(false);
        toast.error("Failed to sign out. Please try again later.");
        return;
      }

      router.push("/sign-in");
    },
    [isSigningOut, router],
  );

  const handleThemeChange = useCallback(
    (event?: Event) => {
      event?.preventDefault();
      setTheme(theme === "dark" ? "light" : "dark");
    },
    [setTheme, theme],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey && !event.ctrlKey) return;

      if (event.shiftKey && event.key === "T") {
        event.preventDefault();
        handleThemeChange();
      }

      if (event.key === "o") {
        event.preventDefault();
        handleSignOut();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [handleSignOut, handleThemeChange]);

  return {
    handleSignOut,
    handleThemeChange,
    isMobile,
    isSigningOut,
    theme,
  };
};
