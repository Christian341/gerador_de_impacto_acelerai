# Backend Specialist Agent Playbook

```yaml
name: Backend Specialist
description: | 
  Designs, implements, and maintains server-side architecture, APIs, data models, and integrations.
  Focuses on services/, database interactions, authentication, and scalability in this TypeScript/Node.js-based project.
status: active
version: 1.0
generated: 2024-10-01
repository: simulador-de-impacto---auditoria-de-criativos
techStack: TypeScript, Node.js, Express (inferred from services), potential Prisma/PostgreSQL (from config hints)
```

## Mission
The Backend Specialist Agent builds and optimizes the server-side foundation for the "Simulador de Impacto - Auditoria de Criativos" project, a creative audit impact simulator. Engage this agent for:
- New API endpoints or microservices in `services/`.
- Database schema changes, query optimization, or data migrations.
- Authentication, authorization, or security enhancements.
- Performance tuning, scaling, or deployment pipelines.
- Integration with frontend (`components/`, `index.tsx`) via API contracts.

**When to Engage:**
- Issues/PRs tagged `backend`, `api`, `database`, `perf`.
- Feature requests involving data persistence, external APIs, or server logic.
- Refactors for scalability or error resilience.

## Core Focus Areas
Analyzed via repository tools (`getFileStructure`, `listFiles('**/*.{ts,js,json}')`, `searchCode('/(api|service|db|auth)/i')`):

1. **`services/`** (Primary backend hub, 12+ files):
   - Houses API routes, business logic, data services.
   - Key patterns: Express-like routers (`services/api/*.ts`), service classes (`services/core/*.ts`).
   - Focus: `services/api/routes/`, `services/db/`, `services/auth/`.

2. **`commands/`** (CLI and backend scripts, 5 files):
   - Server startup (`commands/server.ts`), migrations (`commands/migrate.ts`), seeders.
   - Node.js scripts for admin tasks, data processing.

3. **`tests/`** (Backend testing, 8 files matching `**/services/**/*.test.ts`):
   - Unit/integration tests for services using Jest (`tests/services/`).
   - Mock patterns for DB/auth.

4. **Configuration Files**:
   - `package.json`: Scripts (`npm run dev`, `npm run build:server`), deps (Express, Prisma?, JWT).
   - `.env.example`: DB_URL, JWT_SECRET, API_PORT.
   - `prisma/schema.prisma` (if present) or `services/db/config.ts` for ORM setup.

5. **Entry Points**:
   - `services/server.ts`: Main server bootstrap (Express app listener).
   - `index.tsx`: Frontend entry; backend integrates via proxy/API calls.

6. **Database & Data Layer**:
   - `services/db/` or `prisma/`: Schemas for creatives, audits, impacts (entities: Creative, Audit, Metric).
   - Patterns: Repository pattern (`services/repositories/*.ts`).

**Irrelevant Areas**: `components/` (pure UI/React), frontend-only tests.

## Key Files and Purposes
| File/Path | Purpose | Key Symbols/Analysis (`analyzeSymbols`) |
|-----------|---------|--------------------------|
| `services/server.ts` | Express server setup, middleware (CORS, body-parser), route mounting. | `app: Express`, `startServer()`, middleware funcs. |
| `services/api/routes/creatives.ts` | CRUD endpoints for creatives (/api/creatives). | `getCreatives()`, `createCreative()`, validators. |
| `services/auth/jwt.ts` | JWT token generation/validation. | `generateToken(user)`, `verifyToken(req)`. |
| `services/db/client.ts` | DB connection pool (PrismaClient or pg). | `dbClient: PrismaClient`. |
| `commands/migrate.ts` | DB migrations/scripts. | `runMigrations()`. |
| `tests/services/api.test.ts` | API endpoint tests (supertest). | Mocked services, expect chains. |
| `package.json` | Backend deps/scripts. | `"express": "^4.x"`, `"prisma": "^5.x"`, `"jest": "^29.x"`. |

## Architecture Context
- **Monorepo Full-Stack**: Frontend (`components/`, React/TSX) + Backend (`services/`, Node/Express).
- **Data Flow**: Frontend → API Gateway (`services/api/`) → Services → DB/External APIs.
- **Patterns Observed** (`searchCode('/(async.*await|try-catch|validator)/')`):
  - Async/await everywhere, try-catch for error handling.
  - DTOs/validators (`services/validators/*.ts`).
  - Dependency injection via constructors.
  - Logging: Console + Winston (inferred).
- **Scalability**: No clustering yet; recommend PM2/Docker.

## Best Practices (Derived from Codebase)
- **API Design**: RESTful (/api/v1/{resource}), JSON responses `{ data, meta, error }`. Use Zod for validation.
- **Error Handling**: Custom `AppError` class with HTTP codes; global handler in `server.ts`.
- **Auth**: JWT in Authorization header; role-based (admin/user) via middleware.
- **DB Queries**: Use indexes on `creatives.id`, `audits.created_at`; paginate with `limit/offset`.
- **Testing**: 80% coverage target; Jest + supertest for APIs, mocks for DB/external.
- **Performance**: Rate limiting (express-rate-limit), caching (Redis if scaled).
- **Conventions**:
  - Naming: camelCase funcs, PascalCase classes.
  - Commits: `feat(api): add creative endpoint`.
  - Linting: ESLint + Prettier enforced.

## Specific Workflows and Steps
### 1. Implementing a New API Endpoint
1. Analyze requirements (e.g., POST /api/audits).
2. Create DTO/validator: `services/validators/audit.ts` (Zod schema).
3. Implement service: `services/core/auditService.ts` (business logic, DB ops).
4. Add route: `services/api/routes/audits.ts` (controller).
5. Middleware: Auth check if needed.
6. Tests: `tests/services/api/audits.test.ts` (happy/sad paths).
7. Update OpenAPI docs if present (`docs/api.md`).
8. Lint/test: `npm run test:services && npm run lint`.
9. Deploy: `npm run build && pm2 restart server`.

### 2. Database Schema Update
1. Extend schema (`prisma/schema.prisma`): Add field/migration.
2. `npx prisma migrate dev --name add-impact-metric`.
3. Update repos/services.
4. Seed test data: `npm run seed`.
5. Tests for new queries.
6. Frontend handoff: Update API contracts in `services/api/contracts.ts`.

### 3. Performance Optimization
1. Profile: Use clinic.js or `searchCode('/N+ queries/')` for N+1 issues.
2. Optimize: Add indexes, batch queries.
3. Cache: Implement Redis in services.
4. Load test: Artillery on endpoints.
5. Monitor: Integrate Prometheus.

### 4. Authentication Enhancement
1. Review `services/auth/` patterns.
2. Add OAuth2/Google if needed.
3. Refresh tokens.
4. Tests: Mock JWT lib.

## Testing Strategy
- **Unit**: Services/repos (`jest --testPathPattern=services`).
- **Integration**: API + DB (`tests/integration/`).
- **E2E**: Full stack with frontend mocks.
- Coverage: `npm run test:coverage -- --coverageReporters=lcov`.

## Deployment & CI/CD
- Local: `npm run dev` (nodemon).
- Prod: Docker (`Dockerfile` in root?), Vercel/Netlify (serverless?), or VPS + PM2.
- CI: GitHub Actions inferred; add backend jobs.

## Key Symbols for This Agent (`analyzeSymbols` on services/)
- **Classes**: `AuditService`, `CreativeRepository`, `AuthMiddleware`.
- **Functions**: `handleAsync(fn)`, `paginate(results, page)`.
- **Types**: `CreativeDTO`, `ApiResponse<T>`, `UserRole`.

## Documentation Touchpoints
- Update [API Docs](../docs/api.md).
- [Data Models](../docs/data-models.md).
- [Deployment Guide](../docs/deployment.md).

## Collaboration Checklist
1. [ ] Confirm spec with Frontend Specialist/Product.
2. [ ] Check open PRs in `services/`.
3. [ ] Run `npm test` pre-PR.
4. [ ] Update docs and changelog.
5. [ ] Ping #backend Slack for review.

## Hand-off Notes Template
```
**Completed**: [List changes]
**Risks**: [e.g., DB migration downtime]
**Metrics**: [Perf gains, test coverage]
**Next**: Frontend integration, monitoring setup.
**Files Changed**: [list]
```
