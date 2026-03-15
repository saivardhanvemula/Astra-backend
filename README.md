# Astra – The Real Gym · Backend API

RESTful backend for the **Astra** gym platform built with **Node.js · Express · PostgreSQL · Prisma · TypeScript**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Language | TypeScript |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # DB schema (Members, Plans, Trainers, Transformations)
│   └── seed.ts              # Seed plans, trainers & transformations
├── src/
│   ├── controllers/         # Request/response handlers
│   ├── routes/              # Express routers
│   ├── services/            # Business logic + Zod schemas
│   ├── middlewares/
│   │   ├── errorMiddleware.ts   # Global error handler
│   │   ├── loggerMiddleware.ts  # Morgan HTTP logger
│   │   └── validateMiddleware.ts # Zod body validation
│   ├── db/
│   │   └── index.ts         # Prisma client singleton
│   └── server.ts            # Express app entry point
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL running locally (or a hosted instance)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and set your DATABASE_URL
```

### 4. Run migrations
```bash
npm run db:migrate
# Enter a migration name when prompted, e.g. "init"
```

### 5. Seed the database
```bash
npm run db:seed
```
This creates 3 plans (Monthly, Quarterly, Yearly), 4 trainers, and 3 transformation entries.

### 6. Start development server
```bash
npm run dev
```

Server starts on `http://localhost:5000`.

---

## API Reference

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health check |

### Members
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/members` | Register a new gym member |
| GET | `/api/members` | List all members (with plan details) |

**POST /api/members – Request body**
```json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "age": 25,
  "gender": "male",
  "fitness_goal": "Build muscle",
  "plan_id": "<uuid-of-a-plan>"
}
```

### Plans
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/plans` | List all membership plans |

### Trainers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trainers` | List all trainers |

### Transformations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transformations` | List transformation gallery entries |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot-reload |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled production build |
| `npm run db:migrate` | Create & apply a new Prisma migration |
| `npm run db:generate` | Re-generate Prisma Client |
| `npm run db:seed` | Seed plans, trainers & transformations |
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run db:reset` | Reset DB & re-run all migrations |

---

## Phase 2 Roadmap

The codebase is structured for clean extension. Planned features:

- Attendance tracking
- Workout session logging  
- Membership renewal & expiry logic
- Payments integration (Razorpay / Stripe)
- Trainer assignment to members
