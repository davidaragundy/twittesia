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
import { useCommentComposer } from "@/features/comments/hooks/use-comment-composer";

interface Props {
  postId: string;
  // The writer's handle, for their avatar
  viewerHandle: string;
}

export const CommentComposer = ({ postId, viewerHandle }: Props) => {
  const { form, onSubmit, onKeyDown, isPending, length, canSubmit } = useCommentComposer({
    postId,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
      <SeededAvatar seed={viewerHandle} className="mt-1.5 hidden sm:block" />

      <Controller
        name="content"
        control={form.control}
        disabled={isPending}
        render={({ field }) => (
          <InputGroup className="has-data-[align=block-end]:rounded-3xl has-[textarea]:rounded-3xl">
            <label htmlFor="comment-composer-content" className="sr-only">
              Write a comment
            </label>
            <InputGroupTextarea
              {...field}
              id="comment-composer-content"
              placeholder="Write a comment"
              aria-invalid={length > 0 && !canSubmit && !isPending}
              onKeyDown={onKeyDown}
              className="max-h-60 min-h-12 px-4 pt-3.5 text-base md:text-base"
            />
            <InputGroupAddon align="block-end" className="gap-3 px-3 pb-2.5">
              <div className="ml-auto flex items-center gap-3">
                <CharacterCountRing length={length} max={MAX_COMMENT_LENGTH} />
                <InputGroupButton
                  type="submit"
                  variant="default"
                  size="icon-sm"
                  disabled={!canSubmit}
                  aria-label="Comment"
                  title="Comment"
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
