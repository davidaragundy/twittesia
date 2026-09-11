"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { QRCodeSVG } from "qrcode.react";
import { Controller } from "react-hook-form";

import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { Spinner } from "@/shared/components/ui/spinner";

import { useSetupTwoFactorDialog } from "@/features/settings/hooks/use-setup-two-factor-dialog";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  totpURI: string;
}

export const SetupTwoFactorDialog = ({ totpURI, isOpen, closeDialog }: Props) => {
  const { form, onSubmit, isPending, key } = useSetupTwoFactorDialog({ totpURI, closeDialog });

  return (
    <Dialog disablePointerDismissal open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Set up your authenticator app</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app, then enter the code it shows.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <QRCodeSVG size={192} value={totpURI} />
        </div>

        <form id="setup-two-factor-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="setup-two-factor-form-key">Secret key</FieldLabel>
              <CopyToClipboard id="setup-two-factor-form-key" value={key} />
              <FieldDescription>Can&apos;t scan it? Enter this key instead.</FieldDescription>
            </Field>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="setup-two-factor-form-code">One-time password</FieldLabel>
                  <InputOTP
                    {...field}
                    id="setup-two-factor-form-code"
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    onComplete={form.handleSubmit(onSubmit)}
                    aria-invalid={fieldState.invalid}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="setup-two-factor-form" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
