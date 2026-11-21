# Dan Diggas — Engineering Site

Personal engineering site for Daniel Adekugbe / Dan Diggas.

The site presents practical AI workflow projects across music, security, and operations, with writing that connects Dan's production engineering work at Sophos Labs to his background as a professional musician and producer.

Live site: https://tech.dandiggas.com

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Markdown content via `gray-matter`, `remark`, `remark-rehype` and `rehype-stringify`

## Structure

```text
src/app/                 App Router pages
src/app/tech/            Tech index (the ledger) and project pages
src/app/posts/[slug]/    Post pages
src/app/feed.xml/        RSS feed
src/content/posts/       Markdown posts (front matter: theme, stat, line, numbers)
src/content/             Themes, featured posts, projects, the Now feed, about tracks
src/lib/posts.ts         Post loading/parsing
src/lib/markdown.ts      Markdown to HTML (posts and feed)
src/components/          Shared UI components
```

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

## Tests

```bash
npm test            # unit tests (Vitest)
npm run test:e2e    # end-to-end tests (Playwright, builds the site twice)
npm run proof       # proof screenshots into .agent/proof/
```

## Content priorities

Current flagship project:

- Keyboard Manual Assistant — grounded RAG for keyboard manuals with Langfuse tracing and eval/refusal behaviour.

Next proof assets:

- AI Studio Agent — local-first Ableton/stem-delivery workflow automation.
- Threat Intel Daily Brief — security signal aggregation and summarisation pipeline.
- The Shed — musician practice-tracking app.
