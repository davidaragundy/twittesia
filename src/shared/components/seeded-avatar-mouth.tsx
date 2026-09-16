import { SEEDED_AVATAR_ACCENTS } from "@/shared/constants/seeded-avatar-accents";
import { SEEDED_AVATAR_LINE } from "@/shared/constants/seeded-avatar-line";
import type { SeededAvatarTraits } from "@/shared/types/seeded-avatar-traits";

type Props = {
  mouth: SeededAvatarTraits["mouth"];
  ink: string;
};

export function SeededAvatarMouth({ mouth, ink }: Props) {
  switch (mouth) {
    case "smile":
      return <path d="M25 46 q7 7 14 0" {...SEEDED_AVATAR_LINE} stroke={ink} />;
    case "grin":
      return (
        <>
          <path
            d="M23 45 h18 a9 9 0 0 1 -18 0 z"
            fill={ink}
            stroke={ink}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="27" y="45" width="10" height="3" fill={SEEDED_AVATAR_ACCENTS.sclera} />
        </>
      );
    case "surprised":
      return <circle cx="32" cy="48" r="3.5" fill={ink} />;
    case "flat":
      return <path d="M26 48 h12" {...SEEDED_AVATAR_LINE} stroke={ink} />;
    case "tongue":
      return (
        <>
          <ellipse
            cx="35"
            cy="51"
            rx="3.5"
            ry="4"
            fill={SEEDED_AVATAR_ACCENTS.tongue}
            stroke={ink}
            strokeWidth="2"
          />
          <path d="M25 47 q7 6 14 0" {...SEEDED_AVATAR_LINE} stroke={ink} />
        </>
      );
    case "wavy":
      return <path d="M23 48 q3 -3 6 0 t6 0 t6 0" {...SEEDED_AVATAR_LINE} stroke={ink} />;
    case "fangs":
      return (
        <>
          <path
            d="M26 49 l2.5 4 l2.5 -4 Z M33 49 l2.5 4 l2.5 -4 Z"
            fill={SEEDED_AVATAR_ACCENTS.sclera}
            stroke={ink}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M24 47 q8 5 16 0" {...SEEDED_AVATAR_LINE} stroke={ink} />
        </>
      );
  }
}
