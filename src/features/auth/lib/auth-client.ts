import { anonymousClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { TOO_MANY_REQUESTS_STATUS } from "@/shared/constants/too-many-requests-status";

export const authClient = createAuthClient({
  plugins: [usernameClient(), anonymousClient()],
  fetchOptions: {
    // A failed request (offline, DNS, CORS) resolves with an error like any other response,
    // so callers handle it the same way instead of catching a throw
    catchAllError: true,
    // better-auth's recommended place for 429s: shown once here for every request, so no hook
    // handles them. The fixed id makes a burst of 429s update one toast instead of stacking.
    onError: async ({ response }) => {
      if (response?.status !== TOO_MANY_REQUESTS_STATUS) return;

      const retryAfter = Number(response.headers.get("X-Retry-After"));

      toast.error("Too many attempts", {
        id: "too-many-requests",
        description:
          retryAfter > 0
            ? `Try again in ${retryAfter} ${retryAfter === 1 ? "second" : "seconds"}.`
            : "Wait a moment and try again.",
      });
    },
  },
});
