"use client";

import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { CharacterCountRing } from "@/shared/components/character-count-ring";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";

import { MAX_COMMENT_LENGTH } from "@/features/comments/constants/max-comment-length";
import { MAX_COMMENT_MEDIA } from "@/features/comments/constants/max-comment-media";
import { useCommentComposer } from "@/features/comments/hooks/use-comment-composer";
import { MediaCaptureButtons } from "@/features/media/components/media-capture-buttons";
import { MediaDraftList } from "@/features/media/components/media-draft-list";
import { MediaPicker } from "@/features/media/components/media-picker";

interface Props {
  postId: string;
  // The writer's handle, for their avatar
  viewerHandle: string;
}

export const CommentComposer = ({ postId, viewerHandle }: Props) => {
  const {
    form,
    onSubmit,
    onKeyDown,
    isPending,
    isUploading,
    length,
    canSubmit,
    drafts,
    progress,
    addFiles,
    removeDraft,
    canAttach,
  } = useCommentComposer({ postId });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
      <SeededAvatar seed={viewerHandle} className="mt-1.5 hidden sm:block" />

      <Controller
        name="content"
        control={form.control}
        disabled={isPending}
        render={({ field }) => (
          <InputGroup>
            <label htmlFor="comment-composer-content" className="sr-only">
              Write a comment
            </label>
            <InputGroupTextarea
              {...field}
              id="comment-composer-content"
              placeholder="Write a comment"
              aria-invalid={length > 0 && !canSubmit && !isPending}
              onKeyDown={onKeyDown}
              className="max-h-60 min-h-12"
            />
            <MediaDraftList
              drafts={drafts}
              progress={progress}
              isUploading={isUploading}
              onRemove={removeDraft}
            />
            <InputGroupAddon align="block-end">
              <div className="flex items-center gap-0.5">
                <MediaPicker
                  onPick={addFiles}
                  multiple={MAX_COMMENT_MEDIA > 1}
                  disabled={!canAttach}
                />
                <MediaCaptureButtons onCapture={addFiles} disabled={!canAttach} />
              </div>
              <div className="ml-auto flex items-center gap-3">
                <CharacterCountRing length={length} max={MAX_COMMENT_LENGTH} />
                <InputGroupButton
                  type="submit"
                  variant="default"
                  size="icon-sm"
                  disabled={!canSubmit}
                  aria-label="Comment"
                  title="Comment"
                >
                  {isPending ? <Spinner /> : <HugeiconsIcon icon={ArrowUp02Icon} />}
                </InputGroupButton>
              </div>
            </InputGroupAddon>
          </InputGroup>
        )}
      />
    </form>
  );
};
