import { Button } from "@/shared/components/ui/button";

import { START_PATH } from "@/features/auth/constants/start-path";

interface Props {
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}

// A form rather than a link: an identity is written, and a link is fetched by things nobody
// clicked. `contents` keeps the form out of the layout, so the button sits where it always did.
export const StartButton = ({ size, className }: Props) => (
  <form action={START_PATH} method="post" className="contents">
    <Button type="submit" size={size} className={className}>
      Start posting
    </Button>
  </form>
);
