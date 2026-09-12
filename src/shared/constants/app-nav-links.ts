import {
  Chatting01Icon,
  Home01Icon,
  Search01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";

import type { NavLink } from "@/shared/types/nav-link";

export const APP_NAV_LINKS: NavLink[] = [
  { href: "/home", label: "Home", icon: Home01Icon },
  { href: "/close-friends", label: "Close friends", icon: UserCheck01Icon },
  { href: "/explore", label: "Explore", icon: Search01Icon },
  { href: "/chat", label: "Chat", icon: Chatting01Icon },
];
