interface Props {
  // What HGETALL answers with automatic deserialization off: [field, value, field, value, …], or
  // null or nothing for a key that doesn't exist
  reply: unknown;
}

// A hash as a record of strings, or null for a key that has expired or never existed
export const toHashRecord = ({ reply }: Props): Record<string, string> | null => {
  if (!Array.isArray(reply) || !reply.length) return null;

  const record: Record<string, string> = {};

  for (let index = 0; index + 1 < reply.length; index += 2) {
    record[String(reply[index])] = String(reply[index + 1]);
  }

  return record;
};
