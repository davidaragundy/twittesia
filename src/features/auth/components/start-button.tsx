import { Button } from "@/shared/components/ui/button";

import { START_PATH } from "@/features/auth/constants/start-path";
import { START_RETURN_FIELD } from "@/features/auth/constants/start-return-field";

interface Props {
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  // Where to land afterwards, for someone who was on their way somewhere
  returnPath?: string;
  label?: string;
}

// A form rather than a link: an identity is written, and a link is fetched by things nobody
// clicked. `contents` keeps the form out of the layout, so the button sits where it always did.
export const StartButton = ({ size, className, returnPath, label }: Props) => (
  <form action={START_PATH} method="post" className="contents">
    {returnPath && <input type="hidden" name={START_RETURN_FIELD} value={returnPath} />}
    <Button type="submit" size={size} className={className}>
      {label ?? "Start posting"}
    </Button>
  </form>
);
