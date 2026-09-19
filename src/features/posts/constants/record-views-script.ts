// Records one reader having seen a batch of posts or comments. A view counts once per reader,
// never for the author, and never on anything gone or expired.
//
// Readers go into a HyperLogLog rather than a set: it answers how many, within about 0.81%, in at
// most 12 KB, and cannot say who. PFADD answers 1 when the estimate changed, which is when the
// hash's viewCount, the number the index and the page read, takes the new estimate. It never
// goes down, even where an estimate would.
//
// KEYS pairs of the post or comment hash and its HyperLogLog of readers
// ARGV[1] the reader, ARGV[2] now in milliseconds
// Returns how many views were new
export const RECORD_VIEWS_SCRIPT = `
local viewer, now = ARGV[1], tonumber(ARGV[2])
local recorded = 0

for index = 1, #KEYS, 2 do
  local target, views = KEYS[index], KEYS[index + 1]
  local fields = redis.call("HMGET", target, "authorId", "expiresAt", "viewCount")
  local expiresAt = tonumber(fields[2])

  if fields[1] and expiresAt and expiresAt > now and fields[1] ~= viewer then
    if redis.call("PFADD", views, viewer) == 1 then
      local count = math.max(redis.call("PFCOUNT", views), tonumber(fields[3]) or 0)
      redis.call("HSET", target, "viewCount", count)
      redis.call("PEXPIREAT", views, expiresAt)
      recorded = recorded + 1
    end
  end
end

return recorded`;
