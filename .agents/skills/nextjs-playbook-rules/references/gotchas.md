# Gotchas

Traps in writing code the playbook's way that none of the repository's
documents mention, because each one looked right until it did not.

Each entry: **symptom** → cause → fix.

Each entry was true for the Next.js and React versions of its day. Apply a fix
only once you see its symptom, and if the current documentation describes a
different fix, follow the documentation.

## Server code

**The build fails with `Only async functions are allowed to be exported in a
"use server" file`.** A constant, an object or a synchronous function was
exported from a file in `actions/`. → Move it to the kind that names it —
`constants/`, `schemas/` or `utils/` — which one exported concept per file
(CS-16) asks for anyway.

**A client component fails with `This module cannot be imported from a Client
Component module`.** It imported a file from `queries/`, whose `server-only`
import is doing its job. → Never remove `server-only`. Read the data in a
Server Component and pass it down as props, or call an action.

**`import 'server-only'` is flagged as a missing or extraneous dependency.**
Next.js resolves `server-only` itself, so installing it is optional, but a lint
rule or the type checker may still want it declared. → `pnpm add server-only`,
as the Next.js documentation suggests for this case.

**The page fails with `Functions cannot be passed directly to Client
Components`.** A Server Component passed a callback as a prop to a client
component. Only serializable values and server actions cross that boundary. →
Pass an action from `actions/`, or move the callback into the client component.

**An action leaks fields the UI never shows.** Whatever an action returns is
serialized and sent to the browser. → Return only what the caller needs, never a
whole record.

## Placement

**Two features import each other, and nothing complains.** Neither file-level
cycle detection nor any lint rule sees a cycle between features whose imports
live in different files. → Before adding a feature-to-feature import, grep the
other feature for imports of this one. When the two only meet on a page, let the
route assemble them instead.

**Something generic lands in `shared/` on first use.** It looks reusable, so it
feels like it belongs there. → It stays in the feature that uses it until a
second consumer genuinely needs it (CS-6).
