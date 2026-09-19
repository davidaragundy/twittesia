import { s } from "@upstash/redis";

// The one search index, over every post and every comment hash: Upstash's free plan allows a
// single index, so `type` tells the two apart. It answers the feed in both orders, a post's
// comments, a profile's posts and comments, and a profile's counts, summed from `reactionCount`
// and `viewCount`. A field a hash lacks leaves it out of any query that filters on it, so
// filtering on postId only ever finds comments.
//
// `rank` orders by popularity with the newest first among equals, in one field: the index sorts
// on a single field at a time. An existing index keeps the schema it was created with, so a
// change here means running `pnpm redis:indexes --recreate`.
export const CONTENT_INDEX = {
  name: "content",
  prefix: ["post:", "comment:"],
  schema: s.object({
    type: s.keyword(),
    authorId: s.keyword(),
    postId: s.keyword(),
    createdAt: s.number("U64"),
    expiresAt: s.number("U64"),
    rank: s.number("U64"),
    reactionCount: s.number("U64"),
    viewCount: s.number("U64"),
  }),
};
