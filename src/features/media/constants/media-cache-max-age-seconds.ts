// How long the CDN and browsers may keep a file. Every path is new, so nothing is ever stale; but
// a deleted file can still be served from a cache until this runs out, and nothing lives longer
// than a day, so it is a day rather than a year.
export const MEDIA_CACHE_MAX_AGE_SECONDS = 60 * 60 * 24;
