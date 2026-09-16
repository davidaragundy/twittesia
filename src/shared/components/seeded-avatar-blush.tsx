import { SEEDED_AVATAR_ACCENTS } from "@/shared/constants/seeded-avatar-accents";

export function SeededAvatarBlush() {
  return (
    <>
      <ellipse cx="19" cy="45" rx="4" ry="2.5" fill={SEEDED_AVATAR_ACCENTS.blush} opacity="0.55" />
      <ellipse cx="45" cy="45" rx="4" ry="2.5" fill={SEEDED_AVATAR_ACCENTS.blush} opacity="0.55" />
    </>
  );
}
