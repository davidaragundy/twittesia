interface Props {
  // What the form asked to come back to, which is whatever the browser sent
  value: FormDataEntryValue | null;
}

/**
 * Where to send someone once they have an identity, or null when there is nowhere safe.
 *
 * Only a path inside Twittesia is allowed: anything starting with `//` or carrying a scheme is
 * another site, and a form that sent one would be using the start route to bounce people there.
 */
export const toReturnPath = ({ value }: Props) => {
  if (typeof value !== "string") return null;

  return /^\/(?!\/)[\w\-./]*$/.test(value) ? value : null;
};
