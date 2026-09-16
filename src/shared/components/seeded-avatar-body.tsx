import type { SeededAvatarTraits } from "@/shared/types/seeded-avatar-traits";

type Props = {
  body: SeededAvatarTraits["body"];
  color: string;
};

export function SeededAvatarBody({ body, color }: Props) {
  switch (body) {
    case "round":
      return <circle cx="32" cy="38" r="20" fill={color} />;
    case "square":
      return <rect x="13" y="18" width="38" height="40" rx="14" fill={color} />;
    case "slime":
      return (
        <path
          d="M12 58 V36 a20 20 0 0 1 40 0 V58 l-6.67 -5 l-6.67 5 l-6.66 -5 l-6.67 5 l-6.66 -5 z"
          fill={color}
        />
      );
    case "egg":
      return <ellipse cx="32" cy="39" rx="18" ry="22" fill={color} />;
    case "cat":
      return (
        <path
          d="M14 58 V28 L19 14 L28 22 H36 L45 14 L50 28 V58 Z"
          fill={color}
          stroke={color}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      );
  }
}
