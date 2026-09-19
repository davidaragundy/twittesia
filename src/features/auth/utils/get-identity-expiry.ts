import { IDENTITY_LIFESPAN_SECONDS } from "@/features/auth/constants/identity-lifespan-seconds";

interface Props {
  createdAt: number;
}

// When an identity, and its one session, stop working: exactly one lifespan after it began. It is
// never extended, so an identity always ends with a day's worth of content behind it.
export const getIdentityExpiry = ({ createdAt }: Props) =>
  createdAt + IDENTITY_LIFESPAN_SECONDS * 1_000;
