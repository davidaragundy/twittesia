import { Bucket } from "@upstash/blob";

// Reads UPSTASH_BLOB_TOKEN, which can read and write the whole bucket, so it never leaves the
// server. The bucket is public: every stored file has a URL anyone can load.
export const bucket = Bucket.fromEnv();
