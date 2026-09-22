"use client";

import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

import { START_PATH } from "@/features/auth/constants/start-path";
import { START_RETURN_FIELD } from "@/features/auth/constants/start-return-field";
import { useStartButton } from "@/features/auth/hooks/use-start-button";

interface Props {
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  // Where to land afterwards, for someone who was on their way somewhere
  returnPath?: string;
  label?: string;
}

// A form rather than a link: an identity is written, and a link is fetched by things nobody
// clicked. `contents` keeps the form out of the layout, so the button sits where it always did.
export const StartButton = ({ size, className, returnPath, label }: Props) => {
  const { isPending, onSubmit, onClick } = useStartButton();

  return (
    <form action={START_PATH} method="post" className="contents" onSubmit={onSubmit}>
      {returnPath && <input type="hidden" name={START_RETURN_FIELD} value={returnPath} />}
      {/* Read-only once sent rather than disabled, so a second press can't send it twice and the
          first isn't cancelled */}
      <Button
        type="submit"
        size={size}
        className={className}
        aria-disabled={isPending}
        onClick={onClick}
      >
        {isPending && <Spinner data-icon="inline-start" />}
        {label ?? "Start posting"}
      </Button>
    </form>
  );
};
