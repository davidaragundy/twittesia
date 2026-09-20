// Toggles one emoji of one reader on a post or a comment, as one step: who reacted, the ordered
// reactions, the count and the rank all change together or not at all. Nothing happens to a
// target that has gone or expired.
//
// Who reacted is one hash for the whole target, a field per reader, so deleting the target
// deletes it too. A reader who has taken their last emoji back loses their field rather than
// keeping an empty one.
//
// KEYS[1] the post or comment hash, KEYS[2] who reacted to it
// ARGV[1] the emoji, ARGV[2] the reader, ARGV[3] now in milliseconds, ARGV[4] the rank's score weight
// Returns 1 when added, 0 when removed, -1 when the target is gone
export const TOGGLE_REACTION_SCRIPT = `
local target, reacted = KEYS[1], KEYS[2]
local emoji, reader, now, weight = ARGV[1], ARGV[2], tonumber(ARGV[3]), tonumber(ARGV[4])

local fields = redis.call("HMGET", target, "expiresAt", "createdAt", "reactions", "commentCount")
local expiresAt = tonumber(fields[1])
if not expiresAt or expiresAt <= now then return -1 end

local mine = cjson.decode(redis.call("HGET", reacted, reader) or "[]")
local held = nil
for position, held_emoji in ipairs(mine) do
  if held_emoji == emoji then held = position end
end

local added = held == nil
if added then
  table.insert(mine, emoji)
else
  table.remove(mine, held)
end

if #mine == 0 then
  redis.call("HDEL", reacted, reader)
else
  redis.call("HSET", reacted, reader, cjson.encode(mine))
end
redis.call("PEXPIREAT", reacted, expiresAt)

local reactions = cjson.decode(fields[3] or "[]")
local index = nil
for position, reaction in ipairs(reactions) do
  if reaction.emoji == emoji then index = position end
end

if added and index then
  reactions[index].count = reactions[index].count + 1
elseif added then
  table.insert(reactions, { emoji = emoji, count = 1 })
elseif index then
  reactions[index].count = reactions[index].count - 1
  if reactions[index].count <= 0 then table.remove(reactions, index) end
end

local reactionCount = redis.call("HINCRBY", target, "reactionCount", added and 1 or -1)
local score = reactionCount + (tonumber(fields[4]) or 0)
local rank = score * weight + math.floor(tonumber(fields[2]) / 1000)

redis.call("HSET", target,
  "reactions", #reactions == 0 and "[]" or cjson.encode(reactions),
  "rank", string.format("%.0f", rank))

return added and 1 or 0`;
