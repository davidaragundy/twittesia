import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username, magicLink, twoFactor, haveIBeenPwned } from "better-auth/plugins";
// import { dash } from "@better-auth/infra";

import { BASE_URL } from "@/shared/constants";
import { sendChangeEmailConfirmation } from "@/shared/lib/better-auth/email-handlers/send-change-email-confirmation";
import { sendExistingUserSignUpEmail } from "@/shared/lib/better-auth/email-handlers/send-existing-user-sign-up";
import { sendMagicLink } from "@/shared/lib/better-auth/email-handlers/send-magic-link";
import { sendOTP } from "@/shared/lib/better-auth/email-handlers/send-otp";
import { sendResetPassword } from "@/shared/lib/better-auth/email-handlers/send-reset-password";
import { sendVerificationEmail } from "@/shared/lib/better-auth/email-handlers/send-verification-email";
import { db } from "@/shared/lib/drizzle/server";

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
    cookiePrefix: "twittesia",
  },
  plugins: [
    nextCookies(),
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
  ],
  user: {
    additionalFields: {
      followerCount: {
        type: "number",
        defaultValue: 0,
      },
      followingCount: {
        type: "number",
        defaultValue: 0,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: sendChangeEmailConfirmation,
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
