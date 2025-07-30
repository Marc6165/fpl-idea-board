# FPL Idea Board

A lightweight single-page web app for your Fantasy Premier League group to propose and vote on forfeits, winner rewards, and ground rules.

## Stack

- **Next.js 14** (App Router + React Server Components)
- **React + TypeScript**
- **Tailwind CSS** for modern, responsive UI
- **Supabase** (PostgreSQL) as backend
- **SWR** for data fetching & real-time updates
- **Zod** for schema validation

## Local setup

```bash
# 1 Install dependencies
npm install

# 2 Configure env vars
cp .env.example .env.local   # then add your Supabase URL & anon key

# 3 Start dev server
npm run dev
```

App runs at http://localhost:3000

## Database

Run the SQL in `db/schema.sql` inside Supabase SQL editor to create tables & triggers.

## Deployment (Vercel)

1. Push repo to GitHub, import into Vercel.
2. Add env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Build command `npm run build` – default output `.next`.

Free tiers (Vercel Hobby + Supabase Free) easily cover this app – **$0/month**.

## Cookie & vote logic

- On first request the server issues a random UUID stored in `voterId` cookie (`SameSite=Lax`, `HttpOnly`, `max-age = 1 year`).
- Votes are recorded per **(idea_id, voter_id)** so each visitor can vote once per idea (toggle ↑/↓ allowed).
- PostgreSQL triggers keep `ideas.score` equal to the sum of all votes, ensuring consistency.

Enjoy, and may the forfeits be ever in your favour! ⚽
