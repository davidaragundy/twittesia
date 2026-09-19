import type { ConfirmedMedia } from "@/features/media/types/confirmed-media";
import { toMedia } from "@/features/media/utils/to-media";

interface Props {
  confirmed: ConfirmedMedia[];
}

// What a post or comment hash stores of its files: what the browser gets, and apart from it the
// paths, which only deleting needs
export const toMediaFields = ({ confirmed }: Props) => ({
  media: JSON.stringify(confirmed.map((item) => toMedia({ confirmed: item }))),
  mediaPaths: JSON.stringify(confirmed.map((item) => item.pathname)),
});
