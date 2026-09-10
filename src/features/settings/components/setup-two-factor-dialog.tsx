"use client";

import { Loading03Icon, ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { QRCodeSVG } from "qrcode.react";
import { Controller } from "react-hook-form";

import { CopyToClipboard } from "@/shared/components/copy-to-clipboard";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/shared/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";

import { useSetupTwoFactorDialog } from "@/features/settings/hooks/use-setup-two-factor-dialog";

interface Props {
  isOpen: boolean;
  closeDialog: () => void;
  totpURI: string;
}

export const SetupTwoFactorDialog = ({ totpURI, isOpen, closeDialog }: Props) => {
  const { form, onSubmit, isPending, isError, key } = useSetupTwoFactorDialog({
    totpURI,
    closeDialog,
  });

  return (
    <Dialog disablePointerDismissal open={isOpen}>
      <DialogContent showCloseButton={false} className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>Scan the QR in your authenticator app</DialogTitle>
        </DialogHeader>

        <QRCodeSVG
          className="mx-auto rounded-xl"
          size={256}
          bgColor="#0b0809"
          fgColor="#ffffff"
          value={totpURI}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Or enter your secret key manually:</span>
          <CopyToClipboard value={key} />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex flex-col">
                <FieldLabel htmlFor={field.name}>One-Time Password</FieldLabel>
                <FieldDescription>
                  Please enter the one-time password from your authenticator app.
                </FieldDescription>
                <div className="flex items-center gap-4">
                  <InputOTP
                    {...field}
                    id={field.name}
                    pattern={REGEXP_ONLY_DIGITS}
                    maxLength={6}
                    onComplete={form.handleSubmit(onSubmit)}
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

                  <Button
                    variant={isError ? "destructive" : "default"}
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending && <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />}
                    {isError && <HugeiconsIcon icon={ArrowReloadHorizontalIcon} />}
                    Verify
                  </Button>
                </div>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
