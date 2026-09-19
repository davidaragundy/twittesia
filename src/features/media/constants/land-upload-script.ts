// Records that a claimed upload has landed in the bucket, and what it turned out to be, keeping
// the claim's expiry. Only the identity that claimed it can land it.
//
// KEYS[1] the upload's key
// ARGV[1] the uploader, ARGV[2] the stored file as JSON: its url, content type and size
// Returns 1 when recorded, 0 when the claim is gone or someone else's
export const LAND_UPLOAD_SCRIPT = `
local claim = redis.call("GET", KEYS[1])
if not claim then return 0 end

local parsed = cjson.decode(claim)
if parsed.uploaderId ~= ARGV[1] then return 0 end

parsed.landed = cjson.decode(ARGV[2])
redis.call("SET", KEYS[1], cjson.encode(parsed), "XX", "KEEPTTL")
return 1`;
