# Twittesia

Twittesia is an open-source social media platform, similar to Twitter, where
every piece of content — posts, comments and messages — exists for 24 hours and
is then gone for good.

## Language

### People

**User**:
A person using Twittesia, whether or not they have linked an account.
_Avoid_: member

**Guest**:
A user who has not linked any account yet, so has given no email address,
password or social login.
_Avoid_: anonymous user, visitor

**Account**:
One way a user signs in, such as a password or a Google login. A user may have
several.
_Avoid_: login, provider

**Profile**:
A user's public identity: their username, name and avatar.
_Avoid_: page

**Follow**:
A one-way connection through which a user sees another user's posts.
_Avoid_: subscription, friendship

**Follower**:
A user who follows another user.
_Avoid_: subscriber, fan

**Close friend**:
A user someone has added to their close-friends list, so that they see the posts
shared only with that list.
_Avoid_: inner circle, favourite

### Content

**Content**:
Anything a user creates: posts, comments and messages.
_Avoid_: data, media

**Post**:
Content a user publishes to their followers or to their close friends.
_Avoid_: tweet, story

**Ghost**:
A post published anonymously, showing no profile.
_Avoid_: anonymous post, secret

**Comment**:
A response to a post.
_Avoid_: reply

**Feed**:
The posts from the users someone follows.
_Avoid_: timeline, home

**Chat**:
A private conversation between users, holding their messages.
_Avoid_: conversation, DM, thread

**Message**:
One entry in a chat.
_Avoid_: DM

### Time

**Lifespan**:
The 24 hours a piece of content exists after it is created.
_Avoid_: TTL, duration

**Expiry**:
The moment a piece of content reaches the end of its lifespan and is deleted for
good.
_Avoid_: expiration, archive
