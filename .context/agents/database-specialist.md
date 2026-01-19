# Database Specialist Agent Playbook

## Mission
The Database Specialist agent supports the team by designing robust, scalable database schemas tailored to the "Simulador de Impacto - Auditoria de Criativos" application, which simulates impact metrics and audits creative assets (e.g., ads, campaigns). Engage this agent when:
- Defining initial or evolving data models for creatives, audits, users, metrics, and simulations.
- Implementing migrations for schema changes.
- Optimizing queries for performance in data-heavy simulations.
- Ensuring data integrity during high-volume audit workflows.
- Planning backups for production-like data persistence.

The app is currently frontend-heavy (React/TSX with Vite), relying on services for data operations. No backend database is implemented yet—focus on introducing a relational DB (PostgreSQL recommended for complex relations) or ORM like Prisma/Drizzle for seamless integration.

## Responsibilities
- Design and optimize database schemas
- Create and manage database migrations
- Optimize query performance and indexing
- Ensure data integrity and consistency
- Implement backup and recovery strategies

## Key Areas to Focus On
Use these directories and files as primary workspaces. The codebase lacks a dedicated `db/` or `backend/` yet—propose creating `db/` for schemas/migrations and `services/database/` for client-side integration.

| Area | Purpose | Key Actions |
|------|---------|-------------|
| **`db/`** (to create) | Schema definitions, migrations, seeds. | Design entities (e.g., `creativos`, `auditorias`, `simulaciones`), migrations. |
| **`services/`** | Data fetching, API clients (future backend proxy). | Implement DB queries via ORM, caching layers. Current files: API mocks/localStorage. |
| **`models/`** (to create) | TypeScript interfaces mirroring DB schemas. | Generate from schema (e.g., `Creativo.ts`, `Auditoria.ts`). |
| **`commands/`** | CLI tools for DB ops (e.g., migrate, seed). | Extend with `db-migrate.ts`, `db-seed.ts`. |
| **`tests/`** | DB integration/e2e tests. | Add `db.test.ts`, mock DB with Vitest + SQLite. |
| **`docs/`** | Schema docs, ERDs. | Update `glossary.md`, add `db-schema.md`. |

## Key Files and Their Purposes
**Core DB Files (Proposed/Current):**
- **`db/schema.prisma`** (create): Prisma schema defining entities like `User`, `Creativo` (id, title, metrics), `Auditoria` (id, creativoId, score, feedback), `Simulacion` (id, auditoriaId, impactProjections).
- **`db/migrations/`** (create): Migration files (e.g., `001_initial_schema.sql`).
- **`services/database.ts`** (extend): DB client init, query helpers (e.g., `getCreativosByAudit()`).
- **`services/api.ts`** (current): Mock data layer—replace with real DB calls.
- **`index.tsx`** (entry): App bootstrap—inject DB provider here.
- **`docs/glossary.md`**: Domain concepts (creativos=creatives, auditoria=audit, impacto=impact).
- **`docs/data-flow.md`**: Update with DB integration flow.

**Discovered via Analysis:**
- No existing `.sql`, `.prisma`, or DB symbols (classes/functions like `query`, `migrate`).
- Services use localStorage mocks for persistence—ideal migration target.
- Tests cover UI/services but lack DB fixtures.

## Architecture Context
### Data Layer
- **Current**: In-memory/localStorage in `services/` (e.g., `creativosStore`).
- **Target**: PostgreSQL + Prisma ORM for relations (one-to-many: Creativo → Auditorias → Simulaciones).
- **Flow**: UI (`components/`) → Services (`fetchCreativos()`) → DB queries → Cache (React Query).
- **Entities from Domain** (derived from `docs/glossary.md`):
  | Entity | Fields | Relations |
  |--------|--------|-----------|
  | `User` | id, email, role | hasMany Auditoria |
  | `Creativo` | id, title, imageUrl, baselineMetrics | hasMany Auditoria |
  | `Auditoria` | id, userId, creativoId, score, feedback | belongsTo User/Creativo, hasMany Simulacion |
  | `Simulacion` | id, auditoriaId, projectedImpact, variables | belongsTo Auditoria |

### Code Patterns and Conventions
- **TypeScript Strict**: Use interfaces from models (e.g., `InferSelectModel<typeof creativos>` with Prisma).
- **Naming**: CamelCase functions (`fetchAuditorias`), snake_case DB columns.
- **Error Handling**: Try-catch with Zod validation (seen in services).
- **Async/Await**: Universal in services/components.
- **No Raw SQL Yet**: Favor ORM for safety/portability.

## Best Practices (Derived from Codebase)
- **Schema Design**: Normalize to 3NF; use UUIDs for IDs (matches TS patterns).
- **Migrations**: Atomic changes, always include `down()` rollback (add to `commands/`).
- **Indexing**: Composite indexes on frequent joins (e.g., `auditoria_creativo_id_score`).
- **Transactions**: Wrap multi-table ops (e.g., createAuditoria + simulacion).
- **Benchmarking**: Use `EXPLAIN ANALYZE` pre/post; log slow queries (>100ms).
- **Security**: Row-Level Security if Postgres; prepared statements via ORM.
- **Backups**: pg_dump cron jobs; point-in-time recovery.
- **Testing**: In-memory SQLite for unit tests; Docker Postgres for e2e.
- Follow existing: ESLint/Prettier, Vitest patterns.

## Specific Workflows and Steps for Common Tasks

### 1. Design New Schema
1. Read `docs/glossary.md` and `docs/data-flow.md` for domain.
2. List entities/relations in Mermaid ERD (add to `docs/db-schema.md`).
3. Create `db/schema.prisma`; run `prisma generate`.
4. Generate TS models: `prisma db pull --schema=./db/schema.prisma`.
5. Update `services/` with typed queries.

### 2. Create Migration
1. `npx prisma migrate dev --name add-auditoria-table`.
2. Test locally: `docker-compose up postgres`.
3. Add rollback SQL.
4. Seed test data in `db/seed.ts`.
5. Update tests: `tests/services/database.test.ts`.

### 3. Optimize Query Performance
1. Identify slow endpoint (e.g., via console.time in services).
2. Add logging: `console.time('query-creativos')`.
3. Run `EXPLAIN` on query in DB tool (pgAdmin/DBeaver).
4. Add index: `CREATE INDEX idx_auditoria_score ON auditoria(score);`.
5. Benchmark: Before/after timings; aim <50ms.
6. Cache hot data (React Query in components).

### 4. Ensure Data Integrity
1. Add constraints: `UNIQUE(creativoId, userId)`, foreign keys.
2. Use transactions: `prisma.$transaction(async (tx) => {...})`.
3. Validate inputs: Zod schemas matching DB.
4. Audit logs table for changes.

### 5. Backup/Recovery
1. Script: `pg_dump -U user db > backup.sql`.
2. Docker: `volumes: ['./backups:/backups']`.
3. Test restore: `psql -d testdb < backup.sql`.

## Testing Patterns
- **Unit**: Mock Prisma client (`@prisma/client` mocks).
- **Integration**: `tests/integration/db.test.ts` with Testcontainers.
- **Patterns from Codebase**: `describe('service', () => { test('handles empty', async () => {...}) })`; expect.objectContaining.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **New: DB Setup Guide** (create `docs/database-setup.md`)

## Repository Starting Points
- **`commands/`** — CLI scripts for app bootstrapping and future DB ops (e.g., `npm run db:migrate`).
- **`components/`** — Reusable React UI (e.g., CreativoCard)—observe data props for schema hints.
- **`services/`** — Core business logic, API mocks, caching—primary integration point for DB.
- **`tests/`** — Vitest suites for services/UI—extend with DB mocks.

## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers (e.g., DB choice: Postgres vs. Supabase).
2. Review open pull requests affecting data layer.
3. Update relevant docs: `db-schema.md`, `data-flow.md`.
4. Capture learnings in `docs/README.md`.
5. Propose PR with schema + migration + tests.

## Hand-off Notes Template
**Outcomes**: Schema designed (X entities, Y relations); migrations applied; perf improved Z%.
**Risks**: Migration downtime on prod; data migration from localStorage.
**Follow-ups**: Integrate with services PR; e2e tests; monitor prod queries.
