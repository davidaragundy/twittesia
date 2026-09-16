"use client";

import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";

import { usePostComposer } from "@/features/posts/hooks/use-post-composer";

export const PostComposer = () => {
  const { form, onSubmit, isPending, remaining, canSubmit } = usePostComposer();

  return (
    <form id="post-composer" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="content"
          control={form.control}
          disabled={isPending}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-composer-content" className="sr-only">
                What&apos;s on your mind?
              </FieldLabel>
              <Textarea
                {...field}
                id="post-composer-content"
                rows={3}
                placeholder="What is on your mind?"
                aria-invalid={fieldState.invalid}
                className="min-h-24 resize-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field orientation="horizontal" className="justify-end">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-sm text-muted-foreground tabular-nums",
                remaining < 0 && "text-destructive",
              )}
            >
              {remaining}
            </span>
            <Button type="submit" form="post-composer" disabled={!canSubmit || isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              Post
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
};
