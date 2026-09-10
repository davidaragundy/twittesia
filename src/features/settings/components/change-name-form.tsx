"use client";

import { Controller } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useChangeNameForm } from "@/features/settings/hooks/use-change-name-form";

export function ChangeNameForm() {
  const {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeNameForm();

  return (
    <form
      onKeyDown={(event) => {
        if (event.key === "Enter" && !canSubmit) event.preventDefault();
      }}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <Controller
        control={form.control}
        name="name"
        disabled={isPending}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-wrap gap-2 items-center justify-start">
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>

              {isSessionLoading && <Skeleton className="w-[200px] h-8" />}

              {isSessionError && (
                <Button variant="outline" type="button" onClick={() => refetchSession()}>
                  Retry{" "}
                  {isSessionRefetching ? (
                    <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
                  ) : (
                    <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />
                  )}
                </Button>
              )}

              {isSessionSuccess && (
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="flex-1 sm:flex-none sm:w-fit"
                  placeholder="David Aragundy"
                />
              )}

              {canSubmit && (
                <Button
                  variant={isError ? "destructive" : "ghost"}
                  className="rounded-full"
                  size="icon"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
                  {isError && <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />}
                  {!isPending && !isError && <HugeiconsIcon icon={Tick02Icon} />}
                </Button>
              )}
            </div>

            <FieldDescription className="text-sm text-muted-foreground">
              This is your public display name. It can be your real name or a pseudonym.
            </FieldDescription>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
