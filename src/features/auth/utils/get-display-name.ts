interface Props {
  handle: string;
}

/**
 * The readable half of a handle: `sneaky-waffle-x7k3qa` shows as `Sneaky Waffle`. The random
 * suffix is dropped, so two identities can share a display name; the handle behind it is still
 * unique.
 */
export const getDisplayName = ({ handle }: Props): string =>
  handle
    .split("-")
    .slice(0, -1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
