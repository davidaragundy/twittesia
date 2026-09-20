// Asks to be let into a chat, as one step, so a chat that fills up while someone is knocking
// never takes the knock. Knocking again only rewrites what the creator already sees.
//
// KEYS[1] the chat, KEYS[2] everyone waiting to be let into it
// ARGV[1] the asker, ARGV[2] what the creator sees of them as JSON, ARGV[3] now in milliseconds,
// ARGV[4] how many may wait at once
// Returns 1 when the knock is waiting, -1 when the chat has gone, -2 when it already has two
// people, -3 when the asker is its creator, -4 when too many are already waiting
export const KNOCK_SCRIPT = `
local chat, knocks = KEYS[1], KEYS[2]
local asker, knock, now, maxKnocks = ARGV[1], ARGV[2], tonumber(ARGV[3]), tonumber(ARGV[4])

local fields = redis.call("HMGET", chat, "expiresAt", "guestId", "creatorId")
local expiresAt = tonumber(fields[1])

if not expiresAt or expiresAt <= now then return -1 end
if fields[2] then return -2 end
if fields[3] == asker then return -3 end

if redis.call("HEXISTS", knocks, asker) == 0 and redis.call("HLEN", knocks) >= maxKnocks then
  return -4
end

redis.call("HSET", knocks, asker, knock)
redis.call("PEXPIREAT", knocks, expiresAt)

return 1`;
