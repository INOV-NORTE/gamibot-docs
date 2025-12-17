---
title: Tech Stack & Setup
description: Gami API technology stack and installation instructions.
---

# Tech Stack & Setup

This page describes the technology stack and setup instructions for the Gami API.

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js (TypeScript) |
| **Framework** | Fastify |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Validation** | Zod |
| **Documentation** | Swagger / OpenAPI |
| **Containerization** | Docker & Docker Compose |

---

## Prerequisites

- Node.js v18+
- Docker & Docker Compose

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gamibot?schema=public"
```

---

## Installation

### Docker (Recommended)

Start both the API and PostgreSQL database:

```bash
docker-compose up -d --build
```

The API will be available at `http://localhost:3000`.

### Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Migrations**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Start Server**:
   ```bash
   npm run dev
   ```

---

## Testing

The project uses **Vitest** for integration testing:

```bash
npm test
```

### Test Suites

| Suite | Coverage |
|-------|----------|
| **XP Tests** | XP awarded correctly based on quiz scores |
| **Topic Tests** | Topic progress calculated accurately |
| **Badge Tests** | All badges awarded when conditions are met |
| **Stats Tests** | User statistics aggregation and initialization |

---

## Next Steps

- [API Reference](/en/gamification/api-reference) - Authentication and endpoints
- [Gami API Overview](/en/gamification/overview) - Features overview
