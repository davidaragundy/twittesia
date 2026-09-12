import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username, magicLink, twoFactor, haveIBeenPwned } from "better-auth/plugins";
// import { dash } from "@better-auth/infra";

import { BASE_URL } from "@/shared/constants/base-url";
import { db } from "@/shared/lib/drizzle/server";

import { AUTH_COOKIE_PREFIX } from "@/features/auth/constants/auth-cookie-prefix";
import { sendChangeEmailConfirmation } from "@/features/auth/utils/send-change-email-confirmation";
import { sendDeleteAccountVerification } from "@/features/auth/utils/send-delete-account-verification";
import { sendExistingUserSignUpEmail } from "@/features/auth/utils/send-existing-user-sign-up";
import { sendMagicLink } from "@/features/auth/utils/send-magic-link";
import { sendOTP } from "@/features/auth/utils/send-otp";
import { sendResetPassword } from "@/features/auth/utils/send-reset-password";
import { sendVerificationEmail } from "@/features/auth/utils/send-verification-email";

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
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["emailAndPassword", "github", "google"],
    },
  },
  advanced: {
    cookiePrefix: AUTH_COOKIE_PREFIX,
  },
  plugins: [
    username(),
    magicLink({
      disableSignUp: true,
      sendMagicLink: sendMagicLink,
    }),
    twoFactor({
      issuer: "Twittesia",
      otpOptions: {
        sendOTP: sendOTP,
      },
    }),
    haveIBeenPwned({
      enabled: process.env.NODE_ENV === "production",
    }),
    // dash(),
    // Must stay last, so the Set-Cookie headers of every plugin before it reach Next.js
    nextCookies(),
  ],
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: sendChangeEmailConfirmation,
    },
    // Leaving is confirmed by email, so it works the same for a password account and for one
    // that only ever signed in with GitHub or Google
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: sendDeleteAccountVerification,
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: sendVerificationEmail,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: sendExistingUserSignUpEmail,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: sendResetPassword,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          username: profile.login,
          displayUsername: profile.login,
        };
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          username: profile.email.split("@")[0],
          displayUsername: profile.email.split("@")[0],
        };
      },
    },
  },
});
