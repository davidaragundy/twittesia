// Bounds one run, so the function can't outlast its time limit. Whatever is left waits for the
// next run, which is safe because an expired identity already fails every session lookup.
export const PURGE_MAX_BATCHES = 20;
