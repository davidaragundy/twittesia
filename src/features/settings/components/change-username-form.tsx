"use client";

import { Tick02Icon, Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useChangeUsernameForm } from "@/features/settings/hooks/use-change-username-form";

export function ChangeUsernameForm() {
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
  } = useChangeUsernameForm();

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
        name="username"
        disabled={isPending}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-wrap items-center justify-start gap-2">
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>

              {isSessionLoading && <Skeleton className="h-8 w-[200px]" />}

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
                  className="flex-1 sm:w-fit sm:flex-none"
                  placeholder="davidaragundy"
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
              This is your public display username. It can be your real name or a pseudonym.
            </FieldDescription>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
