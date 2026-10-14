This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Automatic sitemap

Next.js configuration runs `scripts/generate-sitemap.mjs` before development and production builds. It discovers static App Router pages and articles in `src/lib/insights/content.ts`, then generates `src/generated/sitemap.json` for `/sitemap.xml`.

Country briefs, API routes, `/maptest`, and `/growth-atlas` are excluded. No `noindex` tags are added. New dynamic route families need a content registry in the generator; route groups are supported, while private and parallel route folders are skipped.

`lastmod` uses Git commit dates for page sources and local imports. Insights article dates follow changes to their individual content blocks and shared rendering dependencies. Uncommitted sources or unavailable Git history cause dates to be omitted. Deploying unchanged content does not reset dates. Live API/data updates without source changes are not tracked.

After deploying, submit `https://sufoniq.com/sitemap.xml` in Google Search Console.
