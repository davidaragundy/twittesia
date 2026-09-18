// How long an upload may wait for its post or comment before the sweep treats it as abandoned:
// longer than its token lives, plus the time a 25 MB file takes on a slow connection
export const PENDING_MEDIA_GRACE_MS = 60 * 60 * 1_000;
