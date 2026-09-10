---
name: nextjs-playbook-rules
description: The Next.js playbook's rules for structuring and writing code in a repository set up with setup-nextjs-playbook — where every file goes across app/, features and shared/, the server code rules for queries and actions, imports, naming, and which structural decisions belong to the user — read from the repository's own code standards and checked against the current Next.js documentation. Consult whenever code is written, placed or reviewed in such a repository, whichever skill or workflow is doing it.
license: MIT
compatibility: Repositories set up with setup-nextjs-playbook — Next.js with the App Router, TypeScript and pnpm.
metadata:
  author: davidaragundy
  version: "2.0.0"
---

# Next.js playbook rules

A reference, not a process. It says where code goes and how it is written, and
nothing about when: whatever is doing the work — Matt Pocock's `implement` and
`tdd`, a person at the keyboard — consults it while writing code, and keeps its
own workflow.

A playbook repository holds its rules in `docs/code-standards.md`, numbered
`CS-1` onwards, its domain's words in `CONTEXT.md`, and its decisions in
`docs/adr/`. This page is how to apply them.

- **The repository's copy is the rulebook.** Read the rules from the repository,
  never from memory or from this page, and cite them by number. Where the two
  disagree, the repository wins.
- **The current Next.js docs decide how.** Every Next.js API and convention is
  checked against the documentation for the version in `package.json`. See
  [references/sources.md](references/sources.md).

If `docs/code-standards.md` is missing, the repository was not set up with the
playbook; tell the user that `setup-nextjs-playbook` sets it up. Read
[references/gotchas.md](references/gotchas.md) for the traps.

## Read first

- `docs/code-standards.md`, in full.
- `CONTEXT.md`, and every ADR in `docs/adr/` touching the area —
  `0001-features-may-import-features.md` always.
- The code where the change lands: the routes under `src/app/`, the features
  under `src/features/`, and `src/shared/`. Follow the patterns already there.

## Where a file goes

Answer these in order, and stop at the first yes:

1. **Is it a route, or the assembly of one?** It goes in `src/app/`: routes,
   layouts, metadata, Next's special files, and components from features put
   together (CS-2). State, data fetching and business rules live in a feature
   and are called from here. A page that shows pieces of two features assembles
   both in the route; neither feature imports the other's UI for it (ADR-0001).
2. **Does it know a domain concept?** It goes in the feature that owns the
   concept (CS-3, CS-5), from the list in CS-7.
3. **Otherwise it carries no domain.** It stays in the feature that uses it
   until a second consumer genuinely needs it; then it moves to `src/shared/`
   (CS-6). Never earlier.

Then, inside its owner:

- **Kind folder** from the list in CS-8. `lib/`, `services/` and `helpers/` are
  never the answer.
- **Flat.** Subdivision goes in the file name, not in a nested folder (CS-9).
- **File name** in kebab-case (CS-18), with one exported concept per file
  (CS-16). Private helpers stay inside the file.
- **Folders** appear with their first file, never upfront (CS-7).

A feature may import another (CS-4). Before adding such an import, check the
other feature does not already import this one — `grep -rn "@/features/<this>"
src/features/<other>` — because nothing but review catches a cycle between
features (ADR-0001). When there is one, let the route compose the two instead.

## How code is written

- **Server first.** Components are Server Components unless they need state,
  effects, event handlers or browser APIs; `"use client"` goes on the smallest
  component that does.
- **Reads live in `queries/`.** Every file there imports `server-only` (CS-10).
- **Writes live in `actions/`.** Every file there starts with `"use server"`
  (CS-11) and exports async functions only. An action is a public endpoint: it
  validates its input with a schema from `schemas/`, checks authentication and
  authorization itself, and returns only what the UI needs. An action may call
  a query; a query never writes (CS-12).
- **Logic leaves the component.** State, effects, data fetching and non-trivial
  computation move into a hook named after the component; a component without
  logic gets no hook (CS-17).
- **Imports** go through `@/`, stylesheets included, to the direct path — no
  relative imports and no barrel files (CS-13, CS-14). Their order is the
  linter's autofix (CS-15).
- **Names** follow CS-19, in the glossary's terms. A concept the glossary lacks
  is not invented here: it is settled in `CONTEXT.md` first.
- **Next.js APIs** are used as the documentation for the installed version
  describes them, read before use rather than recalled.
- **Dependencies** arrive the day something uses them, at their latest stable
  version.

## Checking code against the rules

For each file: the rule that placed it, its imports, its names, and the server
rules above. Across the change:

- `grep -rnE "(from|import) ['\"]\.\.?/" src` returns nothing — it catches
  stylesheet imports too.
- No `index.ts` re-exports a folder.
- No two features import each other.

## Decisions that belong to the user

The rules settle most placement. These they leave open, and each is proposed to
the user with its reasoning, never taken silently:

- **A new feature**, when a domain concept has no owner in CS-7. Once agreed, it
  is added to CS-7 and to the scopes in `CONTRIBUTING.md`, the two places the
  list lives.
- **A new kind**, when no word in CS-8 names the concept.
- **A change to a rule.** Code bends to the rules; a rule that seems wrong goes
  to the user as a proposal, and `docs/code-standards.md` changes only with
  their agreement.
