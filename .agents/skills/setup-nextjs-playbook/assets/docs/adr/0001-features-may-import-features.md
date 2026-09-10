# Features may import other features

**Status:** accepted

Code lives in three layers — `app/` composes, `features/` holds domain, and
`shared/` holds what carries no domain. A feature is a module of the domain, not
a slice of a route: it may own many pages or none.

**Features may import other features, and those dependencies are not declared
anywhere.** This is the decision worth recording, because the common convention
is the opposite and a reader who assumes isolation will try to restore it.

## Considered options

**Strict isolation between features**, with anything two features need promoted
to `shared/`. Rejected for two reasons. First, it decides feature granularity
for technical rather than domain reasons: two areas that genuinely differ would
have to be fused into one oversized feature purely because keeping them apart
would require an import the rule forbids. Second, and worse, it does not remove
the dependency it appears to remove — moving `Product` into `shared/` because
`orders` needs it leaves the same dependency in place, now without a name, and
drains the domain out of `features/` and into a layer that is supposed to hold
none.

**A large `shared/` carrying domain**, holding whatever more than one feature
touches. Rejected because it ends up holding a large part of the domain
organised by kind rather than by concept, so the pieces of one concept sit
scattered across `shared/schemas/`, `shared/queries/` and `shared/components/`
with nothing marking them as one thing.

**A `shared/` organised by domain** (`shared/orders/`, `shared/catalog/`).
Rejected as `features/` rebuilt one directory lower, with the sole difference
that everything inside may import everything else — the very thing isolation was
meant to prevent.

**An intermediate layer** holding the genuinely cross-cutting concerns, such as
`auth` and `payments`, importable by anyone. Rejected once feature-to-feature
imports were allowed: the layer exists only to carve out an exception to a rule
that no longer exists.

**A declared list of allowed edges** in the lint configuration. Rejected for now
as weight the repository does not yet need.

## Consequences

Nothing mechanically detects a dependency cycle between two features. File-level
cycle detection does not see one when the two imports live in different files,
and no lint rule expresses feature-level acyclicity without the declared edge
list that was rejected above. A cycle is caught by review or not at all.

What keeps cycles rare in practice is that `app/` is the composition root. The
usual candidate — a product page showing an "add to order" call to action —
never becomes an import, because the route assembles a component from `catalog`
and a component from `orders` without either feature knowing about the other.
What remains are data and type dependencies, which run in one direction
naturally.

`shared/` stays free of domain. Anything carrying domain belongs to a feature,
and promotion to `shared/` happens when a second consumer genuinely needs it,
never speculatively.

If the dependency graph becomes hard to reason about — the signal being that
nobody can answer "what does this feature depend on?" — the declared edge list
is the reversal path. It is a change to lint configuration, not a move of any
folder.
