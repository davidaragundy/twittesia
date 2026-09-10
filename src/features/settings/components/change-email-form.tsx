"use client";

import { Tick02Icon, Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useChangeEmailForm } from "@/features/settings/hooks/use-change-email-form";

export function ChangeEmailForm() {
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
  } = useChangeEmailForm();

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
        name="email"
        disabled={isPending}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-wrap items-center justify-start gap-2">
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>

              {isSessionLoading && <Skeleton className="h-8 w-50" />}

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
                  placeholder="david@aragundy.com"
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
              This is the email address we will use to contact you. It will not be publicly visible.
            </FieldDescription>

            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
