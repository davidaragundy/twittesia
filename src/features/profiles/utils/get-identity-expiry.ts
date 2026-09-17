import { IDENTITY_LIFESPAN_SECONDS } from "@/features/auth/constants/identity-lifespan-seconds";

interface Props {
  createdAt: Date;
}

// When the identity stops working: its session lasts exactly one lifespan from the moment it began
export const getIdentityExpiry = ({ createdAt }: Props) =>
  new Date(createdAt.getTime() + IDENTITY_LIFESPAN_SECONDS * 1000);
