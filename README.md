# Portfolio

Personal portfolio site built with Next.js, TypeScript, and Tailwind CSS. Features a Three.js constellation hero, GSAP scroll animations, and project/CTF showcase sections.

Live: [nilshogberg.vercel.app](https://nilshogberg.vercel.app)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Structure

- `app/page.tsx` — all page sections (hero, projects, CTF, skills, contact)
- `app/globals.css` — theme variables and custom styles
- `app/layout.tsx` — metadata and font loading
- `next.config.ts` — security headers

## Making it your own

Fork this repo and update the content in `app/page.tsx` (projects, skills, bio, links) and `app/layout.tsx` (metadata). It deploys out of the box on [Vercel](https://vercel.com/new) or any Next.js-compatible host.

## License

MIT — see [LICENSE](LICENSE).
