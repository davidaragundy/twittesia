import { SEEDED_AVATAR_BODIES } from "@/shared/constants/seeded-avatar-bodies";
import { SEEDED_AVATAR_EXTRAS } from "@/shared/constants/seeded-avatar-extras";
import { SEEDED_AVATAR_EYES } from "@/shared/constants/seeded-avatar-eyes";
import { SEEDED_AVATAR_MOUTHS } from "@/shared/constants/seeded-avatar-mouths";
import { SEEDED_AVATAR_PALETTES } from "@/shared/constants/seeded-avatar-palettes";
import type { SeededAvatarTraits } from "@/shared/types/seeded-avatar-traits";
import { createSeededRandom } from "@/shared/utils/create-seeded-random";
import { hashString } from "@/shared/utils/hash-string";
import { pickValue } from "@/shared/utils/pick-value";

type Props = {
  seed: string;
};

// Uses no React state, so it is safe in Server Components too
export const useSeededAvatar = ({ seed }: Props): SeededAvatarTraits => {
  const random = createSeededRandom(hashString(seed));

  return {
    palette: pickValue({ values: SEEDED_AVATAR_PALETTES, random }),
    body: pickValue({ values: SEEDED_AVATAR_BODIES, random }),
    eyes: pickValue({ values: SEEDED_AVATAR_EYES, random }),
    mouth: pickValue({ values: SEEDED_AVATAR_MOUTHS, random }),
    extra: pickValue({ values: SEEDED_AVATAR_EXTRAS, random }),
    hasBlush: random() < 0.5,
    gaze: { x: Math.round((random() - 0.5) * 4), y: Math.round((random() - 0.5) * 4) },
  };
};
