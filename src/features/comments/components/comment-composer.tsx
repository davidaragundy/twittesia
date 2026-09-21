"use client";

import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { Controller } from "react-hook-form";

import { CharacterCountRing } from "@/shared/components/character-count-ring";
import { Icon } from "@/shared/components/icon";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group";
import { Kbd, KbdGroup } from "@/shared/components/ui/kbd";
import { Spinner } from "@/shared/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

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
  } = useCommentComposer({ postId });

  return (
    // Laid out like the comment it becomes: the avatar, the name, then what it will say
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3">
      <SeededAvatar seed={viewerHandle} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="flex min-h-8 items-center truncate font-semibold">{viewerName}</p>

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
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <InputGroupButton
                          type="submit"
                          variant="default"
                          size="icon-sm"
                          disabled={!canSubmit}
                          aria-label="Comment"
                        />
                      }
                    >
                      {isPending ? <Spinner /> : <Icon icon={ArrowUp02Icon} />}
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
              </InputGroupAddon>
            </InputGroup>
          )}
        />
      </div>
    </form>
  );
};
