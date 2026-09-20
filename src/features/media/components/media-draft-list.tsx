import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { MediaDraftPreview } from "@/features/media/components/media-draft-preview";
import type { MediaDraft } from "@/features/media/types/media-draft";

interface Props {
  drafts: MediaDraft[];
  // Percent sent, by draft, while the composer is sending
  progress: Record<string, number>;
  isUploading: boolean;
  onRemove: (id: string) => void;
}

export const MediaDraftList = ({ drafts, progress, isUploading, onRemove }: Props) => {
  if (!drafts.length) return null;

  return (
    <ul aria-label="Attached files" className="flex w-full gap-2 overflow-x-auto px-4 pt-1 pb-2">
      {drafts.map((draft) => (
        <li
          key={draft.id}
          className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5 sm:size-24"
        >
          <MediaDraftPreview draft={draft} />

          {isUploading ? (
            <div
              role="progressbar"
              aria-label={`Uploading ${draft.file.name}`}
              aria-valuenow={Math.round(progress[draft.id] ?? 0)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="absolute inset-0 flex items-center justify-center bg-background/60 text-xs font-medium tabular-nums backdrop-blur-2xs"
            >
              {Math.round(progress[draft.id] ?? 0)}%
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onRemove(draft.id)}
              aria-label={`Remove ${draft.file.name}`}
              title="Remove"
              className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};
