"use client";

import { AnonymousIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Spinner } from "@/shared/components/ui/spinner";
import { Switch } from "@/shared/components/ui/switch";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";

import { usePostComposer } from "@/features/posts/hooks/use-post-composer";

export const PostComposer = () => {
  const { form, onSubmit, isPending, isGhost, remaining, canSubmit } = usePostComposer();

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
                placeholder={
                  isGhost ? "Say it as a ghost, nobody will know" : "What is on your mind?"
                }
                aria-invalid={fieldState.invalid}
                className="min-h-24 resize-none"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field orientation="horizontal" className="justify-between">
          <Controller
            name="isGhost"
            control={form.control}
            disabled={isPending}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Switch
                  id="post-composer-ghost"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
                <FieldLabel
                  htmlFor="post-composer-ghost"
                  className="flex items-center gap-2 font-normal"
                >
                  <HugeiconsIcon icon={AnonymousIcon} className="size-4" />
                  Ghost
                </FieldLabel>
              </div>
            )}
          />

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
