// Bounds one run, so the function can't outlast its time limit. Whatever is left waits for the
// next run, which is safe because expired posts are already hidden from every read.
export const PURGE_MAX_BATCHES = 20;
