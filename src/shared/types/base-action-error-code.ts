// Codes any server action can return on top of its own
export type BaseActionErrorCode = "UNAUTHORIZED" | "INVALID_INPUT" | "RATE_LIMITED" | "UNKNOWN";
