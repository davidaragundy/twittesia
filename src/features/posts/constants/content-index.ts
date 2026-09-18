import { s } from "@upstash/redis";

// The one search index, over every post and every comment hash: Upstash's free plan allows a
// single index, so `type` tells the two apart. It answers the feed in both orders, a post's
// comments, a profile's posts and comments, and their counts. A field a hash lacks leaves it out
// of any query that filters on it, so filtering on postId only ever finds comments.
//
// A change to the schema is a new name: an existing index keeps the schema it was created with.
export const CONTENT_INDEX = {
  name: "content-v1",
  prefix: ["post:", "comment:"],
  schema: s.object({
    type: s.keyword(),
    authorId: s.keyword(),
    postId: s.keyword(),
    createdAt: s.number("U64"),
    expiresAt: s.number("U64"),
    score: s.number("U64"),
  }),
};
