import { nanoid } from "nanoid";

import { MEDIA_RULES } from "@/features/media/constants/media-rules";
import type { MediaKind } from "@/features/media/types/media-kind";

interface Props {
  kind: MediaKind;
  contentType: string;
}

// A path nobody can guess or collide with, and that says nothing about who uploaded it
export const toMediaPathname = ({ kind, contentType }: Props) =>
  `media/${nanoid()}.${MEDIA_RULES[kind].extensions[contentType]}`;
