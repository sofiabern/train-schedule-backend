# 🚂 Train Schedule — Backend

REST API for the Train Schedule app. Built with **NestJS**, **Prisma**, and **PostgreSQL**.

---

## API overview

| Resource | Description |
|----------|-------------|
| **Auth** | Register, login (JWT) |
| **Trains** | Trains (name, capacity) |
| **Stations** | Stations |
| **Routes** | Routes with stops (station, order, arrival/departure time) |
| **Schedules** | Trips: train + route + departure time + days of week |

GET endpoints are public. Create, update, and delete require a JWT token.

---

## Tech stack

- [NestJS](https://nestjs.com/) 11
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [Passport](https://www.passportjs.org/) (JWT, local)
- TypeScript

---

## Running locally

### Prerequisites

- Node.js 18+
- PostgreSQL

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET=your-secret-string
```

### Database

```bash
# Generate Prisma Client and apply schema (dev)
npm run db:push

# Or run migrations (prod)
npm run db:migrate
```

### Start

```bash
# Development (watch)
npm run start:dev

# Build
npm run build

# Production
npm run start:prod
```

API will be available at [http://localhost:3000](http://localhost:3000) (or the port set in `PORT` in `.env`).

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Build |
| `npm run start:prod` | Run from `dist/` |
| `npm run db:push` | Prisma generate + db push |
| `npm run db:migrate` | Prisma migrate deploy |
| `npm run build:render` | Build for Render (migrate + build) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Unit tests |

---

## CORS

By default only the Vercel frontend origin is allowed:

- `https://train-schedule-frontend-virid.vercel.app`

For local development you can extend the `origin` list in `src/main.ts`.

---

## Project structure

```
src/
  auth/        # Register, login, JWT guard
  train/       # Trains
  station/     # Stations
  route/       # Routes and stops
  schedule/    # Trips (schedule)
  prisma/      # PrismaService
  main.ts      # CORS, port
prisma/
  schema.prisma
  migrations/
```

---

## License

See [LICENSE](./LICENSE).
