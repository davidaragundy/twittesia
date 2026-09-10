# Gotchas

Traps hit while building this baseline for real. None of them can be found by
reading the repository; each one looked like it worked until it did not. Read
the section for the step you are on before you start it.

Each entry: **symptom** → cause → fix.

Each entry was true for the tool versions of its day. Apply a fix only once you
see its symptom, and if the tool's current documentation describes a different
fix, or says the problem is gone, follow the documentation. The same goes for
any version an entry names: look up the current one.

## Pipeline

**`tsc --noEmit` fails on a fresh clone with `Cannot find name 'LayoutProps'`.**
Next generates its route types into `.next/`, and `next-env.d.ts` is gitignored,
so neither exists in CI. A warm working tree hides this completely. → The
`typecheck` script is `next typegen && tsc --noEmit`.

**CI dies at `setup-node`, before lint ever runs.** The workflow reads
`node-version-file: .node-version` and the file was never created. → Write it
with the exact version from `node -v`. A bare major lets the runner drift from
your machine.

**`pnpm lint` aborts with `typescript-eslint does not support TS 7.0`.**
typescript-eslint refuses to load under a TypeScript major it does not yet
support, and the guard sits in `@typescript-eslint/parser` as well as the meta
package. Dropping `eslint-config-next/typescript`, using the Next plugin with a
bare parser, and pinning an older TypeScript only for typescript-eslint through
pnpm overrides all fail. → Pin `typescript` to the newest major typescript-eslint
supports, and tell the user why in the pull request. Check support before any
TypeScript major upgrade.

**Everything passes locally and fails in CI.** `.next/` and `next-env.d.ts` from
earlier runs mask missing generated files. → Verify from a **fresh clone**:
`rm -rf .next next-env.d.ts`, then lint, typecheck and build.

**Review is never requested from anyone.** `CODEOWNERS` written as a markdown
list item (`- @owner`) is not a rule. → It needs a path pattern: `* @owner`.

**CI does not run after pushing the branch.** The workflow triggers on pull
requests to `main` and pushes to `main` only. → The first remote run is when the
pull request opens. Watch it there.

## Hooks and lint

**Config files skip the pre-commit hook.** A lint-staged glob of
`*.{ts,tsx,mts}` misses `eslint.config.mjs`, `commitlint.config.mjs` and every
other `js`/`mjs`/`cjs` file. → The glob is `*.{js,jsx,mjs,cjs,ts,tsx,mts}`.

**The autofix rewrites a file that separates `node:` imports from packages.**
Builtins and externals were in one group. → `^node:` gets its own group, before
`^@?\w`.

**Stylesheets look like they sort into the `@/` group.** They do not. A
side-effect import is prefixed with `\u0000`, and the group with the longest
match wins, so `^.+\.s?css$` beats `^@/` and stylesheets sort last. → Leave the
group order alone; verify with `eslint --fix` on a probe file rather than
reasoning about the regexes.

**A hook does not run.** `husky init` writes `pre-commit`; overwriting it can
drop the executable bit. → `chmod +x` every hook, and check
`git ls-files -s .husky` shows `100755` for all of them.

**Testing `pre-push` against `main` removes the hook under test.** Stashing
untracked files to switch branches stashes the hook too. → Put a stub `git` on
`PATH` that prints the branch for `rev-parse` and defers everything else to the
real git, then run `sh .husky/pre-push`. Probe `main`, a nonsense name, a bad
type and a valid name.

**commitlint warns `footer-leading-blank` on a valid message.** A body line
starting with `word:` is parsed as a footer token. → Reword so no body line
starts with a word followed by a colon.

**commitlint's `type-enum` looks necessary.** `@commitlint/config-conventional`
already enforces exactly the eleven types the contributing guide lists; a copy
is one more place the list drifts. → Keep only `scope-case`.

## Git

**Re-splitting commits sweeps every change back into the first one.**
`git reset --soft` keeps the index. → Use `git reset --mixed`, then stage each
commit with explicit paths.

**`git add a b` stages nothing.** If one path was already removed with `git rm`,
the whole command aborts. → Stage deletions with `git add -A -- <path>`.

**Commits you pushed are missing from `main` after the merge.** A pull request
merged while you were still pushing captures the older head; the tail stays
stranded on the branch, and the next branch you cut from `main` carries the
stale state forward without any error. → After every merge, compare
`gh pr view <n> --json headRefOid` against your branch tip, and check the files
on `main`. If they differ, the stranded work needs its own issue, branch and pull
request.

**A message rewrite changed code.** → After `git filter-branch` or any history
rewrite, `git diff <old-tip> <new-tip>` must be empty before you force-push, and
force-push only with `--force-with-lease`.

## Documents

**A template carries another project's identity.** Copied issue forms and
configs keep links to unrelated repositories and placeholder text from another
product. → Grep every document and template for foreign repository names,
leftover `{{UPPER_SNAKE_CASE}}` placeholders and domain words that are not in the glossary.

**GitHub refuses to configure branch protection or rulesets (HTTP 403).**
Private repositories on a free plan do not offer them. → That is information for
the user, delivered in chat. The documents state the rules as rules regardless.
