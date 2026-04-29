# Dan Diggas — Engineering Site

Personal engineering site for Daniel Adekugbe / Dan Diggas.

The site presents practical AI workflow projects across music, security, and operations, with writing that connects Dan's production engineering work at Sophos Labs to his background as a professional musician and producer.

Live site: https://tech.dandiggas.com

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Markdown content via `gray-matter`, `remark`, and `remark-html`

## Structure

```text
src/app/                 App Router pages
src/app/projects/        Project listing and project detail pages
src/content/posts/       Markdown posts
src/lib/posts.ts         Post loading/parsing
src/components/          Shared UI components
public/profile.jpeg      Profile image
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

## Content priorities

Current flagship project:

- Keyboard Manual Assistant — grounded RAG for keyboard manuals with Langfuse tracing and eval/refusal behaviour.

Next proof assets:

- AI Studio Agent — local-first Ableton/stem-delivery workflow automation.
- Threat Intel Daily Brief — security signal aggregation and summarisation pipeline.
- The Shed — musician practice-tracking app.
