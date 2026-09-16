import { SEEDED_AVATAR_ACCENTS } from "@/shared/constants/seeded-avatar-accents";
import { SEEDED_AVATAR_LINE } from "@/shared/constants/seeded-avatar-line";
import type { SeededAvatarTraits } from "@/shared/types/seeded-avatar-traits";

type Props = Pick<SeededAvatarTraits, "extra" | "palette">;

export function SeededAvatarExtra({ extra, palette }: Props) {
  const { background, ink } = palette;

  switch (extra) {
    case "antenna":
      return (
        <>
          <path d="M32 22 V9" {...SEEDED_AVATAR_LINE} stroke={ink} />
          <circle cx="32" cy="8" r="3.5" fill={background} stroke={ink} strokeWidth="2.5" />
        </>
      );
    case "horns":
      return (
        <path
          d="M19 24 L15 11 L26 19 Z M45 24 L49 11 L38 19 Z"
          fill={ink}
          stroke={ink}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "sprout":
      return (
        <path
          d="M32 22 C32 16 30 12 25 9 C31 9 34 12 32 22 C33 15 37 11 42 11 C38 13 34 16 32 22"
          fill={SEEDED_AVATAR_ACCENTS.leaf}
          stroke={ink}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case "party-hat":
      return (
        <>
          <path
            d="M24 20 L32 3 L40 20 Z"
            fill={ink}
            stroke={ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle
            cx="32"
            cy="4"
            r="2.5"
            fill={SEEDED_AVATAR_ACCENTS.sclera}
            stroke={ink}
            strokeWidth="1.5"
          />
        </>
      );
    case "none":
      return null;
  }
}
