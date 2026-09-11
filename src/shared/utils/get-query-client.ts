import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

// A new client for every server render keeps requests isolated; the browser reuses one so its
// cache survives re-renders
export const getQueryClient = () => {
  if (typeof window === "undefined") return new QueryClient();

  browserQueryClient ??= new QueryClient();

  return browserQueryClient;
};
