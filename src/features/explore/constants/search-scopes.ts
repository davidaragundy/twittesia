import { BubbleChatIcon, Layers01Icon, NoteIcon } from "@hugeicons/core-free-icons";

// What a search can be narrowed to; the first is what a search starts as
export const SEARCH_SCOPES = [
  { value: "all", label: "Everything", icon: Layers01Icon },
  { value: "posts", label: "Posts", icon: NoteIcon },
  { value: "comments", label: "Comments", icon: BubbleChatIcon },
] as const;
