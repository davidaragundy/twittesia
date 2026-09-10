# Domain

How to turn the user's description of the product into the two things every
other document depends on: the glossary in `CONTEXT.md`, and the feature list
that names the folders under `features/`.

## The glossary

`CONTEXT.md` defines the words of the domain and nothing else — no file paths,
no implementation, no decisions. The format is in `assets/CONTEXT.md`.

From the user's paragraph, pull every noun the business actually uses. Then
hunt the two ways one word goes wrong:

- **One word, two concepts.** The thing that is sold and the concrete instance
  of it at a time and place are different things that the user may call by one
  name. So are a person who sells their time and a person who sells goods. Split
  them into two terms, each defined.
- **Two words, one concept.** Pick the stronger word and list the others under
  `_Avoid_`, so the codebase never grows both.

Definitions say what a term **is**, in one or two sentences.

## The feature list

A feature is a module of the **domain**, not a slice of a route — `app/` already
covers routes. Name each feature after a domain concept, in kebab-case, plural
where the concept is a collection.

Granularity follows the domain. Because features may import other features
(`assets/docs/adr/0001-features-may-import-features.md`), there is never a reason
to fuse two distinct areas into one feature to avoid an import, and never a
reason to push a domain concept into `shared/` because two features need it.
Cross-cutting concerns such as `auth` and `payments` are ordinary features.

A concept with its own data source or its own lifecycle usually earns its own
feature even when it hangs off another one.

The list is a **vocabulary**, not a skeleton. It names what may exist; no folder
is created until its first file is.

## Confirming

Propose the terms and the feature list together, in one message, with the
reasoning for each split. Write them only once the user confirms or corrects
them. A glossary the user did not agree to is a guess with authority.
