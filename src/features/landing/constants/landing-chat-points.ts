import {
  Clock01Icon,
  LinkSquare01Icon,
  LockKeyIcon,
  ShieldKeyIcon,
} from "@hugeicons/core-free-icons";

// What is true of a chat, for the part of the landing page that is about them
export const LANDING_CHAT_POINTS = [
  {
    icon: LinkSquare01Icon,
    title: "One link, one person",
    description:
      "Send it to whoever you want. They ask to join, you see their handle and decide, and the link is spent once someone is in.",
  },
  {
    icon: LockKeyIcon,
    title: "Encrypted in your browser",
    description:
      "The key comes from the half of the link after the #, which browsers never send us. We pass on what we have no way to open.",
  },
  {
    icon: ShieldKeyIcon,
    title: "Check nobody is between you",
    description:
      "Both of you see the same safety number. Read it out loud: if it matches, the conversation is yours alone.",
  },
  {
    icon: Clock01Icon,
    title: "Kept nowhere, gone within a day",
    description:
      "Messages pass between the two of you and are stored nowhere, so neither we nor you can read one back. The chat ends within a day, or sooner if whoever started it ends it.",
  },
];
