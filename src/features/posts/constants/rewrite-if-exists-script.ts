// Sets the same fields on every hash in KEYS that still exists. HSET on a hash that expired a
// moment ago would recreate it with no expiry, forever.
export const REWRITE_IF_EXISTS_SCRIPT = `
for _, key in ipairs(KEYS) do
  if redis.call("EXISTS", key) == 1 then
    redis.call("HSET", key, unpack(ARGV))
  end
end
return #KEYS`;
