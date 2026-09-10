import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnonymousIcon,
  Chatting01Icon,
  Home01Icon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
  UserCheck01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { useSession } from "@/features/auth/hooks/use-session";

export const useSidebar = () => {
  const {
    data: session,
    isError: isSessionError,
    isLoading: isSessionLoading,
    isRefetching: isSessionRefetching,
    isSuccess: isSessionSuccess,
    refetch: refetchSession,
  } = useSession();

  const links = useMemo(
    () => [
      {
        href: "/home",
        label: "Home",
        icon: <HugeiconsIcon icon={Home01Icon} />,
      },
      {
        href: "/close-friends",
        label: "Close Friends",
        icon: <HugeiconsIcon icon={UserCheck01Icon} />,
      },
      {
        href: "/ghosts",
        label: "Ghosts",
        icon: <HugeiconsIcon icon={AnonymousIcon} />,
      },
      {
        href: "/explore",
        label: "Explore",
        icon: <HugeiconsIcon icon={Search01Icon} />,
      },
      {
        href: "/notifications",
        label: "Notifications",
        icon: <HugeiconsIcon icon={Notification01Icon} />,
      },
      {
        href: "/chat",
        label: "Chat",
        icon: <HugeiconsIcon icon={Chatting01Icon} />,
      },
      {
        href: `/${session?.user.username}`,
        label: "Profile",
        icon: <HugeiconsIcon icon={UserIcon} />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <HugeiconsIcon icon={Settings01Icon} />,
      },
    ],
    [session?.user.username],
  );

  return {
    isSessionError,
    isSessionLoading,
    isSessionRefetching,
    isSessionSuccess,
    links,
    refetchSession,
    session,
  };
};
