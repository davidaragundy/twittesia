import { SEEDED_AVATAR_PALETTES } from "@/shared/constants/seeded-avatar-palettes";
import { cn } from "@/shared/utils/cn";

interface Props {
  // Anything stable: the same seed always draws the same creature
  seed: string;
  size?: "sm" | "default" | "lg";
  // Omit when a name is shown next to the avatar, which makes the picture decorative
  label?: string;
  className?: string;
}

// FNV-1a: a fast, well-spread 32-bit hash that gives the same answer on the server and in the
// browser, so the picture never changes between render and hydration
const hash = (value: string) => {
  let h = 0x811c9dc5;

  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  return h >>> 0;
};

// mulberry32: turns the one hash into as many independent choices as the drawing needs
const random = (seed: number) => {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
};

const SIZES = { sm: "size-6", default: "size-8", lg: "size-10" } as const;

const BODIES = 5;
const EYES = 8;
const MOUTHS = 7;
const EXTRAS = 5;

/**
 * A small creature drawn from a seed, entirely in the page.
 *
 * Nothing is fetched and nothing is stored, so showing someone's picture tells no third party who
 * is looking. Every choice comes from the seed, so a handle keeps its creature for as long as the
 * handle exists.
 */
export const SeededAvatar = ({ seed, size = "default", label, className }: Props) => {
  const next = random(hash(seed));
  const choose = (count: number) => Math.floor(next() * count);

  const { background, body, ink } = SEEDED_AVATAR_PALETTES[choose(SEEDED_AVATAR_PALETTES.length)];
  const bodyShape = choose(BODIES);
  const eyes = choose(EYES);
  const mouth = choose(MOUTHS);
  const extra = choose(EXTRAS);
  const hasBlush = next() < 0.5;
  // Where googly pupils look, so a crowd of the same eye style still looks around differently
  const lookX = Math.round((next() - 0.5) * 4);
  const lookY = Math.round((next() - 0.5) * 4);

  const line = {
    fill: "none",
    stroke: ink,
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  return (
    <svg
      viewBox="0 0 64 64"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("shrink-0 rounded-full", SIZES[size], className)}
    >
      <circle cx="32" cy="32" r="32" fill={background} />

      {/* Extras behind the body poke out above it */}
      {extra === 1 && (
        <>
          <path d="M32 22 V9" {...line} />
          <circle cx="32" cy="8" r="3.5" fill={background} stroke={ink} strokeWidth="2.5" />
        </>
      )}
      {extra === 2 && (
        <>
          <path
            d="M19 24 L15 11 L26 19 Z"
            fill={ink}
            stroke={ink}
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M45 24 L49 11 L38 19 Z"
            fill={ink}
            stroke={ink}
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </>
      )}
      {extra === 3 && (
        <path
          d="M32 22 C32 16 30 12 25 9 C31 9 34 12 32 22 C33 15 37 11 42 11 C38 13 34 16 32 22"
          fill="#22C55E"
          stroke={ink}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}

      {bodyShape === 0 && <circle cx="32" cy="38" r="20" fill={body} />}
      {bodyShape === 1 && <rect x="13" y="18" width="38" height="40" rx="14" fill={body} />}
      {bodyShape === 2 && (
        <path
          d="M12 58 V36 a20 20 0 0 1 40 0 V58 l-6.67 -5 l-6.67 5 l-6.66 -5 l-6.67 5 l-6.66 -5 z"
          fill={body}
        />
      )}
      {bodyShape === 3 && <ellipse cx="32" cy="39" rx="18" ry="22" fill={body} />}
      {bodyShape === 4 && (
        <path
          d="M14 58 V28 L19 14 L28 22 H36 L45 14 L50 28 V58 Z"
          fill={body}
          stroke={body}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}

      {/* A party hat sits on top of the body rather than behind it */}
      {extra === 4 && (
        <>
          <path
            d="M24 20 L32 3 L40 20 Z"
            fill={background}
            stroke={ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="3.5" r="2.5" fill={ink} />
        </>
      )}

      {hasBlush && (
        <>
          <ellipse cx="19" cy="45" rx="4" ry="2.5" fill="#F472B6" opacity="0.55" />
          <ellipse cx="45" cy="45" rx="4" ry="2.5" fill="#F472B6" opacity="0.55" />
        </>
      )}

      {eyes === 0 && (
        <>
          <circle cx="24" cy="36" r="3" fill={ink} />
          <circle cx="40" cy="36" r="3" fill={ink} />
        </>
      )}
      {eyes === 1 && (
        <>
          <circle cx="24" cy="35" r="6" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
          <circle cx="40" cy="35" r="6" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
          <circle cx={24 + lookX} cy={35 + lookY} r="2.75" fill={ink} />
          <circle cx={40 + lookX} cy={35 + lookY} r="2.75" fill={ink} />
        </>
      )}
      {eyes === 2 && (
        <>
          <path d="M20 36 q4 3 8 0" {...line} />
          <path d="M36 36 q4 3 8 0" {...line} />
        </>
      )}
      {eyes === 3 && (
        <>
          <path d="M20 37 q4 -5 8 0" {...line} />
          <path d="M36 37 q4 -5 8 0" {...line} />
        </>
      )}
      {eyes === 4 && (
        <>
          <path d="M21 33 l6 6 M27 33 l-6 6" {...line} />
          <path d="M37 33 l6 6 M43 33 l-6 6" {...line} />
        </>
      )}
      {eyes === 5 && (
        <>
          <circle cx="32" cy="34" r="8" fill="#FFFFFF" stroke={ink} strokeWidth="2" />
          <circle cx={32 + lookX} cy={34 + lookY} r="3.75" fill={ink} />
        </>
      )}
      {eyes === 6 && (
        <>
          <circle cx="24" cy="36" r="3" fill={ink} />
          <path d="M36 37 q4 -5 8 0" {...line} />
        </>
      )}
      {eyes === 7 && (
        <>
          <rect x="16" y="31" width="14" height="9" rx="3" fill={ink} />
          <rect x="34" y="31" width="14" height="9" rx="3" fill={ink} />
          <path d="M30 34 h4" {...line} />
        </>
      )}

      {mouth === 0 && <path d="M25 46 q7 7 14 0" {...line} />}
      {mouth === 1 && (
        <>
          <path
            d="M23 45 h18 a9 9 0 0 1 -18 0 z"
            fill={ink}
            stroke={ink}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect x="27" y="45" width="10" height="3" fill="#FFFFFF" />
        </>
      )}
      {mouth === 2 && <circle cx="32" cy="48" r="3.5" fill={ink} />}
      {mouth === 3 && <path d="M26 48 h12" {...line} />}
      {mouth === 4 && (
        <>
          <ellipse cx="35" cy="51" rx="3.5" ry="4" fill="#FB7185" stroke={ink} strokeWidth="2" />
          <path d="M25 47 q7 6 14 0" {...line} />
        </>
      )}
      {mouth === 5 && <path d="M23 48 q3 -3 6 0 t6 0 t6 0" {...line} />}
      {mouth === 6 && (
        <>
          <path
            d="M26 49 l2.5 4 l2.5 -4 Z M33 49 l2.5 4 l2.5 -4 Z"
            fill="#FFFFFF"
            stroke={ink}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M24 47 q8 5 16 0" {...line} />
        </>
      )}
    </svg>
  );
};
