import { AVATAR_SIZE } from "@/features/auth/constants/avatar-size";
import { getHash } from "@/features/auth/utils/get-hash";

interface Props {
  handle: string;
}

/**
 * A generated avatar for a generated handle.
 *
 * Gravatar's `identicon` draws a geometric pattern from whatever hash it is given, and `f=y`
 * forces it to draw one rather than look the hash up as a real account. The hash is of the
 * handle, which Twittesia invented, so the picture is stable for the life of the identity and
 * derived from nothing personal.
 */
export const getAvatarUrl = async ({ handle }: Props): Promise<string> => {
  const hash = await getHash(handle);

  return `https://gravatar.com/avatar/${hash}?d=identicon&f=y&s=${AVATAR_SIZE}`;
};
