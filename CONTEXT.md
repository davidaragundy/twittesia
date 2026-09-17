# Twittesia

Twittesia is an open-source social media platform, similar to Twitter, where
every piece of content — posts and comments — exists for 24 hours and is then
gone for good. So does the identity that wrote it: nobody signs up, and nobody
gives an email address, a password or a social login.

## Language

### People

**User**:
A person using Twittesia. Every user is anonymous: there is only one kind.
_Avoid_: member, guest, account

**Identity**:
The user Twittesia generates for someone when they start, and everything it
carries: their handle, display name and picture. It lasts 24 hours, like the
content it creates.
_Avoid_: account, session, login

**Handle**:
The generated name a user is known by, as `sneaky-waffle-x7k3qa`. It is unique,
nobody chooses it, and `/@handle` resolves to that user's profile.
_Avoid_: username, nickname

**Profile**:
A user's public identity — their handle, display name and picture — and
everything of theirs still alive: their posts, their comments, and what those
drew.
_Avoid_: page

### Content

**Content**:
Anything a user creates: posts and comments.
_Avoid_: data, media

**Post**:
Content a user publishes.
_Avoid_: tweet, story

**Reaction**:
An emoji a user adds to a post or a comment. A user may add several different
ones to the same one, and each shows how many users added it.
_Avoid_: like, emote

**View**:
One user other than the author having seen a post or a comment: at least half
of it visible for about a second. Each user counts at most once per post or
comment.
_Avoid_: impression, read

**Comment**:
A response to a post, shown on the post's page. It is deleted with its post, so
one written late in a post's lifespan lives only until the post's expiry.
_Avoid_: reply

**Feed**:
The posts a user sees.
_Avoid_: timeline, home

**Order**:
The arrangement a reader asks for, of the feed or of a post's comments: latest,
newest first, or most popular. It is theirs alone, and lasts as long as they are
on the page.
_Avoid_: sort, filter, ranking

**Popularity**:
What a piece of content drew from other users: for a post, its reactions and its
comments together; for a comment, its reactions. Views are not part of it.
_Avoid_: score, engagement, trending

### Time

**Lifespan**:
The 24 hours a piece of content, or an identity, exists after it is created.
_Avoid_: TTL, duration

**Expiry**:
The moment a piece of content, or an identity, reaches the end of its lifespan
and is deleted for good.
_Avoid_: expiration, archive
