# Code standards

How code is written in this repository. Rules are numbered so a review comment
can point at one instead of arguing from taste.

Each rule says who enforces it. **Tooling** means something fails without a human
noticing; everything else is enforced by whoever approves the pull request. Most
of these are prose on purpose: a rule that needs judgement cannot be expressed as
a lint rule without producing false positives, and a lint rule with false
positives gets disabled rather than followed.

For what the words of the domain mean, see [CONTEXT.md](../CONTEXT.md).

## Layers

**CS-1.** Code lives in three layers: `app/` composes, `features/` holds domain,
`shared/` holds what carries no domain. Dependencies run `app/ → features/ →
shared/`. Nothing imports from `app/`, and `shared/` imports from neither of the
others. _Review._

**CS-2.** `app/` only composes: routes, layouts, metadata, and the assembly of
components from features. No state, no data fetching, no business rules.
Next's own files — `error`, `loading`, `not-found` — may hold their own JSX;
extract it into a component once it is duplicated, not before. _Review._

**CS-3.** A feature is a module of the **domain**, not a slice of a route. It may
own many pages or none. The route dimension is already covered by `app/`.
_Review._

**CS-4.** Features may import other features. This reverses the usual
convention, so read
[ADR-0001](./adr/0001-features-may-import-features.md) before
changing it — in particular, do not "fix" it by moving a domain concept into
`shared/`, which hides the dependency rather than removing it. _Review._

**CS-5.** `shared/` carries no domain. If a thing knows what an `Order` is, it
belongs to a feature. _Review._

**CS-6.** Something moves into `shared/` when a second consumer genuinely needs
it, never speculatively. Duplicating once is cheaper than the wrong abstraction
in the middle of the graph, because once it is in `shared/` you no longer know
who depends on it. _Review._

## Structure

**CS-7.** Feature names come from this list. It is a vocabulary, not a skeleton:
a folder is created when its first file is, never upfront.

{{FEATURES}}

Adding a name is a decision worth making deliberately, because it asserts that a
new area of the domain exists. _Review._

**CS-8.** Inside a feature or inside `shared/`, files sit under one of these
kinds:

`components`, `hooks`, `schemas`, `types`, `constants`, `queries`, `actions`,
`utils`, `styles`

The list may grow, but only for a concept that does not already have a word —
one word per concept. `lib/`, `services/` and `helpers/` are therefore excluded:
they are `utils/` under another name, and they become the folder where things go
when nobody knows where they go. _Review._

**CS-9.** Kind folders are flat. A feature large enough to want subdivision puts
it in the file name — `order-checkout-form.tsx`, not `order/checkout/form.tsx`.
_Review._

## Server code

**CS-10.** `queries/` reads. Every file in it imports `server-only`, so that
importing one from a client component fails at build time rather than leaking
data access to the browser. _Review._

**CS-11.** `actions/` writes. Every file in it is a server action, marked
`"use server"`. _Review._

**CS-12.** An action may call a query. A query may never write. A query that
mutates breaks the caching this project has enabled, and the breakage does not
look like a cache bug when you find it. _Review._

## Imports

**CS-13.** No barrel files. Import the direct path — `@/shared/components/header`,
not `@/shared/components`. Barrels defeat tree-shaking, and more importantly they
let one module mix client and server code, which drags the client bundle into
places it does not belong. _Review._

**CS-14.** No relative imports. Everything goes through the `@/` alias,
stylesheets included. Paths then survive a file being moved, and the layer a
module belongs to is legible from the import itself. _Review._

**CS-15.** Import order runs: side-effect imports, node builtins, externals, `@/shared`,
`@/features`, anything else under `@/`, stylesheets. Stylesheets sort last even
though they are side-effect imports, because the more specific group wins.
**Tooling** — it autofixes, so you will never see it fail.

## Files and names

**CS-16.** One exported concept per file: a function, a component, or a schema.
Private helpers inside the file are fine, and preferable to exporting something
only so it can live elsewhere. _Review._

**CS-17.** A component that has real logic — state, effects, data fetching,
non-trivial computation — moves that logic into a hook named after it:
`<OrderForm>` and `useOrderForm`. A component without logic does not get a
hook that returns its props unchanged. _Review._

**CS-18.** Files and folders under `features/` and `shared/` are kebab-case.
`app/` is exempt: Next dictates those names, and its dynamic segments and route
groups are not kebab-case. _Review._

**CS-19.** Components and types are `PascalCase`. Functions and variables are
`camelCase`. Module-level exported constants holding a literal are
`UPPER_SNAKE_CASE` — this last one applies to `MAX_ORDER_ITEMS`, not to every
`const`. _Review._

## What the tooling actually does

| Check                                      | Runs where                               |
| ------------------------------------------ | ---------------------------------------- |
| Formatting                                 | `pre-commit`, on staged files            |
| Import order                               | `pre-commit`, on staged files, autofixed |
| Framework lint rules                       | `pre-commit` and CI                      |
| Types                                      | CI                                       |
| Commit message format                      | `commit-msg`                             |
| Branch name, and refusing pushes to `main` | `pre-push`                               |

Everything else on this page is enforced by review. That is a decision, not a
gap: it keeps the repository free of configuration that would need maintaining
for rules a reviewer can see at a glance.
