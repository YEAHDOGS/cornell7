# Cornell 7 Case File

**https://cornell7.dogs.red**

A one-page case file on *Jane Doe v. Cornell University, Inc., et al.* (Supreme Court of the State of New York, County of New York). It has:

- **Dossiers** on the plaintiff, the seven accused students and every institutional defendant. Each allegation is cited to its paragraph in the complaint.
- **A timeline** from Oct 18, 2024 to the present. Every text and Snapchat message quoted in the complaint or in published reporting is printed in full, as an iMessage or Snapchat replica.
- **Primary sources** (the complaint and police records) at the top of the page, and **news citations** at the bottom. Every link opens in a new tab.

Everything on the page is an allegation from a civil complaint or from published reporting. None of it has been proven in court.

Made by DOGS.

## Stack

- Vite + Svelte 5 (runes), JavaScript with JSDoc types
- Tailwind CSS v4. Theme tokens live in `src/app.css`.
- Icons: `@lucide/svelte`, imported one icon at a time
- Tests: Vitest, JSDOM, @testing-library/svelte

## Getting started

```
git clone https://github.com/YEAHDOGS/cornell7.git
cd cornell7
npm i
npm run dev
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/case.json` | Caption, lead paragraphs, defendants list, notices, headline figures |
| `src/data/people.json` | Every dossier, including the `aliases` the timeline links to that dossier |
| `src/data/timeline.json` | Timeline events and their message chains |
| `src/data/sources.json` | Primary sources (`kind`: `filing` / `official`) and news citations (`citation`) |
| `src/data/strings.json` | UI copy |
| `src/data/config.json` | `docsBaseUrl`, where the hosted court PDFs live |

### Citation markup

Prose in the data files can cite sources inline:

- `[CBS](cbs-texts)` links to a source in `sources.json`.
- `[¶ 162](complaint@26)` links to a PDF page (`#page=26`).

Both open in a new tab. In the timeline, the first mention of each name in `people.json` → `aliases` also opens that dossier in place.

## Hosted documents (Cloudflare R2)

The court records are served from `docsBaseUrl` (`https://data.wearedogs.net/doc/cornell7/`):

| File | Document |
| --- | --- |
| `jane-doe-v-cornell-complaint.pdf` | Summons & complaint (101 pp.) |
| `cupd-interview-transcript-2024-11.pdf` | CUPD interview transcript, Nov 14–15, 2024 |
| `cupd-sworn-statement-2024-11.pdf` | Six-page sworn statement, Nov 2024 |

Upload each with `Content-Type: application/pdf`, `Content-Disposition: inline` and a long `Cache-Control` value. Page links rely on the browser's PDF viewer.

## Deploying (Cloudflare Pages)

| Setting | Value |
| --- | --- |
| Framework preset | None (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Custom domain | `cornell7.dogs.red` |

`public/_headers` sets the security headers, caches `/assets/*` forever and makes the page revalidate on every load. `public/robots.txt` and `public/sitemap.xml` point at the production domain.

## Browser support

One version of the site for every browser, down to Chrome 40. No legacy plugin and no polyfills.

- **HTML:** `vite-prerender.js` renders `App.svelte` into `index.html` (in dev and in the build), so the whole case file is plain HTML before any JS runs. `src/main.js` hydrates it in place to add the dossier panel, the timeline filter and nav highlighting. Browsers without module scripts (or with JS off) read the same page, just without those interactions.
- **CSS:** Tailwind is imported without `@layer` and with `theme(inline)` (see the top of `src/app.css`), and Lightning CSS lowers it to Chrome 40 (`CSS_TARGET` in `vite.config.js`). Layout features old engines can't do (grid, flex gap, `dvh`, container units) fall back to normal flow, or are gated with `@supports` where the fallback has to look right.
- **JS:** modern only (`JS_TARGET`), since it's an enhancement on top of the prerendered page.
