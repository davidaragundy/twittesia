import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { anonymous, username } from "better-auth/plugins";

import { BASE_URL } from "@/shared/constants/base-url";
import { db } from "@/shared/lib/drizzle/server";

import { AUTH_COOKIE_PREFIX } from "@/features/auth/constants/auth-cookie-prefix";
import { IDENTITY_LIFESPAN_SECONDS } from "@/features/auth/constants/identity-lifespan-seconds";
import { generateHandle } from "@/features/auth/utils/generate-handle";
import { getAvatarUrl } from "@/features/auth/utils/get-avatar-url";
import { getDisplayName } from "@/features/auth/utils/get-display-name";

export const auth = betterAuth({
  appName: "Twittesia",
  baseURL: BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  logger: {
    level: "debug",
  },
  rateLimit: {
    storage: "database",
    enabled: true,
  },
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
  },
  session: {
    // An identity lasts as long as the content it creates, and no longer. Refresh has to be off
    // for that to hold: updateAge would slide the expiry forward on every visit, and an identity
    // that keeps being used would outlive every post it ever wrote.
    expiresIn: IDENTITY_LIFESPAN_SECONDS,
    disableSessionRefresh: true,
  },
  plugins: [
    username({
      // better-auth's default validator rejects hyphens, and every handle we generate has two.
      // Without this a user's own handle fails validation the moment they open the form.
      usernameValidator: (value) => /^[a-zA-Z0-9_-]+$/.test(value),
    }),
    anonymous({
      // Nothing signs in any other way, so there is never an account to link and never an
      // anonymous user to clean up after linking one
      disableDeleteAnonymousUser: true,
    }),
    // Must stay last, so the Set-Cookie headers of every plugin before it reach Next.js
    nextCookies(),
  ],
  databaseHooks: {
    user: {
      create: {
        // The anonymous plugin writes only an email, a name and isAnonymous. Everything the app
        // shows of a person — their handle, their display name, their picture — is invented here,
        // because there is no profile anywhere to take it from.
        before: async (user) => {
          const handle = generateHandle();

          return {
            data: {
              ...user,
              name: getDisplayName({ handle }),
              username: handle,
              displayUsername: handle,
              image: await getAvatarUrl({ handle }),
            },
          };
        },
      },
    },
  },
});
