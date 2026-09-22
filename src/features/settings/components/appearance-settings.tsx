"use client";

import { Icon } from "@/shared/components/icon";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group";

import { THEME_OPTIONS } from "@/features/settings/constants/theme-options";
import { useAppearanceSettings } from "@/features/settings/hooks/use-appearance-settings";

// How Twittesia looks on this device. It is kept in this browser, not with the identity.
export function AppearanceSettings() {
  const { value, onValueChange } = useAppearanceSettings();

  return (
    <FieldGroup>
      <Field>
        <FieldLabel id="appearance-theme">Theme</FieldLabel>
        <ToggleGroup
          aria-labelledby="appearance-theme"
          variant="outline"
          value={value}
          onValueChange={onValueChange}
        >
          {THEME_OPTIONS.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              <Icon icon={option.icon} />
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription>
          System follows your device, and changes when it does. It is kept in this browser only.
        </FieldDescription>
      </Field>
    </FieldGroup>
  );
}
