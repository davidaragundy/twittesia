import type { SEEDED_AVATAR_BODIES } from "@/shared/constants/seeded-avatar-bodies";
import type { SEEDED_AVATAR_EXTRAS } from "@/shared/constants/seeded-avatar-extras";
import type { SEEDED_AVATAR_EYES } from "@/shared/constants/seeded-avatar-eyes";
import type { SEEDED_AVATAR_MOUTHS } from "@/shared/constants/seeded-avatar-mouths";
import type { SEEDED_AVATAR_PALETTES } from "@/shared/constants/seeded-avatar-palettes";

export type SeededAvatarTraits = {
  palette: (typeof SEEDED_AVATAR_PALETTES)[number];
  body: (typeof SEEDED_AVATAR_BODIES)[number];
  eyes: (typeof SEEDED_AVATAR_EYES)[number];
  mouth: (typeof SEEDED_AVATAR_MOUTHS)[number];
  extra: (typeof SEEDED_AVATAR_EXTRAS)[number];
  hasBlush: boolean;
  // Where the pupils look, from -2 to 2 on each axis
  gaze: { x: number; y: number };
};
