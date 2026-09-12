import "server-only";

// Vercel sends CRON_SECRET as a bearer token when it runs a job, which is what tells its request
// apart from anyone else's. With no secret configured nothing is authorised, so a missing
// environment variable fails closed rather than leaving the job open to the internet.
export const isCronRequest = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET;

  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
};
