// Records one reader having seen a batch of posts or comments. A view counts once per reader,
// never for the author, and never on anything gone or expired.
//
// KEYS pairs of the post or comment hash and its set of viewers
// ARGV[1] the reader, ARGV[2] now in milliseconds
// Returns how many views were new
export const RECORD_VIEWS_SCRIPT = `
local viewer, now = ARGV[1], tonumber(ARGV[2])
local recorded = 0

for index = 1, #KEYS, 2 do
  local target, viewers = KEYS[index], KEYS[index + 1]
  local fields = redis.call("HMGET", target, "authorId", "expiresAt")
  local expiresAt = tonumber(fields[2])

  if fields[1] and expiresAt and expiresAt > now and fields[1] ~= viewer then
    if redis.call("SADD", viewers, viewer) == 1 then
      redis.call("HINCRBY", target, "viewCount", 1)
      redis.call("PEXPIREAT", viewers, expiresAt)
      recorded = recorded + 1
    end
  end
end

return recorded`;
