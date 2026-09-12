// Codes the auth email senders throw, alongside better-auth's own `auth.$ERROR_CODES`
export const AUTH_EMAIL_ERROR_CODES = {
  FAILED_TO_SEND_VERIFICATION_EMAIL: "Failed to send verification email",
  FAILED_TO_SEND_MAGIC_LINK: "Failed to send magic link",
  FAILED_TO_SEND_RESET_PASSWORD_EMAIL: "Failed to send reset password email",
  FAILED_TO_SEND_TWO_FACTOR_OTP: "Failed to send two-factor authentication OTP",
  FAILED_TO_SEND_CHANGE_EMAIL_CONFIRMATION: "Failed to send change email confirmation",
  FAILED_TO_SEND_EXISTING_USER_SIGN_UP_EMAIL: "Failed to send existing user sign up email",
  FAILED_TO_SEND_DELETE_ACCOUNT_VERIFICATION: "Failed to send delete account verification",
} as const;
