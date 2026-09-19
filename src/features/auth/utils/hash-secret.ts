interface Props {
  secret: string;
}

// SHA-256 of a session's secret, which is all the store ever keeps of it: a leaked store can't
// be turned back into a cookie that works
export const hashSecret = async ({ secret }: Props) =>
  new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret)));
