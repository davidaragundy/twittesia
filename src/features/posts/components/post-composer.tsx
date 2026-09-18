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
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
      {user && (
        <SeededAvatar seed={user.username ?? user.id} size="lg" className="mt-1 hidden sm:block" />
      )}

      <Controller
        name="content"
        control={form.control}
        disabled={isPending}
        render={({ field }) => (
          <InputGroup className="has-data-[align=block-end]:rounded-4xl has-[textarea]:rounded-4xl">
            <label htmlFor="post-composer-content" className="sr-only">
              What&apos;s on your mind?
            </label>
            <InputGroupTextarea
              {...field}
              id="post-composer-content"
              placeholder="What's on your mind?"
              aria-invalid={length > 0 && !canSubmit && !isPending}
              onKeyDown={onKeyDown}
              className="max-h-72 min-h-20 px-5 pt-4 text-base md:text-base"
            />
            <MediaDraftList
              drafts={drafts}
              progress={progress}
              isUploading={isUploading}
              onRemove={removeDraft}
            />
            <InputGroupAddon align="block-end" className="gap-3 px-4 pb-3">
              <MediaPicker onPick={addFiles} multiple={MAX_POST_MEDIA > 1} disabled={!canAttach} />
              <span className="hidden text-xs text-muted-foreground sm:inline">
                ⌘ Enter to post
              </span>
              <div className="ml-auto flex items-center gap-3">
                <CharacterCountRing length={length} max={MAX_POST_LENGTH} />
                <InputGroupButton
                  type="submit"
                  variant="default"
                  size="icon-sm"
                  disabled={!canSubmit}
                  aria-label="Post"
                  title="Post"
                  className="rounded-full"
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
