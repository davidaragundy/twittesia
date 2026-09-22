import { LIFESPAN_HOURS } from "@/features/posts/constants/lifespan-hours";

interface Props {
  createdAt: Date;
}

// When a post stops being shown and is deleted: exactly one lifespan after it was written
export const getPostExpiry = ({ createdAt }: Props) =>
  new Date(createdAt.getTime() + LIFESPAN_HOURS * 60 * 60 * 1000);
