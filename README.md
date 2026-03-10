# Kitchen Prep Planner (KPI_BEP_CHBFOOD_V2)

Production-ready restaurant kitchen preparation planning app using Next.js, React, TailwindCSS, Next API routes, and PostgreSQL.

## Features

- End-of-day inventory input (tablet-friendly)
- Next-day sales forecast input
- Recipe builder (dish → ingredients + quantity per dish)
- Kitchen capacity settings (batch size + batch time)
- Auto KPI calculation engine:
  - total ingredients required
  - inventory subtraction
  - amount to prepare
  - kitchen batches
  - preparation time
  - finish-time target
- Mobile-first screens with large touch controls and numeric keypad

## Tech Stack

- Frontend: Next.js + React + TailwindCSS
- Backend: Next.js REST API routes
- Database: PostgreSQL

## Folder Structure

- `app/` – pages + API routes
- `components/` – reusable UI components
- `lib/` – DB access + calculation engine + shared types
- `db/schema.sql` – PostgreSQL schema
- `db/seed.sql` – example seed data
- `scripts/seed.ts` – DB initialization and seed runner

## Database Setup

1. Create PostgreSQL database (default expected):
   - `kitchen_planner`
2. Set env variable:

```bash
cp .env.example .env.local
```

3. Fill `DATABASE_URL` in `.env.local`.

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kitchen_planner
```

4. Seed schema and sample data:

```bash
npm run db:seed
```

## Run Application

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## KPI Calculation Logic

Implemented in `lib/calculation.ts`.

For each ingredient:

1. Sum demand from all forecasted dishes based on recipes
2. Subtract current inventory
3. Convert to prep unit using `conversion_factor`
4. Convert to batches using `kitchen_capacity.batch_size`
5. Convert to minutes using `batch_time_minutes`

Total prep minutes = sum of all ingredient prep times.
Finish time = start time + total prep minutes.

### Example Match

- Tofu: `300 bowls × 5 pieces = 1500 pieces`
- Convert: `1500/8 = 187.5 blocks`
- Batch: `187.5/25 = 7.5 batches`
- Time: `7.5 × 12 = 90 minutes`

- Beef: `300 × 35g = 10500g = 10.5kg`
- Batch: `10.5/2 = 5.25 batches`
- Time: `5.25 × 10 = 52.5 minutes`

Total = `142.5 minutes`.
If start at `06:00`, finish around `08:23` (rounded by minute handling).

## Production Notes

- Add auth (Clerk/Auth.js) for role-based access.
- Add audit logs for inventory/forecast edits.
- Add optimistic locking for concurrent edits.
- Add automated tests (unit + integration + e2e).
