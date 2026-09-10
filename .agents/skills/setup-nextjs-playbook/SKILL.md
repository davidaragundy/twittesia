---
name: setup-nextjs-playbook
description: Sets up a Next.js App Router repository to follow the Next.js playbook — an opinionated feature-based structure and code standards, plus the repository's commit, branch and pull request rules — with the git hooks, CI and documentation that hold them in place. Run once, when starting a Next.js project, or when asked to establish its architecture, conventions, commit and branch rules, hooks or contributing docs.
license: MIT
compatibility: Built for GitHub repositories using pnpm, git and the gh CLI. The architecture and tooling assets target Next.js with the App Router. Runs after setup-matt-pocock-skills from mattpocock/skills.
metadata:
  author: davidaragundy
  version: "2.0.0"
---

# Set up the Next.js playbook

The Next.js playbook is opinionated about how a Next.js repository is
structured and the standards its code is written to; the workflow is Matt
Pocock's engineering skills, left as they are. This skill sets the playbook up,
once. It turns a fresh repository into one with a feature-based structure, code
standards, written contribution rules, git hooks, CI, and documents that
describe it exactly. The rules themselves live in `assets/` as working files;
this page is the order to apply them in and the bar each step must clear.

Three ideas run through every step:

- **Automate what is boring.** Formatting, import order, commit messages and
  branch names are checked by tooling, because nobody should spend review
  attention on them. Everything that needs judgement — architecture, naming,
  abstraction — is a written rule, enforced at review.
- **Verify from a fresh clone.** A warm working tree hides missing generated
  files. Before calling any step done, run it as CI would:
  `rm -rf .next next-env.d.ts`, then the commands.
- **The official docs are current; this skill may not be.** The assets carry
  the conventions. The config formats, option names, install commands and
  versions used to reach them come from each tool's official documentation,
  read now, for the version actually installed. Where the two disagree, keep the
  convention and follow the docs.

Read [references/gotchas.md](references/gotchas.md) before you start. Every
entry in it is a trap that looked like success the first time. Read
[references/sources.md](references/sources.md) too: it names the official source
to check for each asset, and what to look for there.

## Prerequisite: setup-matt-pocock-skills

This skill runs after `setup-matt-pocock-skills` from
[mattpocock/skills](https://github.com/mattpocock/skills). That skill records
where issues live, the triage label vocabulary and the domain doc layout, and
the engineering skills read them from there. This one builds on the same
records rather than deciding them again.

Before step 1, check that the setup has run:

- `docs/agents/issue-tracker.md` and `docs/agents/domain.md` exist.
- `CLAUDE.md` or `AGENTS.md` holds an `## Agent skills` block pointing at them.

If any is missing, stop. The setup skill cannot be invoked by a model, so give
the user the command to install it, ask them to run `/setup-matt-pocock-skills`
themselves, and wait:

```bash
npx skills add https://github.com/mattpocock/skills --skill setup-matt-pocock-skills
```

Go on without it only when the user explicitly says to. Then skip every use of
`docs/agents/` below, and leave `docs/agents/` out of the README.

Once it has run, read what it recorded, and stop to tell the user when it
conflicts with this skill:

- **Issue tracker.** This baseline — issue forms, `Closes #<issue>`, CODEOWNERS,
  CI — assumes GitHub Issues. Any other tracker is a conflict.
- **Domain docs.** This baseline writes one `CONTEXT.md` and one `docs/adr/` at
  the root, and one `app/`, `features/`, `shared/` tree under `src/`. A
  multi-context layout is a conflict.
- **Triage labels.** When `docs/agents/triage-labels.md` exists, use its label
  for the `needs-triage` role wherever the assets say `needs-triage`.

**Done when** the setup's files exist and neither conflict applies, or the user
has said to go on without them.

## Placeholders

The assets use these. Fill every one before writing a file.

| Placeholder             | Value                                                          |
| ----------------------- | -------------------------------------------------------------- |
| `{{OWNER}}`             | GitHub owner, from `git remote -v`                             |
| `{{REPO}}`              | Repository name, from `git remote -v`                          |
| `{{PREFIX}}`            | Short branch prefix tying a branch to an issue: `fgt` → `feat/fgt-12` |
| `{{PRODUCT}}`           | Product name                                                   |
| `{{PRODUCT_PARAGRAPH}}` | What the product is, in the glossary's terms                   |
| `{{FEATURES}}`          | The confirmed feature list, as inline code, comma-separated    |
| `{{PRODUCT_SUMMARY}}`   | One or two sentences on what the product is, for `CONTEXT.md`  |
| `{{TERM}}`, `{{TERM_DEFINITION}}`, `{{AVOIDED_SYNONYMS}}` | One block per glossary term in `CONTEXT.md` |

Placeholders are always `{{UPPER_SNAKE_CASE}}`. `${{ github.ref }}` in the CI
workflow is GitHub Actions syntax, not a placeholder — leave it as it is.

## Checking an asset against the docs

Before writing any asset into the repository, check it against the official
source [references/sources.md](references/sources.md) names for it:

- Install every package without a version, so it resolves to the latest stable
  release, unless a compatibility check says otherwise. Never copy a version
  out of an asset or a reference.
- For each GitHub Action, use the latest major:
  `gh release view --repo <owner>/<action> --json tagName`.
- For each config, confirm its format, file name and every option it sets
  against the docs for the installed version. After a major upgrade since the
  asset was written, read the tool's migration guide first.
- Treat the examples in the assets the same way: an example that shows an API
  the docs no longer recommend is rewritten to the current one.

Every difference you act on goes to the user in chat and into the pull request
as asset → what changed → why.

## 1. Gather the inputs

Derive what the environment already says: owner and repo from `git remote -v`,
the pnpm version from `packageManager`, the Node version from `node -v`, the
Next.js version from `package.json`. Compare each against its latest release,
and tell the user about any that is behind before building on it.

Ask the user, in one message, for what it cannot say: the branch prefix, and a
paragraph on what the product is and who it is for. Then derive the glossary and
the feature list as described in [references/domain.md](references/domain.md),
and confirm both with the user before writing either.

**Done when** every placeholder has a value the user has seen.

## 2. Track the work

Open one issue for setting up the playbook with the feature request form's sections —
Problem, Proposed change, Acceptance criteria, Alternatives considered — and a
plain-English title prefixed `[Request]:`. Cut `chore/{{PREFIX}}-<issue>` from
`main` and do all of the following on it.

An empty repository has no `main` to branch from: seed it with a single initial
commit holding the README, then branch. If the setup's output is still
uncommitted, it goes onto this branch as its own commit.

**Done when** the issue exists and you are on its branch.

## 3. Make the pipeline run

- `.node-version` holds the exact output of `node -v`, without the `v`.
- Merge [assets/package.fragment.json](assets/package.fragment.json) into
  `package.json`.
- Add [assets/github/CODEOWNERS](assets/github/CODEOWNERS) and
  [assets/github/workflows/ci.yml](assets/github/workflows/ci.yml) under
  `.github/`.

**Done when** each asset above has been checked against its official source,
and `pnpm lint`, `pnpm typecheck` and `pnpm build` each exit 0 from a fresh
clone.

## 4. Automate what is boring

- Install `prettier` with `--save-exact`, so a formatter release never
  reformats the codebase unannounced, and `eslint-config-prettier`,
  `eslint-plugin-simple-import-sort`, `husky`, `lint-staged`, `@commitlint/cli`
  and `@commitlint/config-conventional`.
- Replace `eslint.config.mjs` with
  [assets/eslint.config.mjs](assets/eslint.config.mjs), and add
  [assets/commitlint.config.mjs](assets/commitlint.config.mjs) and
  [assets/prettierignore](assets/prettierignore) as `.prettierignore`.
- If the project uses Tailwind CSS, install `prettier-plugin-tailwindcss` and
  add [assets/prettierrc.json](assets/prettierrc.json) as `.prettierrc`. Its
  `tailwindStylesheet` points at `src/shared/styles/globals.css`, relative to
  `.prettierrc`; drop the key on Tailwind v3, which reads `tailwind.config.js`
  instead. Without Tailwind, add neither: Prettier's defaults are the
  configuration.
- Run `pnpm exec husky init`, then copy the three files in
  [assets/husky/](assets/husky/) into `.husky/` and make each executable.
- Move `src/app/globals.css` to `src/shared/styles/globals.css`: `app/` only
  composes, and nothing imports from it.
- Rewrite every relative import in `src/` through the `@/` alias, stylesheets
  included — the root layout imports `@/shared/styles/globals.css`.

**Done when** each asset above has been checked against its official source,
each probe behaves as stated, and the probe files are gone:

- Committing a file with unsorted, unformatted imports lands it sorted and
  formatted.
- `feature: x` and `feat(camelCase): x` are rejected by `commit-msg`;
  `feat(some-scope): a valid message` is accepted.
- `pre-push` rejects `main`, a nonsense branch name and an unknown type, and
  accepts `fix/{{PREFIX}}-1`.

## 5. Write the documents

Write them last, so each describes the repository as it now is. In this order,
because each leans on the one before:

1. `CONTEXT.md` from [assets/CONTEXT.md](assets/CONTEXT.md), holding the
   confirmed glossary.
2. `docs/adr/0001-features-may-import-features.md` from
   [assets/docs/adr/](assets/docs/adr/0001-features-may-import-features.md).
3. `docs/code-standards.md` from
   [assets/docs/code-standards.md](assets/docs/code-standards.md).
4. `CONTRIBUTING.md` from [assets/CONTRIBUTING.md](assets/CONTRIBUTING.md).
5. `README.md` from [assets/README.md](assets/README.md).
6. The issue forms and pull request template under
   [assets/github/](assets/github/), into `.github/`, with the triage label
   from `docs/agents/triage-labels.md` when it exists.

`CONTEXT.md` and the ADR follow the formats the `domain-modeling` skill in
mattpocock/skills uses, so the engineering skills can extend them later. Keep
them in those formats.

Rewrite every example in the assets — `Order`, `order-checkout-form.tsx`,
`MAX_ORDER_ITEMS` — into the project's own glossary terms. Check every framework
mechanism a document names — `server-only`, `"use server"`, Next's special
files, caching — against the current Next.js docs, and correct the document
where the framework has moved.

Each document answers one question: the README what this is and how to start
it, `CONTRIBUTING.md` how to contribute, `docs/code-standards.md` how code is
written, `CONTEXT.md` what the words mean. Keep each to its own question.

**Done when** every command, script, hook and file a document names exists, and
`grep -rE '\{\{[A-Z_]+\}\}'` over the repository returns nothing, nor does a
grep for foreign repository names or for domain words missing from the glossary.

## 6. Ship

Commit one concern at a time in Conventional Commits form. Push, and open a pull
request whose title is itself a valid commit message — it becomes the squash
commit on `main`. Fill every section of the template, and put `Closes #<issue>`
in the description, since that is what closes the issue on a squash merge.

**Done when** CI is green on the pull request.

## 7. After the merge

Compare `gh pr view <n> --json headRefOid` against your branch tip. If they
differ, the merge captured an older head and your last commits never reached
`main`; they need their own issue, branch and pull request. Then delete the
merged branch.

**Done when** the merged head matches your tip and the branch is gone.

The work after the setup follows Matt Pocock's engineering skills —
`grill-with-docs`, `to-spec`, `to-tickets`, `implement` — as he designed them.
The playbook's part in it is the documents this skill wrote, which those skills
read, and the `nextjs-playbook-rules` skill, which they consult while writing
code. Recommend it to the user if it is not installed.

## Guardrails

Each is a hard rule. Where a rule names what to leave out, it names what to do
instead.

- **Commits and pull requests carry the author's name only.** No
  `Co-Authored-By` trailer and no "Generated with" footer, ever, whatever a
  default template suggests.
- **A document states each rule as what must be true.** It never qualifies a
  rule with whether, when or how it is enforced. Facts about enforcement go to
  the user in chat.
- **A document describes only what exists** after your change. A script, hook,
  deployment or database that is not there does not appear.
- **Architecture and naming stay prose.** Add no lint plugin for boundaries,
  file names or identifier case; `docs/code-standards.md` holds them and review
  enforces them.
- **Current official documentation wins over this skill.** An asset, example or
  gotcha that contradicts the docs for the installed version is out of date:
  keep its intent, follow the docs, and report the difference. When the docs
  cannot be reached, say so rather than assuming the asset is still right.
- **The setup's records belong to the setup.** `docs/agents/` and the
  `## Agent skills` block in `CLAUDE.md` or `AGENTS.md` stay as
  `setup-matt-pocock-skills` wrote them. Where one needs to change, the user
  re-runs that skill or edits the file; this skill reads them and reports
  conflicts.
- **A dependency arrives the day something uses it.**
- **A config keeps only what it adds** over the preset it extends.
- **Every change travels issue → branch → pull request**, your own follow-up
  fixes included. The issue scopes the branch, not the commit, so changes made
  in response to review go on the branch already under review.
- **Your own work is verified, not assumed.** Run the probe, read the output,
  check `main` after a merge.
