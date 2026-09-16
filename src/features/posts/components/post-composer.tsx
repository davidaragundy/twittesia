"use client";

import { ArrowUp02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { SeededAvatar } from "@/shared/components/seeded-avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";

import { PostLengthRing } from "@/features/posts/components/post-length-ring";
import { usePostComposer } from "@/features/posts/hooks/use-post-composer";

export const PostComposer = () => {
  const { form, user, onSubmit, onKeyDown, isPending, length, canSubmit } = usePostComposer();

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
            <InputGroupAddon align="block-end" className="gap-3 px-4 pb-3">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                ⌘ Enter to post
              </span>
              <div className="ml-auto flex items-center gap-3">
                <PostLengthRing length={length} />
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
