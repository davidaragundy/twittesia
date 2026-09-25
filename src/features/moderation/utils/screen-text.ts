import "server-only";

import { noul } from "@typesafe-ai/sdk";

import { tryCatch } from "@/shared/utils/try-catch";

import { MODERATION_CATEGORIES } from "@/features/moderation/constants/moderation-categories";
import { getTypesafe } from "@/features/moderation/lib/typesafe";
import type { ModerationFlags } from "@/features/moderation/types/moderation-flags";

interface Props {
  text: string;
}

// Every category as its own yes/no question, so several can hold at once, all asked together
const QUESTIONS = Object.fromEntries(
  MODERATION_CATEGORIES.map((category) => [
    category.value,
    noul(category.instructions, category.criteria),
  ]),
);

/**
 * How likely a piece of writing is to fall in each moderation category, in one request to Jev.
 *
 * Moderation must never stand between someone and publishing: with nothing to read, no key, or
 * TypeSafe out of reach, the answer is null and the writing goes out unflagged.
 */
export const screenText = async ({ text }: Props): Promise<ModerationFlags | null> => {
  if (!text.trim() || !process.env.TYPESAFEAI_API_KEY) return null;

  const { data, error } = await tryCatch(
    getTypesafe().systemOne({
      // Named, so the questions can say what they are judging
      state: { post: text },
      questions: QUESTIONS,
    }),
  );

  if (error) {
    console.error("Couldn't screen text with TypeSafe", error);
    return null;
  }

  return Object.fromEntries(
    Object.entries(data.answers).map(([category, answer]) => [category, answer.noul]),
  );
};
