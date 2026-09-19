// Every file in Blob, scored by when it must be deleted: its owner's expiry once attached, the
// end of its grace while it waits, or now once its owner is gone. The sweep deletes what is due.
export const BLOB_EXPIRY_KEY = "blob-expiry";
