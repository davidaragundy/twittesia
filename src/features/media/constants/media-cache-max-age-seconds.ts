// How long the CDN and browsers may keep a file. Nothing lives longer than a day, and a deleted
// file can still be served from a cache until this runs out, so it is a day rather than Blob's
// default month.
export const MEDIA_CACHE_MAX_AGE_SECONDS = 60 * 60 * 24;
