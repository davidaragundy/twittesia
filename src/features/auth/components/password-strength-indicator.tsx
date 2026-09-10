"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { usePasswordStrengthIndicator } from "@/features/auth/hooks/use-password-strength-indicator";

interface Props {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: Props) => {
  const { strength, strengthScore, getStrengthColor, getStrengthText } =
    usePasswordStrengthIndicator({ password });

  return (
    <>
      <div
        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        />
      </div>

      <p className="text-foreground mb-2 text-sm font-medium">
        {getStrengthText(strengthScore)}. Must contain:
      </p>

      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((requirement, index) => (
          <li key={index} className="flex items-center gap-2">
            {requirement.met ? (
              <HugeiconsIcon
                icon={Tick02Icon}
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${requirement.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {requirement.text}
              <span className="sr-only">
                {requirement.met ? " - Requirement met" : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
