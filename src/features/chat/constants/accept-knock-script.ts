// Lets one of the people waiting into a chat, as one step: the chat gains its second person, the
// invite is spent, and everyone else waiting is dropped. Two knocks cannot both win.
//
// The guest's chats outlive any one chat in them, so their expiry only ever moves later.
//
// KEYS[1] the chat, KEYS[2] everyone waiting to be let into it, KEYS[3] the guest's chats
// ARGV[1] the creator, ARGV[2] who is being let in, ARGV[3] the chat's id, ARGV[4] now in
// milliseconds, ARGV[5] when the chat expires, in seconds
// Returns what the creator saw of the guest as JSON, -1 when the chat has gone, -2 when it
// already has two people, -3 when the chat is someone else's, -4 when that person is not waiting
export const ACCEPT_KNOCK_SCRIPT = `
local chat, knocks, chats = KEYS[1], KEYS[2], KEYS[3]
local creator, guest, chatId = ARGV[1], ARGV[2], ARGV[3]
local now, expiresAtSeconds = tonumber(ARGV[4]), ARGV[5]

local fields = redis.call("HMGET", chat, "expiresAt", "guestId", "creatorId", "createdAt")
local expiresAt = tonumber(fields[1])

if not expiresAt or expiresAt <= now then return -1 end
if fields[2] then return -2 end
if fields[3] ~= creator then return -3 end

local knock = redis.call("HGET", knocks, guest)
if not knock then return -4 end

local who = cjson.decode(knock)

redis.call("HSET", chat,
  "guestId", guest,
  "guestHandle", who.handle,
  "guestName", who.name or "",
  "joinedAt", tostring(now))

redis.call("DEL", knocks)

redis.call("ZADD", chats, fields[4], chatId)

if redis.call("PTTL", chats) < 0 then
  redis.call("EXPIREAT", chats, expiresAtSeconds)
else
  redis.call("EXPIREAT", chats, expiresAtSeconds, "GT")
end

return knock`;
