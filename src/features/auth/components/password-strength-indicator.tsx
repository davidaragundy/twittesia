"use client";

import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Progress, ProgressLabel } from "@/shared/components/ui/progress";

import { usePasswordStrengthIndicator } from "@/features/auth/hooks/use-password-strength-indicator";

interface Props {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: Props) => {
  const { strength, strengthScore, getStrengthText } = usePasswordStrengthIndicator({
    password,
  });

  return (
    <>
      <Progress value={(strengthScore / strength.length) * 100}>
        <ProgressLabel>{getStrengthText(strengthScore)}</ProgressLabel>
      </Progress>
      <ul
        aria-label="Password requirements"
        className="flex flex-col gap-1 text-sm text-muted-foreground"
      >
        {strength.map((requirement) => (
          <li key={requirement.text} className="flex items-center gap-2">
            <HugeiconsIcon icon={requirement.met ? Tick02Icon : Cancel01Icon} aria-hidden="true" />
            {requirement.text}
            <span className="sr-only">
              {requirement.met ? " - Requirement met" : " - Requirement not met"}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
