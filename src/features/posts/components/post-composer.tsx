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

import { MediaCaptureButtons } from "@/features/media/components/media-capture-buttons";
import { MediaDraftList } from "@/features/media/components/media-draft-list";
import { MediaPicker } from "@/features/media/components/media-picker";
import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";
import { MAX_POST_MEDIA } from "@/features/posts/constants/max-post-media";
import { usePostComposer } from "@/features/posts/hooks/use-post-composer";

export const PostComposer = () => {
  const {
    form,
    user,
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
  } = usePostComposer();

  return (
    // Laid out like the post it becomes: the avatar, the name, then what it will say
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
      {user && <SeededAvatar seed={user.username ?? user.id} size="lg" />}

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {user && <p className="truncate font-semibold">{user.name}</p>}

        <Controller
          name="content"
          control={form.control}
          disabled={isPending}
          render={({ field }) => (
            <InputGroup>
              <label htmlFor="post-composer-content" className="sr-only">
                What&apos;s on your mind?
              </label>
              <InputGroupTextarea
                {...field}
                id="post-composer-content"
                placeholder="What's on your mind?"
                aria-invalid={length > 0 && !canSubmit && !isPending}
                onKeyDown={onKeyDown}
                className="max-h-72 min-h-20"
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
                    multiple={MAX_POST_MEDIA > 1}
                    disabled={!canAttach}
                  />
                  <MediaCaptureButtons onCapture={addFiles} disabled={!canAttach} />
                </div>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  ⌘ Enter to post
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <CharacterCountRing length={length} max={MAX_POST_LENGTH} />
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <InputGroupButton
                          type="submit"
                          variant="default"
                          size="icon-sm"
                          disabled={!canSubmit}
                          aria-label="Post"
                        />
                      }
                    >
                      {isPending ? <Spinner /> : <Icon icon={ArrowUp02Icon} />}
                    </TooltipTrigger>
                    <TooltipContent>
                      Post
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
