# Portfolio of Rutwij

A minimalist, content-first personal site — blog, projects, photography, and video — with a "coder" aesthetic and a light/dark toggle.

## Tech stack

- [Astro 5](https://astro.build/) — static output, fast, zero-JS by default
- [Tailwind CSS v4](https://tailwindcss.com/) — themed with semantic CSS variables (light/dark)
- [MDX](https://mdxjs.com/) — blog posts as content collections
- [React](https://react.dev/) — used only as an island for the cosmetic tracker
- Deployed on [Vercel](https://vercel.com/) (static, no adapter needed)

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> dist/
npm run preview  # preview the production build
```

> Node runs via WSL on this machine. Run the commands from your WSL shell in the project directory.

## Project structure

```
src/
  components/        UI components (Nav, Footer, cards, tracker island, ...)
  content/
    blog/            blog posts (.mdx)
    projects/        project entries (.md)
  data/
    photos.json      photography gallery metadata
    videos.json      YouTube video metadata
    tracker.json     frozen snapshot for the archived tracker
  assets/photos/     gallery source images (optimized at build)
  layouts/           BaseLayout (head, nav, footer, theme)
  lib/               site config + utilities
  pages/             routes: /, /blog, /work, /media, /about, 404
  styles/global.css  design tokens + light/dark theme + prose styles
public/images/       static images (avatar, hero, og)
```

## Pages

- `/` — home: hero, latest posts, section links
- `/blog` + `/blog/[slug]` — writing (MDX)
- `/work` + `/work/tracker` — projects (active + archived); the push-up tracker is an archived, read-only snapshot
- `/media` — photography grid + YouTube video cards
- `/about` — bio, career timeline, socials

## Editing content

- **Site identity / nav / socials:** `src/lib/site.ts`
- **Blog post:** add a `.mdx` file to `src/content/blog/` with frontmatter (`title`, `description`, `pubDate`, `tags`, `draft`).
- **Project:** add a `.md` file to `src/content/projects/` (`status: active | archived`, `tech`, `repo`, `link`, `year`, `order`).
- **Photography:** drop images in `src/assets/photos/` and add entries to `src/data/photos.json` (`src` = filename).
- **Video:** add entries to `src/data/videos.json` with the YouTube `youtubeId`.
- **Theme colors:** tweak the CSS variables in `src/styles/global.css` (`:root` for light, `[data-theme="dark"]` for dark).
- **Production domain:** set `site` in `astro.config.mjs` (used for sitemap + canonical URLs).

## Placeholders to replace

- Hero/intro and About copy (`src/pages/index.astro`, `src/pages/about.astro`)
- Career timeline entries (`src/pages/about.astro`)
- Sample blog posts (`src/content/blog/`)
- Gallery images + captions (`src/assets/photos/`, `src/data/photos.json`)
- Video IDs (`src/data/videos.json`)
- Project descriptions (`src/content/projects/`)

## Deployment

Push to GitHub and import the repo in Vercel. Astro's static output is auto-detected — no configuration required.
