"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/shared/components/icon";
import { Badge } from "@/shared/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/components/ui/input-group";
import { Switch } from "@/shared/components/ui/switch";

import { MODERATION_CATEGORIES } from "@/features/moderation/constants/moderation-categories";
import { useModerationSettings } from "@/features/moderation/hooks/use-moderation-settings";

/**
 * What a reader would rather not see at first. Everything starts on; each switch turns something
 * off. It is kept in this browser, and only changes what this browser hides: nothing is removed
 * for anyone else.
 */
export function ModerationSettings() {
  const {
    preferences,
    draft,
    setDraft,
    canAddWord,
    setEnabled,
    setCategoryHidden,
    setMutingWords,
    addWord,
    removeWord,
  } = useModerationSettings();
  const isOff = !preferences.isEnabled;

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="moderation-enabled">Hide flagged content</FieldLabel>
          <FieldDescription>
            Posts and comments are checked automatically when they are written. What is flagged is
            blurred, with the reason, until you choose to see it.
          </FieldDescription>
        </FieldContent>
        <Switch
          id="moderation-enabled"
          checked={preferences.isEnabled}
          onCheckedChange={setEnabled}
        />
      </Field>

      <FieldSet data-disabled={isOff || undefined}>
        <FieldLegend variant="label">Categories</FieldLegend>
        <FieldDescription>Turn one off to see it without a blur.</FieldDescription>
        <div className="flex flex-col gap-4">
          {MODERATION_CATEGORIES.map((category) => (
            <Field key={category.value} orientation="horizontal" data-disabled={isOff || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={`moderation-${category.value}`}>{category.label}</FieldLabel>
                <FieldDescription>{category.description}</FieldDescription>
              </FieldContent>
              <Switch
                id={`moderation-${category.value}`}
                checked={!preferences.shownCategories.includes(category.value)}
                onCheckedChange={(checked) => setCategoryHidden(category.value, checked)}
                disabled={isOff}
              />
            </Field>
          ))}
        </div>
      </FieldSet>

      <FieldSet data-disabled={isOff || undefined}>
        <Field orientation="horizontal" data-disabled={isOff || undefined}>
          <FieldContent>
            <FieldLabel htmlFor="moderation-muted-words">Muted words</FieldLabel>
            <FieldDescription>
              Hide anything containing these words or phrases, whether or not it was flagged.
            </FieldDescription>
          </FieldContent>
          <Switch
            id="moderation-muted-words"
            checked={preferences.isMutingWords}
            onCheckedChange={setMutingWords}
            disabled={isOff}
          />
        </Field>

        <form onSubmit={addWord}>
          <InputGroup data-disabled={isOff || !preferences.isMutingWords || undefined}>
            <InputGroupInput
              aria-label="Word or phrase to mute"
              placeholder="Add a word or phrase"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={isOff || !preferences.isMutingWords}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton type="submit" size="xs" disabled={!canAddWord}>
                Mute
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>

        {!!preferences.mutedWords.length && (
          <ul aria-label="Muted words" className="flex flex-wrap gap-2">
            {preferences.mutedWords.map((word) => (
              <li key={word}>
                <Badge variant="secondary">
                  {word}
                  <button
                    type="button"
                    aria-label={`Unmute ${word}`}
                    onClick={() => removeWord(word)}
                    className="-mr-1 rounded-full opacity-60 transition-opacity hover:opacity-100"
                  >
                    <Icon icon={Cancel01Icon} className="size-3" />
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </FieldSet>
    </FieldGroup>
  );
}
