"use client";

import { AtIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";

import { useSession } from "@/features/auth/hooks/use-session";

// The name and handle an identity was given, kept for as long as it lasts: every post and
// comment carries a copy of them, so changing either would mean rewriting all of those
export function AccountDetails() {
  const session = useSession();

  return (
    <FieldGroup className="gap-14">
      <Field data-disabled>
        <FieldLabel htmlFor="account-details-name">Name</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon icon={UserIcon} />
          </InputGroupAddon>
          <InputGroupInput id="account-details-name" value={session?.user.name ?? ""} disabled />
        </InputGroup>
        <FieldDescription>
          The name you were given. It stays yours until your identity ends.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="account-details-username">Username</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon icon={AtIcon} />
          </InputGroupAddon>
          <InputGroupInput
            id="account-details-username"
            value={session?.user.displayUsername ?? ""}
            disabled
          />
        </InputGroup>
        <FieldDescription>
          How people find and mention you. It stays yours until your identity ends.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
