import { connection } from "next/server";

// Reads the clock per request, so render it inside <Suspense> to keep the rest of the shell static
export async function CurrentYear() {
  await connection();

  return new Date().getFullYear();
}
