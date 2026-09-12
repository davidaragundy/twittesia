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
The generated name a user is known by, as `swift-otter-x7k3qa`. It is unique,
nobody chooses it, and `/@handle` resolves to that user's profile.
_Avoid_: username, nickname

**Profile**:
A user's public identity: their handle, display name and picture.
_Avoid_: page

### Content

**Content**:
Anything a user creates: posts and comments.
_Avoid_: data, media

**Post**:
Content a user publishes.
_Avoid_: tweet, story

**Ghost**:
A post published anonymously: it is stored without any link to the user who wrote it, so it
shows no profile and cannot be traced back to one.
_Avoid_: anonymous post, secret

**Comment**:
A response to a post.
_Avoid_: reply

**Feed**:
The posts a user sees.
_Avoid_: timeline, home

### Time

**Lifespan**:
The 24 hours a piece of content, or an identity, exists after it is created.
_Avoid_: TTL, duration

**Expiry**:
The moment a piece of content, or an identity, reaches the end of its lifespan
and is deleted for good.
_Avoid_: expiration, archive
