"use client";

import { Controller } from "react-hook-form";

import { CharacterCountRing } from "@/shared/components/character-count-ring";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Button } from "@/shared/components/ui/button";
import { Kbd, KbdGroup } from "@/shared/components/ui/kbd";
import { Spinner } from "@/shared/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { COMMENT_COMPOSER_ID } from "@/features/comments/constants/comment-composer-id";
import { MAX_COMMENT_LENGTH } from "@/features/comments/constants/max-comment-length";
import { MAX_COMMENT_MEDIA } from "@/features/comments/constants/max-comment-media";
import { useCommentComposer } from "@/features/comments/hooks/use-comment-composer";
import { MediaCaptureButtons } from "@/features/media/components/media-capture-buttons";
import { MediaDraftList } from "@/features/media/components/media-draft-list";
import { MediaPicker } from "@/features/media/components/media-picker";

interface Props {
  postId: string;
  // The writer's handle and name, for the avatar and the byline above what they write
  viewerHandle: string;
  viewerName: string;
}

// The comment before it is one, drawn as the comment it becomes, with nothing around it
export const CommentComposer = ({ postId, viewerHandle, viewerName }: Props) => {
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
  } = useCommentComposer({
    postId,
    author: { name: viewerName, username: viewerHandle, displayUsername: viewerHandle },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
      <SeededAvatar seed={viewerHandle} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="flex min-h-8 items-center truncate font-semibold">{viewerName}</p>

        <Controller
          name="content"
          control={form.control}
          disabled={isPending}
          render={({ field }) => (
            <>
              <label htmlFor={COMMENT_COMPOSER_ID} className="sr-only">
                Write a comment
              </label>
              <textarea
                {...field}
                id={COMMENT_COMPOSER_ID}
                placeholder="Write a comment"
                aria-invalid={length > 0 && !canSubmit && !isPending}
                onKeyDown={onKeyDown}
                rows={1}
                className="field-sizing-content max-h-60 min-h-7 w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
            </>
          )}
        />

        <MediaDraftList
          drafts={drafts}
          progress={progress}
          isUploading={isUploading}
          onRemove={removeDraft}
        />

        {/* Where the comment's actions will be, pulled left the same way */}
        <div className="-ml-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <MediaPicker onPick={addFiles} multiple={MAX_COMMENT_MEDIA > 1} disabled={!canAttach} />
            <MediaCaptureButtons onCapture={addFiles} disabled={!canAttach} />
          </div>
          <div className="flex items-center gap-3">
            <CharacterCountRing length={length} max={MAX_COMMENT_LENGTH} />
            <Tooltip>
              <TooltipTrigger render={<Button type="submit" size="sm" disabled={!canSubmit} />}>
                {isPending && <Spinner data-icon="inline-start" />}
                Comment
              </TooltipTrigger>
              <TooltipContent>
                Comment
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>Enter</Kbd>
                </KbdGroup>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </form>
  );
};
