import type { PostReactionKey } from "@/features/posts/types/post-reaction-key";

// Stored by key, so a glyph can change without rewriting a row
export const POST_REACTION_EMOJIS: Record<PostReactionKey, { emoji: string; label: string }> = {
  "thumbs-up": { emoji: "👍", label: "Thumbs up" },
  heart: { emoji: "❤️", label: "Love" },
  laugh: { emoji: "😂", label: "Laugh" },
  fire: { emoji: "🔥", label: "Fire" },
  eyes: { emoji: "👀", label: "Eyes" },
  party: { emoji: "🎉", label: "Party" },
  "mind-blown": { emoji: "🤯", label: "Mind blown" },
  sad: { emoji: "😢", label: "Sad" },
};
