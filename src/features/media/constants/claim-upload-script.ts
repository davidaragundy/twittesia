// Claims a path for one upload and schedules its file for deletion at the end of its grace, as
// one step: a path can be claimed once, and a claimed file is always known to the sweep.
//
// KEYS[1] the upload's key, KEYS[2] the set of files due for deletion
// ARGV[1] the claim as JSON, ARGV[2] the grace in milliseconds, ARGV[3] the path,
// ARGV[4] when the grace ends, in milliseconds
// Returns 1 when claimed, 0 when the path was already taken
export const CLAIM_UPLOAD_SCRIPT = `
if not redis.call("SET", KEYS[1], ARGV[1], "NX", "PX", ARGV[2]) then return 0 end
redis.call("ZADD", KEYS[2], ARGV[4], ARGV[3])
return 1`;
