// What the browser gets of each active session: enough to show and revoke it, never the token
export type ActiveSession = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  updatedAt: Date;
};
