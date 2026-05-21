# IdeaDrop

A community board where people share real-world problems they face daily. Others can browse, upvote, and discover ideas worth building as graduation projects or startups.

**Live flow:** write a problem → community votes → builders find what to work on.

---

## Features

- **Submit problems** — title, description, category (including custom “Other”), optional name & LinkedIn, open-to-collaborate flag
- **Public board** — filter by category, sort by newest or most upvoted
- **Upvotes** — toggle upvote/downvote with realtime count updates across clients
- **Problem detail** — dedicated page and modal view per problem
- **Realtime** — new submissions and vote changes sync via Supabase Realtime

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| Routing | React Router 7 |
| Styling | Tailwind CSS |
| Backend | [Supabase](https://supabase.com) (PostgreSQL, RLS, RPC) |
| Icons | Lucide React |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20 recommended)
- A [Supabase](https://supabase.com) project (free tier works)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MazenMohammed534/idea-drop.git
cd idea-drop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Project URL from Supabase → **Settings → API** |
| `VITE_SUPABASE_ANON_KEY` | `anon` public key from the same page |

> Never commit `.env`. The anon key is safe in the browser only when Row Level Security is configured correctly.

### 4. Set up the database

In the Supabase **SQL Editor**, run the scripts in order:

1. [`supabase/schema.sql`](./supabase/schema.sql) — creates `problems` table, RLS policies, and vote RPC functions
2. [`supabase/migration-english-collab.sql`](./supabase/migration-english-collab.sql) — if upgrading an existing database (collab column, category constraints)

Enable **Realtime** on the `problems` table (included in `schema.sql` via publication).

**Recommended RLS for production:** keep `SELECT` and `INSERT` policies; remove the open `UPDATE` policy and rely on `increment_upvote` / `decrement_upvote` RPC only.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment

The app is a static SPA. Build output lives in `dist/`.

**Build settings (Vercel / Netlify / Cloudflare Pages):**

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Output directory | `dist` |

Add the same `VITE_*` environment variables in your hosting dashboard.

**SPA routing:** configure all routes to serve `index.html` so `/board` and `/problem/:id` work on refresh.

- **Vercel** — add `vercel.json` with a rewrite to `/index.html`
- **Netlify** — add `public/_redirects`: `/* /index.html 200`

---

## Project Structure

```
idea-drop/
├── public/              # Static assets
├── src/
│   ├── components/      # UI components (cards, navbar, upvote, etc.)
│   ├── lib/             # Supabase client, categories, utils
│   ├── pages/           # Landing, Submit, Board, ProblemDetail
│   └── types/           # Shared TypeScript types
├── supabase/
│   ├── schema.sql       # Initial database setup
│   └── migration-*.sql  # Incremental migrations
└── .env.example         # Environment template
```

---

## Routes

| Path | Page |
|------|------|
| `/` | Landing |
| `/submit` | Submit a problem |
| `/board` | Browse & filter problems |
| `/problem/:id` | Single problem view |

---

## Author

**Mazen Mohammed** — [@MazenMohammed534](https://github.com/MazenMohammed534)

---

## License

This project is open source. Add a license file if you plan to distribute it publicly.
