# Sources

The assets were written against the tool versions current when this skill was
last updated. Tools move faster than skills do: a config format changes, an
option is renamed, an action gains a major, a preset starts doing what an asset
does by hand. This page lists where the current truth lives and what to check
there before writing each asset.

## What the assets are for

An asset carries **intent**: the conventions, the rules and the shape of the
result. The tool's official documentation carries **mechanics**: the config
format, the option names, the install command, the versions. When the two
disagree, keep the asset's intent and use the documentation's mechanics.

Examples of a disagreement, and what to do:

- The docs show a new config file format or name → write the new one, carrying
  over every rule the asset sets.
- An option in the asset is deprecated or renamed → use its replacement.
- The tool now does by default what the asset configures → drop the setting
  (a config keeps only what it adds).
- The docs recommend a different tool for the same job → keep the asset's tool,
  and tell the user about the recommendation. Swapping tools changes the
  baseline, and that is the user's call.

## How to look

Use the best source the agent has, in this order:

1. The official documentation page, fetched now — through web fetch, a
   documentation MCP server, or whatever the agent has.
2. The package or repository itself: `npm view <package> version`,
   `npm view <package> peerDependencies`, the README and changelog on the
   registry, `gh release view --repo <owner>/<action> --json tagName`.
3. Documentation shipped inside the installed package in `node_modules/`.

Read the documentation for the **version actually installed**, not for a
version you remember. Where the docs are versioned, pick the matching one. Where
a major upgrade happened since the asset was written, read its upgrade or
migration guide before anything else.

If nothing can be fetched, say so to the user before writing the asset, and
list the assets that went unchecked in the pull request's Risk and rollout
section.

## Per asset

| Asset | Official source | Check |
| --- | --- | --- |
| `package.fragment.json` | [pnpm](https://pnpm.io/), [Next.js CLI](https://nextjs.org/docs/app/api-reference/cli/next) | That every script's command and flags still exist, in particular `next typegen` |
| `.node-version` | [Node.js releases](https://nodejs.org/en/about/previous-releases) | That the local Node is an active or maintenance LTS; if not, tell the user |
| `github/workflows/ci.yml` | [GitHub Actions](https://docs.github.com/actions), [actions/checkout](https://github.com/actions/checkout), [actions/setup-node](https://github.com/actions/setup-node), [pnpm/action-setup](https://github.com/pnpm/action-setup) | The latest major of each action, each action's inputs, and the runner image |
| `github/CODEOWNERS` | [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) | Syntax and location |
| `eslint.config.mjs` | [ESLint configuration files](https://eslint.org/docs/latest/use/configure/configuration-files), [Next.js ESLint](https://nextjs.org/docs/app/api-reference/config/eslint), [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier), [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort) | Import paths of each preset, how Next's config is extended, Next's default ignores |
| TypeScript version | [typescript-eslint dependency versions](https://typescript-eslint.io/users/dependency-versions) | `npm view typescript-eslint peerDependencies` against the TypeScript major Next installs |
| `commitlint.config.mjs` | [commitlint](https://commitlint.js.org/), [config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) | Config format, and the preset's `type-enum`, which the contributing guide and `pre-push` must list exactly |
| `prettierrc.json`, `prettierignore` | [Prettier configuration](https://prettier.io/docs/configuration), [Prettier ignore](https://prettier.io/docs/ignore), [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) | Plugin setup for the installed Tailwind major, and what Prettier already ignores |
| `husky/*` | [husky](https://typicode.github.io/husky/get-started.html) | The init command and the hook file format |
| `package.fragment.json` → `lint-staged` | [lint-staged](https://github.com/lint-staged/lint-staged) | Config keys and glob behaviour |
| `docs/code-standards.md` | [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure), [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data), [`use server`](https://nextjs.org/docs/app/api-reference/directives/use-server), [`server-only`](https://nextjs.org/docs/app/getting-started/server-and-client-components) | That every Next.js mechanism a rule names — `server-only`, `"use server"`, the special files, caching — still works as the rule says |
| `github/ISSUE_TEMPLATE/*` | [Syntax for issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) | Field types and keys |
| `github/PULL_REQUEST_TEMPLATE.md` | [Creating a pull request template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository) | File name and location |
| `CONTRIBUTING.md` | [Conventional Commits](https://www.conventionalcommits.org/) | The current specification version |

`docs/agents/` and the `## Agent skills` block are not assets: they come from
[`setup-matt-pocock-skills`](https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills),
which owns their format. Read the files it wrote in this repository, never its
templates or a remembered version of them. `CONTEXT.md` and the ADR follow the
formats in its sibling
[`domain-modeling`](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling)
skill; check them there.

`CONTEXT.md`, `README.md` and the ADR configure no tool, so they have no row.
What they name — scripts, commands, files — is checked by step 5's completion
criterion.

A link that no longer resolves is itself a sign the tool changed: search the
tool's site for the topic rather than skipping the check.

## Reporting back

Every difference you act on is news to two people. Tell the user in chat, as a
short list of asset → what changed → why, and put the same list in the pull
request. The user can then carry it back to this skill, so the next run starts
from current assets.
