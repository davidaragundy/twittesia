# Sources

Where the current truth about Next.js lives. Read the page for the topic before
writing code that depends on it, in the documentation for the version in
`package.json`. After a major upgrade, read the upgrade guide first.

If the documentation cannot be reached, say so to the user rather than writing
the API from memory.

## Next.js documentation

| Topic | Page |
| --- | --- |
| Where files go, special files, route groups | [Project structure](https://nextjs.org/docs/app/getting-started/project-structure), [File conventions](https://nextjs.org/docs/app/api-reference/file-conventions) |
| Pages and layouts | [Layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) |
| The server and client boundary, `server-only` | [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [`use client`](https://nextjs.org/docs/app/api-reference/directives/use-client) |
| Reading data | [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) |
| Writing data, server actions | [Mutating data](https://nextjs.org/docs/app/getting-started/mutating-data), [`use server`](https://nextjs.org/docs/app/api-reference/directives/use-server) |
| Securing actions and data access | [Data security](https://nextjs.org/docs/app/guides/data-security) |
| Caching and revalidation | [Caching](https://nextjs.org/docs/app/getting-started/caching), [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components) |
| Errors | [Error handling](https://nextjs.org/docs/app/getting-started/error-handling) |
| Metadata | [Metadata and OG images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) |
| Route handlers | [Route handlers](https://nextjs.org/docs/app/getting-started/route-handlers) |
| Upgrading | [Upgrading](https://nextjs.org/docs/app/guides/upgrading) |

A page that no longer resolves is itself a sign the framework moved: search the
documentation for the topic rather than skipping the check.

## Official Next.js skills

Vercel publishes agent skills in the Next.js repository that cover parts of the
framework in depth. They are sources like the documentation: they say how
Next.js works, and leave this repository's rules as they are. Each states its
own requirements.

| Skill | Covers |
| --- | --- |
| `next-dev-loop` | Confirming a change works in the running app, through Next's `/_next/mcp` endpoint and a real browser |
| `next-cache-components-adoption` | Turning on Cache Components and resolving the routes it blocks |
| `next-cache-components-optimizer` | Driving a route to instant navigation under Cache Components |
| `next-partial-prefetching-adoption` | Turning on Partial Prefetching and working through what it surfaces |

Install one with:

```bash
npx skills add vercel/next.js --skill <skill>
```

The list is what the repository held when this page was written:
`npx skills add vercel/next.js --list` shows what it holds now.
