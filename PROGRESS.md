# Portfolio — Progress Tracker

## Live URLs
- Portfolio: https://nilshogberg.vercel.app (auto-deploys from main branch)
- Domain to register: nilshogberg.dev on Cloudflare (~€12.2/year) — not yet bought
- is-a.dev option: PR to is-a-dev/register repo with domains/nilshogberg.json

## GitHub Repos
- github.com/Nimaho71/portfolio — this project
- github.com/Nimaho71/chess-engine — Python chess AI
- github.com/Nimaho71/Python-Fluid-Simulation — SPH fluid sim (already existed)
- github.com/Nimaho71/nature-gallery — parallax animation website
- github.com/Nimaho71/chess-web — Pygbag static build (deploy this to Vercel, not chess-engine)

## Local Paths
- Portfolio: ~/Documents/portfolio
- Chess engine: ~/Documents/Donnergymnasiet/Gymnasiearbete/PycharmProjects/ChessAI/
- Fluid sim: ~/Documents/Coding_projects/fluid.py
- Animation site: ~/Documents/Donnergymnasiet/Gymnasiearbete/animation website/
- CTF work: ~/Documents/cyber/ (HTB, THM, PicoCTF)
- Other projects: ~/Documents/Coding_projects/ (blocket apps, queens_server, openclaw-demo, JARVIS)

## Tech Stack
- Portfolio: Next.js 14 + TypeScript + Tailwind CSS
- 3D/Animation: Three.js (constellation canvas) + GSAP (scroll parallax)
- Fonts: Syne (display) + Instrument Serif (body) + JetBrains Mono (code)
- Hosting: Vercel (free tier, connected via nils.oi.hogberg@gmail.com account)

## ✅ Completed
- [x] Animation bug fixed (data-percentage attribute missing)
- [x] nature-gallery, chess-engine pushed to GitHub (with proper .gitignore + README)
- [x] Portfolio built: hero constellation, project cards, CTF section, contact
- [x] Security headers (CSP, X-Frame-Options, etc.) in next.config.ts
- [x] Scroll parallax + section reveal animations
- [x] Mobile responsive (svh viewport, card grids, nav hides on narrow)
- [x] Custom cursor (desktop only, hidden on touch)
- [x] HOGBERG mobile overflow fixed
- [x] Canvas pointer-events: none (mobile touch scroll fixed)
- [x] Hyperplexed mouse-glow on all cards (direct DOM, no re-renders)
- [x] Nav: underline-slide + "Hire me" CTA
- [x] About/Skills section (bio + categorised skill tags)
- [x] Contact: email first, LinkedIn added, reordered
- [x] Muted text brightness improved
- [x] Available-for-hire green badge on hero

## 🔲 Next Steps (in order)
~~1. **Deploy nature-gallery to Vercel** — done: nature-nilshogberg.vercel.app~~
1. **is-a.dev domain** — PR #40246 open, wait for merge, then add nilshogberg.is-a.dev in Vercel → Settings → Domains — import github.com/Nimaho71/nature-gallery as separate project → get URL → update PROJECTS[2].live in page.tsx
2. **Chess web demo** ✅ — Built. Repo: github.com/Nimaho71/chess-web (static Pygbag/WASM output). Import this repo in Vercel dashboard → deploys as chess-nilshogberg.vercel.app. To update after AI changes: copy changed .py files to ~/Documents/chess-web/, run `/opt/homebrew/bin/python3 -m pygbag --build main.py` from that dir, then `cd build/web && git add . && git commit -m 'Rebuild' && git push`
3. **Fluid sim web demo** — Pyodide version: strip @njit decorators, replace prange→range, wrap in minimal HTML → deploy to Vercel subdomain  
4. **About section** — add photo/avatar when available
5. **CTF writeups** — add proper markdown writeups for HTB/THM/PicoCTF challenges
6. **Domain** — register nilshogberg.dev on Cloudflare, configure DNS → Vercel
7. **LinkedIn** — fill in profile (currently mostly blank)
8. **JARVIS / other projects** — ~/Documents/JARVIS-Mission-Control-OpenClaw and ~/Documents/Coding_projects/ contain more projects to potentially showcase

## Decisions Made
- Fluid sim → Pyodide (strip Numba, browser-side) — no Fly.io server needed
- Chess → Pygbag (compiles Pygame to WASM, runs in browser, no server)
- Domain → Cloudflare (at-cost pricing, good for cybersecurity signal)
- Theme → dark terminal aesthetic, Syne+Instrument Serif, cyan accent
- No light/dark mode toggle (dark is correct for cybersecurity target audience)
- No phone number publicly (security hygiene)
- Target audience: Cybersecurity (primary), General SWE, AI/ML (secondary)

## Key Files
- app/page.tsx — all components in one file (~540 lines)
- app/globals.css — CSS variables, cursor, tag/skill chip styles, nav underline
- next.config.ts — security headers
- app/layout.tsx — metadata + font loading (next/font/google)

## Context Transfer (for future sessions)
Say: "Continue portfolio project. Read ~/Documents/portfolio/PROGRESS.md first."
