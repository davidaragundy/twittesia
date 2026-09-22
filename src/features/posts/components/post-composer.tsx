"use client";

import { Controller } from "react-hook-form";

import { CharacterCountRing } from "@/shared/components/character-count-ring";
import { SeededAvatar } from "@/shared/components/seeded-avatar";
import { Button } from "@/shared/components/ui/button";
import { Kbd, KbdGroup } from "@/shared/components/ui/kbd";
import { Spinner } from "@/shared/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

import { MediaCaptureButtons } from "@/features/media/components/media-capture-buttons";
import { MediaDraftList } from "@/features/media/components/media-draft-list";
import { MediaPicker } from "@/features/media/components/media-picker";
import { MAX_POST_LENGTH } from "@/features/posts/constants/max-post-length";
import { MAX_POST_MEDIA } from "@/features/posts/constants/max-post-media";
import { usePostComposer } from "@/features/posts/hooks/use-post-composer";

/**
 * The post before it is one, drawn as the card it becomes: the same avatar and byline, the text
 * where the text will be, and the tools where the post's actions will be, so what is written
 * already sits where it will be read.
 */
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      // A card like the one it becomes, a shade deeper while it is being written in
      className="flex flex-col gap-4 rounded-3xl bg-muted/30 p-5 transition-colors focus-within:bg-muted/45"
    >
      <header className="flex items-center gap-3">
        {user && <SeededAvatar seed={user.username ?? user.id} size="lg" />}
        {user && <p className="truncate font-semibold">{user.name}</p>}
      </header>

      <div className="flex min-w-0 flex-col gap-3">
        <Controller
          name="content"
          control={form.control}
          disabled={isPending}
          render={({ field }) => (
            <>
              <label htmlFor="post-composer-content" className="sr-only">
                What&apos;s on your mind?
              </label>
              <textarea
                {...field}
                id="post-composer-content"
                placeholder="What's on your mind?"
                aria-invalid={length > 0 && !canSubmit && !isPending}
                onKeyDown={onKeyDown}
                rows={2}
                className="field-sizing-content max-h-72 min-h-14 w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-50"
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

        {/* Where the post's actions will be, pulled out the same way */}
        <div className="-mx-2 -mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <MediaPicker onPick={addFiles} multiple={MAX_POST_MEDIA > 1} disabled={!canAttach} />
            <MediaCaptureButtons onCapture={addFiles} disabled={!canAttach} />
          </div>
          <div className="flex items-center gap-3">
            <CharacterCountRing length={length} max={MAX_POST_LENGTH} />
            <Tooltip>
              <TooltipTrigger render={<Button type="submit" size="sm" disabled={!canSubmit} />}>
                {isPending && <Spinner data-icon="inline-start" />}
                Post
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
        </div>
      </div>
    </form>
  );
};
