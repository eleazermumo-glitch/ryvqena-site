# Ryvqena Tech website

React + TypeScript + Vite, with GSAP + ScrollTrigger for restrained motion.
Design: light layout with royal blue `#1D4ED8`, navy ink `#0B1B3A` and off-white `#F7F9FC`, following the supplied inspiration. Colours are tokens at the top of `src/styles/global.css`.
Fonts: Archivo (headlines, variable width), Instrument Sans (body), IBM Plex Mono (technical labels).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then outputs dist/
npm run preview    # serve the production build
```

Node 18 or newer.

## Structure

```
src/
  components/   Nav, Footer, Button, SectionHead, CaseStudy, EnquiryForm,
                CapVisual
  sections/     Hero, About, Capabilities, Products, Projects, Approach, Contact
  pages/        Home, ProductPage   (hash routes: #/, #/garidoc, #/vouchify)
  hooks/        useReducedMotion, useRoute, useScrollSpy
  data/         site.ts  <- all copy, services, case studies live here
  styles/       global.css (tokens, base, nav, footer), sections.css
backend/       server.js, lib/ (validate, db, rate limit, mail), admin/ (enquiries page), test.mjs
public/images/  logo, GariDoc screenshots
```

All content is in `src/data/site.ts`. Change text or case studies there.

## Backend (enquiries, admin, email)

`backend/` is a small server with **no npm dependencies**. It needs Node 22.5 or newer (it uses the built-in `node:sqlite`).

```bash
cp .env.example .env      # then edit it; the server reads real environment variables, so export them or use your host's settings
npm run build             # builds the site into dist/
ADMIN_TOKEN=$(openssl rand -hex 32) npm run server    # serves the site AND the API on http://localhost:8787
npm run test:server       # 13 tests for the API (validation, rate limit, admin, CSV, static serving)
```

What it does:

| Endpoint | Purpose |
| --- | --- |
| `POST /api/inquiries` | Receives the enquiry form. Validates every field, has a honeypot, limits each visitor to 5 enquiries per 10 minutes, stores to SQLite (`backend/data/ryvqena.db`), then emails you if configured. IP addresses are stored only as salted hashes. |
| `GET /admin` | Page that lists enquiries, lets you mark them new / read / replied / archived and export CSV. Sign in with `ADMIN_TOKEN`. Disabled until you set one. |
| `GET /api/admin/inquiries`, `PATCH /api/admin/inquiries/:id`, `GET /api/admin/inquiries.csv` | The API behind the admin page (Bearer token). |
| `GET /api/health` | Shows whether email and admin are on. |

**Email alerts** are optional: set `RESEND_API_KEY`, `MAIL_FROM` (a sender on a domain you have verified with Resend) and `NOTIFY_TO`. If email fails, the enquiry is still saved and the error is logged.

**If the site is on static hosting** with no server, the form detects that, says so on screen, and opens the visitor's email app instead.

**Development:** run `npm run server` in one terminal and `npm run dev` in another. Vite proxies `/api` to the server.

**Hosting the server:** any host that runs Node and keeps a disk (a small VPS, Railway, Render with a disk, Fly.io with a volume). Put it behind HTTPS and set `TRUST_PROXY=1` if a proxy sits in front. Back up `backend/data/`.

If the API lives on a different domain from the site, set `VITE_FORM_ENDPOINT` at build time and `ALLOWED_ORIGIN` on the server.

## Social links

None are shown because no URLs were supplied. Add them to `company.socials` in `src/data/site.ts`; they appear in the footer and contact section automatically.

## Adding a case study

Append an object to `caseStudies` in `src/data/site.ts`. The `CaseStudy` component renders it. Only add work that really exists.

## Accessibility and performance notes

- Reduced motion: loader, reveals, scroll progress and the CSS animations are all switched off or made static.
- Skip link, semantic landmarks, labelled form fields, keyboard-operable capability tabs.

## Hosting

Static hosting works (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Routes use the URL hash, so no server rewrite rules are needed. If you serve from a sub-path, set `base` in `vite.config.ts` and change the `/images/...` paths in `src/data/site.ts` and components.

## Vouchify

Vouchify appears as a product **in development**, with a labelled concept drawing and "planned capabilities". Its wording comes from the inspiration mock-up and your certificate-verification idea. Edit `vouchify` in `src/data/site.ts`, or remove it from `products`, if the description is not right.

## AI assistant

A chat button ("Ask Ryvqena") sits on every page. It answers questions about the company, services and products, and points people to the contact form, email or WhatsApp.

- **Facts it knows** live in `src/data/agent-knowledge.json`. Edit that file to change what it says (add prices, an address or clients only when they are real). Everything it says comes from that file.
- **With AI:** set `ANTHROPIC_API_KEY` on the server. Questions go to `POST /api/agent`, which calls the Anthropic API with that file as its only source of facts. Optional: `ANTHROPIC_MODEL`, `AGENT_RATE_MAX` (questions per visitor per 10 minutes, default 20).
- **Without a key** (or if the AI is unreachable, or on static hosting): the widget answers from the same facts with simple keyword matching and labels itself "Quick answers".
- Visitors' questions are not stored. The key stays on the server and is never sent to the browser.

## Ryvqena Academy (`#/academy`)

Free learning area. Two beginner courses (AI and Machine Learning Fundamentals; Cloud Architecture Basics), four lessons each, a three-question check after every lesson (2 of 3 to pass) and a printable certificate of completion once every lesson is passed. Content lives in `src/data/academy.ts`; add a course or lesson by adding to that file. Progress and the certificate name are saved in the visitor's browser (`localStorage`), so there are no accounts and nothing is sent to the server yet.
