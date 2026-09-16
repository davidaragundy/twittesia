interface Props {
  handle: string;
}

// `sneaky-waffle-x7k3qa` reads as `Sneaky Waffle`
export const getDisplayName = ({ handle }: Props): string =>
  handle
    .split("-")
    .slice(0, -1)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
