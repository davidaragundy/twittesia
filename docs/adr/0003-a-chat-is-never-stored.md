---
status: accepted
---

# A chat is never stored

Everything else here is kept for a day. A chat is not kept at all: **what two
people say to each other is carried between them and written nowhere**, and
Twittesia cannot read it even while it passes through.

## Why

A conversation between two people is worth less to them the moment a third
party holds it, and a store that holds it can be asked for it. The only version
of "private" that survives that is one where there is nothing to hand over: no
message in Redis, and no key anywhere on a server that could open one.

Everything a chat does keep is what it takes to let exactly two people in and to
end within a day: who they are, when it began, when it ends, and who is waiting
at the door.

## Consequences

- **Messages travel over pub/sub, not a stream.** `PUBLISH` reaches whoever is
  listening and is gone; nothing is written, so nothing expires either. A message
  sent while the other side is away is lost, and that is the behaviour, not a
  limitation to fix later. This is why chat does not use `@upstash/realtime`,
  which the rest of the app does: every event it emits is `XADD`ed into a Redis
  stream first.
- **The key lives in the link, not on a server.** An invite is
  `/join/{chat}#{secret}`, and browsers never send the part after `#`. Each side
  makes an ECDH pair when its page opens and puts the public half on the channel;
  the shared secret from that exchange and the invite's secret go through HKDF
  into one AES-GCM key. The server relays ciphertext it has no way to open —
  including against itself, since substituting a public key gets it nothing
  without the secret it never saw, and the safety number the two people compare
  would stop matching.
- **A page without the secret sends nothing.** The secret lives in the tab that
  opened the invite and nowhere else, so a tab that never had it cannot take part.
  It says so rather than falling back to anything weaker.
- **The invite is the whole of the security, and it is spent once.** A chat holds
  two people and no more: the first person let in closes it, and everyone else
  waiting is dropped. Who is let in is a decision its creator makes by handle,
  because a link can be forwarded and a handle is all anyone has to go on.
- **Everything about a chat is an event, not a key.** Whether someone is here,
  whether they are writing, and whether a message reached the other page all come
  from the connection: the acknowledgement is published by the connection that
  forwarded the message, and carries its id and nothing else. Reaching the other
  page is the most that can honestly be said, because a read receipt would need
  somewhere to record what was read.
- **A chat cannot be read back.** Nothing catches up a page that was closed, and
  nothing shows a conversation to someone who joins later, because there is
  nothing to show. A tab that loses the secret cannot ask for it again.
- **Either person can end a chat.** It goes for both of them at once and cannot
  be reopened; what was said was never written down, so the chat record is all
  there is to delete. A chat also ends at its expiry, and the two read the same.
- **What is kept is only what lets two people in.** `chat:{id}` holds the two
  identities, their handles and names, when it began and when it ends;
  `knocks:chat:{id}` holds a field per person waiting, and goes the moment someone
  is let in; `chats:{identity}` lists the chats one person is in. All of them
  expire within a day, and none of them mentions a message.
