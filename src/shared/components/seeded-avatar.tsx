import { cn } from "cn";

import { SeededAvatarBlush } from "@/shared/components/seeded-avatar-blush";
import { SeededAvatarBody } from "@/shared/components/seeded-avatar-body";
import { SeededAvatarExtra } from "@/shared/components/seeded-avatar-extra";
import { SeededAvatarEyes } from "@/shared/components/seeded-avatar-eyes";
import { SeededAvatarMouth } from "@/shared/components/seeded-avatar-mouth";
import { SEEDED_AVATAR_SIZES } from "@/shared/constants/seeded-avatar-sizes";
import { useSeededAvatar } from "@/shared/hooks/use-seeded-avatar";

type Props = {
  seed: string;
  size?: keyof typeof SEEDED_AVATAR_SIZES;
  // Omit when a name is shown beside it
  label?: string;
  className?: string;
};

// Drawn in the page from the seed, so nothing is fetched and nothing is stored
export function SeededAvatar({ seed, size = "default", label, className }: Props) {
  const { palette, body, eyes, mouth, extra, hasBlush, gaze } = useSeededAvatar({ seed });

  return (
    <svg
      viewBox="0 0 64 64"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("shrink-0 rounded-full", SEEDED_AVATAR_SIZES[size], className)}
    >
      <circle cx="32" cy="32" r="32" fill={palette.background} />
      <SeededAvatarExtra extra={extra} palette={palette} />
      <SeededAvatarBody body={body} color={palette.body} />
      {hasBlush && <SeededAvatarBlush />}
      <SeededAvatarEyes eyes={eyes} gaze={gaze} ink={palette.ink} />
      <SeededAvatarMouth mouth={mouth} ink={palette.ink} />
    </svg>
  );
}
