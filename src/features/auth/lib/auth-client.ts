import {
  usernameClient,
  magicLinkClient,
  twoFactorClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
// import { sentinelClient } from "@better-auth/infra/client";

import { RATE_LIMIT_ERROR_CODE } from "@/shared/constants/rate-limit-error-code";
import { toastRateLimited } from "@/shared/utils/toast-rate-limited";

import type { auth } from "@/features/auth/lib/auth";

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    magicLinkClient(),
    twoFactorClient(),
    inferAdditionalFields<typeof auth>(),
    // sentinelClient(),
  ],
  fetchOptions: {
    // A failed request (offline, DNS, CORS) resolves with an error like any other,
    // instead of throwing out of the transition that made it
    catchAllError: true,
    onError: async (context) => {
      if (context.response.status === RATE_LIMIT_ERROR_CODE) toastRateLimited();
    },
  },
});
