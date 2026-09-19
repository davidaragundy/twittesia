// Deletes a comment its author asks to delete, as one step with its post's comment count and rank.
// Anyone else's comment, or one already gone, is left alone.
//
// KEYS[1] the comment, KEYS[2] its post
// ARGV[1] the reader, ARGV[2] the rank's score weight
// Returns 1 when deleted, 0 otherwise
export const DELETE_COMMENT_SCRIPT = `
local comment, post = KEYS[1], KEYS[2]
local reader, weight = ARGV[1], tonumber(ARGV[2])

if redis.call("HGET", comment, "authorId") ~= reader then return 0 end

redis.call("DEL", comment)

local fields = redis.call("HMGET", post, "createdAt", "reactionCount")
if fields[1] then
  local commentCount = redis.call("HINCRBY", post, "commentCount", -1)
  if commentCount < 0 then
    commentCount = 0
    redis.call("HSET", post, "commentCount", "0")
  end
  local score = commentCount + (tonumber(fields[2]) or 0)
  redis.call("HSET", post, "rank", string.format("%.0f", score * weight + math.floor(tonumber(fields[1]) / 1000)))
end

return 1`;
