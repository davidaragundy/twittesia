import {
  BubbleChatLockIcon,
  Comment01Icon,
  Edit02Icon,
  LiveStreaming01Icon,
  Search01Icon,
  SmileIcon,
} from "@hugeicons/core-free-icons";

import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";
import { MAX_POST_MEDIA } from "@/features/posts/constants/max-post-media";

// What Twittesia does, as listed on the landing page. Every one of these exists today.
export const LANDING_HIGHLIGHTS = [
  {
    icon: Edit02Icon,
    title: "Posts",
    description: `${MAX_POST_LENGTH} characters, and up to ${MAX_POST_MEDIA} images, videos or audio clips.`,
  },
  {
    icon: Comment01Icon,
    title: "Comments",
    description: "Answer anyone. A comment goes when the post it is on does.",
  },
  {
    icon: SmileIcon,
    title: "Reactions",
    description: "Any emoji, as many as you like, on a post or a comment.",
  },
  {
    icon: Search01Icon,
    title: "Explore",
    description: "Search everything still alive. It forgives a typo and takes a phrase.",
  },
  {
    icon: LiveStreaming01Icon,
    title: "Live",
    description: "Posts, comments and reactions land on the page as they happen.",
  },
  {
    icon: BubbleChatLockIcon,
    title: "Private chat",
    description: "Two people, one link, and nothing written down. Not even by us.",
  },
];
