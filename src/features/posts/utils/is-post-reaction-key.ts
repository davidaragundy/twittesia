import { POST_REACTION_KEYS } from "@/features/posts/constants/post-reaction-keys";
import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";

export const isPostReactionKey = (value: string): value is PostReactionKey =>
  (POST_REACTION_KEYS as readonly string[]).includes(value);
