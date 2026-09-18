import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { MediaDraft } from "@/features/media/types/media-draft";
import { createMediaDraft } from "@/features/media/utils/create-media-draft";

interface Props {
  // How many files the post or comment being written can carry
  max: number;
}

// The files chosen in a composer, held on the device until it is sent
export const useMediaDrafts = ({ max }: Props) => {
  const [drafts, setDrafts] = useState<MediaDraft[]>([]);

  // Previews are object URLs, which hold the file in memory until they are revoked
  const draftsRef = useRef(drafts);

  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  useEffect(
    () => () => draftsRef.current.forEach((draft) => URL.revokeObjectURL(draft.previewUrl)),
    [],
  );

  const addFiles = async (files: File[]) => {
    const room = max - drafts.length;

    if (files.length > room) {
      toast.error(`You can attach up to ${max} ${max === 1 ? "file" : "files"}`);
    }

    const results = await Promise.all(
      files.slice(0, Math.max(room, 0)).map((file) => createMediaDraft({ file })),
    );

    for (const { error } of results) {
      if (error) toast.error("Couldn't attach a file", { description: error });
    }

    const added = results.flatMap(({ draft }) => (draft ? [draft] : []));

    setDrafts((current) => [...current, ...added].slice(0, max));
  };

  const removeDraft = (id: string) => {
    const draft = drafts.find((item) => item.id === id);

    if (draft) URL.revokeObjectURL(draft.previewUrl);

    setDrafts((current) => current.filter((item) => item.id !== id));
  };

  const clearDrafts = () => {
    drafts.forEach((draft) => URL.revokeObjectURL(draft.previewUrl));
    setDrafts([]);
  };

  return { drafts, addFiles, removeDraft, clearDrafts, isFull: drafts.length >= max };
};
