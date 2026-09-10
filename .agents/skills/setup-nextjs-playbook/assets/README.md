# {{PRODUCT}}

{{PRODUCT_PARAGRAPH}}

The domain words used above each mean one specific thing here, defined in
[CONTEXT.md](./CONTEXT.md).

## Local development setup

Requirements:

- **Node** — the version in [.node-version](./.node-version). Any version manager
  that reads that file will pick it up.
- **pnpm** — the version pinned in the `packageManager` field of
  [package.json](./package.json). Enable it with `corepack enable`.

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

The app runs at http://localhost:3000.

`pnpm install` also installs the git hooks, so formatting, commit messages and
branch names are checked from your first commit.

## Scripts

| Command          | What it does                            |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Dev server                              |
| `pnpm build`     | Production build                        |
| `pnpm start`     | Serve a production build                |
| `pnpm lint`      | eslint across the repository            |
| `pnpm typecheck` | Generates route types, then type-checks |

Use the pnpm scripts rather than `npx`, which can resolve a different version
than the `packageManager` field pins.

## Where to look next

- [CONTRIBUTING.md](./CONTRIBUTING.md) — commits, branches, pull requests, review
- [docs/code-standards.md](./docs/code-standards.md) — how code is written here
- [CONTEXT.md](./CONTEXT.md) — what the words of the domain mean
- [docs/adr/](./docs/adr/) — decisions that would otherwise look arbitrary
- [docs/agents/](./docs/agents/) — where agent skills find the issue tracker and domain docs
