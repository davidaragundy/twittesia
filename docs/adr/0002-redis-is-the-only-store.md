---
status: accepted
---

# Redis is the only store

Everything Twittesia keeps lives for a day at most: identities, sessions, posts,
comments, reactions, views and the record of attached files. Nobody signs up, and
nothing is kept for later. **Upstash Redis is the only store**, and an Upstash
Blob bucket holds the files. There is no relational database and no authentication library.

## Why

Redis already does what the app spent most of its storage code on. A key expires
by itself, so content, and everything hanging off it, goes at its expiry without
a purge. A view is a set member, a count is `HINCRBY`, and the few changes that
must happen together run as one Lua script. Upstash adds a search index over the
hashes, which answers the feed, a post's comments and a profile in one query
each, and realtime and full-text search later without another service.

## Consequences

- **Keys expire with what they belong to.** A post's hash, the reader sets of
  its reactions and the HyperLogLog counting its viewers all expire when the post
  does; a comment expires with its post. Nothing is deleted by a schedule except
  files in Blob, since an expiring key notifies nobody: every file's deletion time
  sits in a sorted set, and a sweep deletes what is due.
- **Open pages hear about changes over the same store.** Every write to a post or
  a comment emits an event on a Redis stream, which pages read over one long-lived
  HTTP connection. The events carry ids and counts, never text: a page reads the
  content itself, so what it shows is always what the store holds.
- **Each count uses the smallest structure that answers it.** Views only need how
  many, never who, so a HyperLogLog counts them, in at most 12 KB and within about
  0.81%. Reactions need who, to show a reader their own, so they stay sets.
- **Reads are denormalised.** A post carries its author's handle and name, its
  counts, its popularity score, its reactions in the order they were first added,
  and its media, so a page is one search query plus one set per item for the
  reader's own reactions. An identity keeps the name and handle it was given, so
  the copies never go stale.
- **One search index, over posts and comments.** The free plan allows a single
  index, so a `type` field tells the two apart. Indexing lags a write by about
  half a second, so a writer sees their own content through the client's cache,
  and queries filter out anything past its expiry that the index still holds.
  It sorts on one field at a time, so popularity is indexed as one `rank`: the
  score, then the creation time, which keeps ties newest first and lets both
  orders page by cursor. With room for only one index, a change to its schema
  drops and recreates it (`pnpm redis:indexes --recreate`).
- **Identities are the app's own.** A session is a random token in an httpOnly
  cookie; Redis keeps only its SHA-256, and forgets it after a day.
- **Every command is billed.** Upstash counts each command, pipelined or not, so
  a feature is designed around how many it costs per page, not per query.

## Considered options

**Postgres, with Redis for rate limiting and caching.** Relational queries, no
command budget, and cheaper at scale. Rejected because the data is small,
short-lived and read far more than written, and the relational parts that
mattered — joins for counts, cascades on delete, a daily purge — are exactly what
key expiry and denormalised hashes replace.

**Keeping better-auth over Redis.** It needs a primary database for users,
accounts and verifications, a model built for sign-ups that this app no longer
has. Rejected in favour of a session token the app issues itself.
