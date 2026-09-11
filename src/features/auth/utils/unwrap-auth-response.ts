import type { AuthClientError } from "@/features/auth/types/auth-client-error";

type AuthResponse<TData> = { data: TData; error: null } | { data: null; error: AuthClientError };

// `authClient` resolves with `{ data, error }` instead of throwing; TanStack Query only sees a
// failure when the mutation function throws, so this rethrows the error as it came
export const unwrapAuthResponse = async <TData>(request: Promise<AuthResponse<TData>>) => {
  const { data, error } = await request;

  if (error) throw error;

  return data;
};
