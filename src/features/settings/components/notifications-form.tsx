"use client";

import Image from "next/image";
import Link from "next/link";
import { Controller } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Switch } from "@/shared/components/ui/switch";
import { TypographyMuted } from "@/shared/components/ui/typography";

import { useNotificationsForm } from "@/features/settings/hooks/use-notifications-form";

export function NotificationsForm() {
  const { form, onSubmit } = useNotificationsForm();

  return (
    <>
      <div className="relative mx-auto w-full max-w-sm aspect-square">
        <Image src="/coming-soon.svg" alt="Coming soon" fill />
      </div>

      <TypographyMuted className="text-center">Coming soon...</TypographyMuted>
    </>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Controller
        control={form.control}
        name="type"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-3">
            <FieldLabel htmlFor={field.name}>Notify me about...</FieldLabel>
            <RadioGroup
              id={field.name}
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <Field className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="all" id="type-all" />
                <FieldLabel htmlFor="type-all" className="font-normal">
                  All new messages
                </FieldLabel>
              </Field>
              <Field className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="mentions" id="type-mentions" />
                <FieldLabel htmlFor="type-mentions" className="font-normal">
                  Direct messages and mentions
                </FieldLabel>
              </Field>
              <Field className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="none" id="type-none" />
                <FieldLabel htmlFor="type-none" className="font-normal">
                  Nothing
                </FieldLabel>
              </Field>
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <div>
        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="communication_emails"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-row items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor={field.name} className="text-base">
                    Communication emails
                  </FieldLabel>
                  <FieldDescription>Receive emails about your account activity.</FieldDescription>
                </div>
                <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="marketing_emails"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-row items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor={field.name} className="text-base">
                    Marketing emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive emails about new products, features, and more.
                  </FieldDescription>
                </div>
                <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="social_emails"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-row items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor={field.name} className="text-base">
                    Social emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive emails for friend requests, follows, and more.
                  </FieldDescription>
                </div>
                <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="security_emails"
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-row items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-0.5">
                  <FieldLabel htmlFor={field.name} className="text-base">
                    Security emails
                  </FieldLabel>
                  <FieldDescription>
                    Receive emails about your account activity and security.
                  </FieldDescription>
                </div>
                <Switch
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled
                  aria-readonly
                />
              </Field>
            )}
          />
        </div>
      </div>
      <Controller
        control={form.control}
        name="mobile"
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="flex flex-row items-start space-x-3 space-y-0"
          >
            <Checkbox id={field.name} checked={field.value} onCheckedChange={field.onChange} />
            <div className="space-y-1 leading-none">
              <FieldLabel htmlFor={field.name}>
                Use different settings for my mobile devices
              </FieldLabel>
              <FieldDescription>
                You can manage your mobile notifications in the{" "}
                <Link href="/examples/forms">mobile settings</Link> page.
              </FieldDescription>
            </div>
          </Field>
        )}
      />
      <Button type="submit">Update notifications</Button>
    </form>
  );
}
