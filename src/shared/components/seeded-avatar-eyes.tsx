import { SEEDED_AVATAR_ACCENTS } from "@/shared/constants/seeded-avatar-accents";
import { SEEDED_AVATAR_LINE } from "@/shared/constants/seeded-avatar-line";
import type { SeededAvatarTraits } from "@/shared/types/seeded-avatar-traits";

type Props = Pick<SeededAvatarTraits, "eyes" | "gaze"> & {
  ink: string;
};

export function SeededAvatarEyes({ eyes, gaze, ink }: Props) {
  switch (eyes) {
    case "dots":
      return (
        <>
          <circle cx="24" cy="36" r="3" fill={ink} />
          <circle cx="40" cy="36" r="3" fill={ink} />
        </>
      );
    case "googly":
      return (
        <>
          <circle
            cx="24"
            cy="35"
            r="6"
            fill={SEEDED_AVATAR_ACCENTS.sclera}
            stroke={ink}
            strokeWidth="2"
          />
          <circle
            cx="40"
            cy="35"
            r="6"
            fill={SEEDED_AVATAR_ACCENTS.sclera}
            stroke={ink}
            strokeWidth="2"
          />
          <circle cx={24 + gaze.x} cy={35 + gaze.y} r="2.75" fill={ink} />
          <circle cx={40 + gaze.x} cy={35 + gaze.y} r="2.75" fill={ink} />
        </>
      );
    case "sleepy":
      return <path d="M20 36 q4 3 8 0 M36 36 q4 3 8 0" {...SEEDED_AVATAR_LINE} stroke={ink} />;
    case "happy":
      return <path d="M20 37 q4 -5 8 0 M36 37 q4 -5 8 0" {...SEEDED_AVATAR_LINE} stroke={ink} />;
    case "dizzy":
      return (
        <path
          d="M21 33 l6 6 M27 33 l-6 6 M37 33 l6 6 M43 33 l-6 6"
          {...SEEDED_AVATAR_LINE}
          stroke={ink}
        />
      );
    case "cyclops":
      return (
        <>
          <circle
            cx="32"
            cy="34"
            r="8"
            fill={SEEDED_AVATAR_ACCENTS.sclera}
            stroke={ink}
            strokeWidth="2"
          />
          <circle cx={32 + gaze.x} cy={34 + gaze.y} r="3.75" fill={ink} />
        </>
      );
    case "wink":
      return (
        <>
          <circle cx="24" cy="36" r="3" fill={ink} />
          <path d="M36 37 q4 -5 8 0" {...SEEDED_AVATAR_LINE} stroke={ink} />
        </>
      );
    case "shades":
      return (
        <>
          <rect x="16" y="31" width="14" height="9" rx="3" fill={ink} />
          <rect x="34" y="31" width="14" height="9" rx="3" fill={ink} />
          <path d="M30 34 h4" {...SEEDED_AVATAR_LINE} stroke={ink} />
        </>
      );
  }
}
