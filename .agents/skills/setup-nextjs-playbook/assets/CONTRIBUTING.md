# Contributing

Everything must be in English — code, commits, PR titles, branch names, issue titles, and descriptions.

For local setup, see [README.md](./README.md#local-development-setup). For how code is
written here, see [docs/code-standards.md](./docs/code-standards.md).

## Types

Every branch name, commit message, and PR title starts with a type from the [Conventional Commits](https://www.conventionalcommits.org/) set:

| Type       | Use it for                                                                     |
| ---------- | ------------------------------------------------------------------------------ |
| `feat`     | New user-facing behaviour                                                      |
| `fix`      | A bug fix, urgent or not                                                       |
| `refactor` | Restructuring that does not change behaviour                                   |
| `perf`     | A change made specifically to improve performance                              |
| `docs`     | Documentation only                                                             |
| `style`    | Formatting only, no logic change                                               |
| `test`     | Adding or correcting tests                                                     |
| `build`    | Build system, dependencies, deployment, and environment configuration          |
| `ci`       | CI pipeline and GitHub Actions configuration only                              |
| `chore`    | Maintenance that fits nothing above, including tooling and agent configuration |
| `revert`   | Reverting a previous commit                                                    |

The commit linter accepts these and nothing else.

## Scopes

A scope is optional but strongly preferred, and must be lower-case kebab-case.

By convention the scope is the name of the feature a change touches:
{{FEATURES}}. Use `repo`, `ci` or `agents` for work that touches no feature.

The linter checks that a scope is kebab-case; it does not check it against that
list. Adding a feature should not mean editing a linter config in the same pull
request.

## Branch naming

All branches must follow this pattern:

```
type/{{PREFIX}}-<issue-number>
```

The `{{PREFIX}}-` prefix is always required, and the type must come from the table above.

Examples:

- `fix/{{PREFIX}}-115`
- `feat/{{PREFIX}}-103`
- `docs/{{PREFIX}}-121`

This is enforced by the `pre-push` hook, which also refuses direct pushes to `main`.

### What the issue covers

The issue in a branch name scopes the **branch**, not the commit. Every commit on that branch is covered by it, so no individual commit needs an issue of its own.

Two things follow:

- **Changes made in response to review go on the branch already under review.** They do not get their own issue and they do not get their own PR. A second branch for them would cross the same lines as the first and conflict on merge.
- **Small incidental fixes may ride along** — a typo, a lint warning you noticed, something you broke two commits ago. The limit is whether the branch still honestly matches its issue, judged at review rather than by rule. If you can no longer describe the branch in one sentence, the extra work needed its own issue.

## Commit convention

```
type(scope): short description in english
```

A commit may carry `fixes #<issue-number>` in its body, but that is not what closes the issue — see [PR flow](#pr-flow). Put the closing keyword in the PR description.

```
fix(registration): clear validation error state on input change

fixes #115
```

This is enforced by the `commit-msg` hook, which runs `commitlint` against `commitlint.config.mjs`.

## Opening issues

Use one of the issue forms — blank issues are disabled. The form marks **Acceptance criteria** as required, so every issue states what "done" looks like.

**Issue titles are plain descriptive English, not Conventional Commits.** An issue describes a _problem_; a commit describes a _change_. The type is a property of the eventual fix, which nobody knows at filing time — the same bug might land as a `fix`, a `refactor`, or a `perf`. Type belongs in **labels**, which are filterable; a title prefix is not.

The forms prefill a `[Bug]:` or `[Request]:` marker, which also keeps issues visually distinct from PRs in the shared number space.

```
Good:  [Bug]: analytics reports data from non-production environments
Bad:   fix(analytics): analytics reports data from non-production environments
```

## PR flow

1. Create a branch from `main` following the naming convention above
2. Work and commit following the commit convention above
3. Push the branch and open a PR, filling in the PR template
4. Review happens in one of two ways, depending on who opened the PR
5. Respond to review on the same branch — see [What the issue covers](#what-the-issue-covers)

Because PRs are squash-merged, the closing keyword that matters is the one in the PR description: GitHub builds the squash commit message from the PR title and body. A `fixes` line in an individual commit is not what you should rely on.

**The PR title becomes the commit message on `main`,** because `main` keeps a linear history and squash is the only merge method this repository allows. A sloppy PR title becomes a sloppy commit in history. The `commit-msg` hook cannot catch this — the squash commit is created by GitHub, not locally — so the title is your responsibility.

### Review

`.github/CODEOWNERS` requests review from `{{OWNER}}` automatically.

- **If someone other than `{{OWNER}}` opened the PR**, wait for `{{OWNER}}`'s approval. Only `{{OWNER}}` may merge without one.
- **If `{{OWNER}}` opened the PR**, GitHub does not request review from the author and self-approval is rejected, so no approving review is possible. `{{OWNER}}` merges it themselves. Nothing reviews these PRs — keep them small and describe them well, because that description is the only review they get.

### Branch protection on `main`

A merge that does not satisfy all of this is not acceptable:

- Pull request required, linear history required, no force pushes, no deletion

## CI/CD

**GitHub Actions** (`.github/workflows/ci.yml`) runs `pnpm lint` and `pnpm typecheck` on every pull request. Both must pass before review.

The production build is not run in CI. Nothing else builds it either, so a change
that breaks `pnpm build` is caught only by whoever runs it — run it yourself when
you touch configuration or anything that renders at the root.

## Local enforcement

Hooks run through husky:

| Hook         | What it does                                                 |
| ------------ | ------------------------------------------------------------ |
| `pre-commit` | Runs `lint-staged` — eslint and prettier on staged files     |
| `commit-msg` | Runs `commitlint` on the commit message                      |
| `pre-push`   | Validates the branch name and blocks direct pushes to `main` |

If a hook blocks something it should not, fix the name or message rather than passing `--no-verify`.

Run these before opening a PR. Use pnpm scripts — never `npx`, which can resolve a different version than the `packageManager` field pins.

| Command          | What it checks                   |
| ---------------- | -------------------------------- |
| `pnpm lint`      | eslint across the repository     |
| `pnpm typecheck` | route types, then `tsc --noEmit` |
| `pnpm build`     | the production build             |
