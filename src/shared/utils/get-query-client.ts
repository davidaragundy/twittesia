import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

// A 4xx answer won't change on a retry, and retrying a 429 spends more of the rate limit.
// Anything else (network errors, 5xx) keeps TanStack's default of three retries.
const retryQuery = (failureCount: number, error: unknown) => {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number(error.status)
      : undefined;

  if (status !== undefined && status >= 400 && status < 500) return false;

  return failureCount < 3;
};

const createQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: retryQuery } } });

// A new client for every server render keeps requests isolated; the browser reuses one so its
// cache survives re-renders
export const getQueryClient = () => {
  if (typeof window === "undefined") return createQueryClient();

  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
};
