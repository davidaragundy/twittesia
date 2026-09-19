// Writes a comment onto a post that is still alive, as one step: the comment expires with its
// post, the post's comment count and rank move with it, the author's identity and handle last at
// least as long, and its files become due with the post and stop waiting to be attached. Nothing
// is written to a post that has gone or expired.
//
// KEYS[1] the post, KEYS[2] the comment, KEYS[3] the author's identity, KEYS[4] their handle,
// KEYS[5] the files due for deletion, then one upload key per attached file
// ARGV[1] now in milliseconds, ARGV[2] the rank's score weight, ARGV[3] how many files, then
// their paths, then the comment's field/value pairs
// Returns the post's expiry in milliseconds, or -1 when the post is gone
export const CREATE_COMMENT_SCRIPT = `
local post, comment, identity, handle = KEYS[1], KEYS[2], KEYS[3], KEYS[4]
local now, weight = tonumber(ARGV[1]), tonumber(ARGV[2])

local fields = redis.call("HMGET", post, "expiresAt", "authorHandle", "createdAt", "reactionCount")
local expiresAt = tonumber(fields[1])
if not expiresAt or expiresAt <= now then return -1 end

local files = tonumber(ARGV[3])
local values = {}
for index = 4 + files, #ARGV do values[#values + 1] = ARGV[index] end

redis.call("HSET", comment, "expiresAt", fields[1], "postAuthorHandle", fields[2] or "", unpack(values))
redis.call("PEXPIREAT", comment, expiresAt)

local commentCount = redis.call("HINCRBY", post, "commentCount", 1)
local score = commentCount + (tonumber(fields[4]) or 0)
redis.call("HSET", post, "rank", string.format("%.0f", score * weight + math.floor(tonumber(fields[3]) / 1000)))

redis.call("PEXPIREAT", identity, expiresAt, "GT")
redis.call("PEXPIREAT", handle, expiresAt, "GT")

for index = 1, files do
  redis.call("ZADD", KEYS[5], fields[1], ARGV[3 + index])
  redis.call("DEL", KEYS[5 + index])
end

return expiresAt`;
