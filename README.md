# Twittesia

Twittesia is an open-source social media platform, similar to Twitter, where
every piece of content has a lifespan of 24 hours. Users publish posts to their
followers or to their close friends, publish ghosts when they would rather stay
anonymous, comment on posts, and talk in chats. At expiry, each post, comment
and message is deleted for good.

The domain words used above each mean one specific thing here, defined in
[CONTEXT.md](./CONTEXT.md).

## Local development setup

Requirements:

- **Node** — the version in [.node-version](./.node-version). Any version manager
  that reads that file will pick it up.
- **pnpm** — the version pinned in the `packageManager` field of
  [package.json](./package.json). Enable it with `corepack enable`.

Copy the environment template and fill in each value. `DATABASE_URL` is the
pooled connection the app uses, and `DATABASE_URL_UNPOOLED` the direct
connection migrations run over:

```bash
cp .env.example .env.local
```

Bring your database up to the current schema:

```bash
pnpm exec drizzle-kit migrate
```

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

The app runs at http://localhost:3000.

`pnpm install` also installs the git hooks, so formatting, commit messages and
branch names are checked from your first commit.

## Scripts

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Dev server                                        |
| `pnpm dev:email` | Preview server for the email templates            |
| `pnpm build`     | Production build                                  |
| `pnpm start`     | Serve a production build                          |
| `pnpm lint`      | oxlint across the repository                      |
| `pnpm lint:fix`  | oxlint, applying every fix it can                 |
| `pnpm fmt`       | oxfmt across the repository, sorting imports      |
| `pnpm fmt:check` | oxfmt, reporting unformatted files without fixing |
| `pnpm typecheck` | Generates route types, then type-checks           |

Use the pnpm scripts rather than `npx`, which can resolve a different version
than the `packageManager` field pins.

## Where to look next

- [CONTRIBUTING.md](./CONTRIBUTING.md) — commits, branches, pull requests, review
- [docs/code-standards.md](./docs/code-standards.md) — how code is written here
- [CONTEXT.md](./CONTEXT.md) — what the words of the domain mean
- [docs/adr/](./docs/adr/) — decisions that would otherwise look arbitrary
- [docs/agents/](./docs/agents/) — where agent skills find the issue tracker and domain docs

## Author

David Aragundy
