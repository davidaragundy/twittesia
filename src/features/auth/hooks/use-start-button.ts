import { type MouseEvent, useState } from "react";

// The form leaves the page when it is sent, so the button only has to say it was pressed until
// the next page arrives, and a second press does nothing rather than sending it again
export const useStartButton = () => {
  const [isPending, setPending] = useState(false);

  return {
    isPending,
    onSubmit: () => setPending(true),
    onClick: (event: MouseEvent) => {
      if (isPending) event.preventDefault();
    },
  };
};
