import type { ConfirmedMedia } from "@/features/media/types/confirmed-media";
import type { Media } from "@/features/media/types/media";

interface Props {
  confirmed: ConfirmedMedia;
}

// What the browser gets of a file it has just attached
export const toMedia = ({ confirmed }: Props): Media => ({
  id: confirmed.id,
  kind: confirmed.kind,
  url: confirmed.url,
  contentType: confirmed.contentType,
  width: confirmed.width,
  height: confirmed.height,
});
