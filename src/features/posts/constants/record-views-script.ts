// Records a reader having seen a batch of posts or comments. A view is counted as it happens,
// never for the author, and never on anything gone or expired.
//
// Nothing is kept about who saw what: the count on the hash is the whole record, so a reader who
// comes back counts again.
//
// KEYS the post or comment hashes seen
// ARGV[1] the reader, ARGV[2] now in milliseconds
// Returns how many views were recorded
export const RECORD_VIEWS_SCRIPT = `
local viewer, now = ARGV[1], tonumber(ARGV[2])
local recorded = 0

for index = 1, #KEYS do
  local target = KEYS[index]
  local fields = redis.call("HMGET", target, "authorId", "expiresAt")
  local expiresAt = tonumber(fields[2])

  if fields[1] and expiresAt and expiresAt > now and fields[1] ~= viewer then
    redis.call("HINCRBY", target, "viewCount", 1)
    recorded = recorded + 1
  end
end

return recorded`;
