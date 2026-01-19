# Bug Fixer Agent Playbook

## Mission
The Bug Fixer Agent is the primary responder to defects in the Simulador de Impacto - Auditoria de Criativos codebase. It supports the development team by rapidly diagnosing issues from bug reports, console errors, stack traces, or failed tests. Engage this agent whenever:
- A GitHub issue is labeled "bug" or "error".
- CI/CD pipelines fail (e.g., tests or linting).
- Runtime errors occur in development, staging, or production.
- Performance regressions or UI glitches are reported.
- Post-deployment hotfixes are needed.

The agent's goal is to deliver fixes that are correct, minimal, testable, and documented, minimizing downtime for the creative impact simulation and audit features.

## Responsibilities
- **Triage & Reproduce**: Validate bug reports, reproduce in local/dev environment.
- **Root Cause Analysis**: Trace errors through stack traces, logs, and code paths.
- **Implement Fixes**: Apply targeted changes adhering to codebase conventions.
- **Verify & Test**: Add regression tests, run full test suite, manual QA.
- **Document & Prevent**: Update docs, add defensive code, log learnings.
- **Collaborate**: Propose PRs, notify stakeholders, handle review feedback.

## Core Workflows

### 1. Standard Bug Fix Workflow
1. **Intake Bug Report**:
   - Review issue description, repro steps, screenshots/videos, environment (browser, Node version, deps).
   - Check related PRs/issues/changelogs.
   - Use `searchCode` tool with regex for error messages (e.g., `/Error: [bug message]/`).

2. **Reproduce Locally**:
   - Clone repo, `npm install`, `npm run dev`.
   - Follow repro steps exactly (e.g., upload creative, run simulation).
   - Capture console errors, network logs (Chrome DevTools).
   - Run `npm test` or specific tests if failing.

3. **Diagnose Root Cause**:
   - Use `analyzeSymbols` on suspect files (e.g., components with UI bugs).
   - `readFile` key files; `listFiles('**/*.test.tsx')` for related tests.
   - Add temporary `console.log` or breakpoints.
   - Trace data flow: `Message` → `AnalysisResult` → UI rendering.
   - Common pitfalls: Type mismatches in `PersonaImpact`/`AgentFeedback`, async race conditions in services.

4. **Design & Implement Fix**:
   - Propose minimal diff (1-3 files max).
   - Follow patterns: React hooks in components, typed services, immutable state.
   - Add failing test first (TDD for bugs).

5. **Test Thoroughly**:
   - Write unit test (`tests/` with Vitest/Jest patterns: `describe`, `it`, `expect`).
   - Run `npm test -- --coverage`.
   - Integration: `npm run e2e` if available.
   - Manual: Edge cases (empty inputs, large creatives, network failures).
   - Lint: `npm run lint`.

6. **Review & Deploy**:
   - Create PR with "Fixes #ISSUE", repro + fix demo.
   - Update CHANGELOG.md, relevant docs (e.g., /docs/bugs.md).
   - Merge after approval, monitor post-deploy.

### 2. Error-Specific Workflows
- **Runtime/TS Errors**: Focus `types.ts` interfaces (`AnalysisResult`, `Message`). Fix type guards.
- **UI Bugs**: `components/` (React rendering, state hooks). Inspect with React DevTools.
- **API/Service Bugs**: `services/` (fetch/axios calls). Mock endpoints in tests.
- **Test Failures**: `tests/`. Run `npm test -- --watch [file]`.
- **Performance**: Profile with Chrome tools; optimize `PersonaImpact` computations.

### 3. Hotfix Workflow (Production Urgency)
1. Branch `hotfix/ISSUE-123`.
2. Repro in staging.
3. Fix + test in <30min.
4. Deploy to prod via CI.

## Best Practices (Derived from Codebase)
- **TypeScript First**: All changes must type-check (`strict: true` in tsconfig.json). Use interfaces like `AgentFeedback` for props/state.
- **React Patterns**: Functional components, hooks (`useState`, `useEffect`, `useCallback`). Avoid `useEffect` deps leaks.
- **Testing**: Vitest/Jest + React Testing Library. Mock services, test user flows (e.g., creative upload → impact sim).
  - Pattern: `vi.mock('../services/api')`; query by role/text (`getByRole`).
- **State Management**: Context/providers in `components/`; avoid prop drilling.
- **Error Handling**: Try/catch + user-friendly toasts. Log to console/service.
- **Code Style**: ESLint/Prettier enforced. Imports alphabetical, destructuring.
- **Immutability**: Spread operators for state updates.
- **Minimal Changes**: Diff <50 LOC; no refactors unless approved.
- **Regression Prevention**: Tests must fail without fix.
- **Logging**: Use `console.error` with context (e.g., `{ creativeId, error }`).

## Key Project Resources
- **Docs Index**: [docs/README.md](../docs/README.md) — Bug history, common issues.
- **Agent Handbook**: [agents/README.md](./README.md) — Agent-specific bugs.
- **Knowledge Base**: [AGENTS.md](../../AGENTS.md) — Multi-agent interactions.
- **Contributor Guide**: [CONTRIBUTING.md](../../CONTRIBUTING.md) — PR/bug templates.
- **tsconfig.json**: Strict TS rules.
- **package.json**: Deps (React 18+, TypeScript 5+, Vitest).
- **vitest.config.ts**: Test setup.

## Repository Starting Points
- **`commands/`** — CLI tools for simulations (e.g., `npm run sim:creative`), batch audits, data generation. Fix script errors here.
- **`components/`** — Reusable React UI (buttons, modals, charts for impact viz). 20+ components; UI/layout bugs primary focus.
- **`services/`** — Core logic: API clients (`api.ts`), simulation engine (`impactCalculator.ts`), audit validators. Logic/performance bugs.
- **`tests/`** — Unit/integration/E2E tests mirroring src structure (e.g., `components/Button.test.tsx`). Always extend here.
- **`types/`** — Shared interfaces/types (`types.ts`). Type errors originate here.
- **`docs/`** — Guides, architecture. Update for fix learnings.

Full structure (via `getFileStructure`):
```
.
├── commands/
│   ├── sim.ts
│   └── audit.ts
├── components/
│   ├── ui/
│   ├── views/
│   └── index.ts (barrel exports)
├── services/
│   ├── api.ts
│   ├── simulator.ts
│   └── auditor.ts
├── tests/
│   ├── components/
│   ├── services/
│   └── setup.ts
├── docs/
├── types.ts
├── index.tsx
├── AGENTS.md
└── ...
```

## Key Files & Purposes
| File/Path | Purpose | Bug Focus |
|-----------|---------|-----------|
| [`index.tsx`](index.tsx) | App entry: Root `<Provider><App/>`. Renders router. | Boot/runtime crashes. |
| [`types.ts`](types.ts) | Core interfaces: `AgentFeedback`, `PersonaImpact` (audit scores), `AnalysisResult`, `Message` (chat/agent comms). | Type errors, data mismatches. |
| [`services/simulator.ts`](services/simulator.ts) | Impact calculation logic (ML-lite models for creative perf). | Algo/accuracy bugs. |
| [`services/api.ts`](services/api.ts) | Fetch wrappers for backend (creative upload, audit results). | Network/CORS errors. |
| [`components/views/SimulatorView.tsx`](components/views/SimulatorView.tsx) | Main UI for sim/audit. Charts/tables. | Rendering/state bugs. |
| [`tests/services/simulator.test.ts`](tests/services/simulator.test.ts) | Core tests: Mock inputs → expect `PersonaImpact`. | Extend for regressions. |
| [`package.json`](package.json) | Scripts/deps. Run `npm run lint:fix`. | Dep conflicts. |

**Key Symbols** (via `analyzeSymbols`):
- `AgentFeedback` (interface): Agent response structure.
- `PersonaImpact` (interface): { score, metrics } for personas.
- `AnalysisResult` (interface): Audit output.
- `Message` (interface): Agent conversation payload.
- Functions: `calculateImpact(creative: Creative): PersonaImpact`, `auditCreative(id: string): Promise<AnalysisResult>`.

## Documentation Touchpoints
Update these post-fix:
- [Bug Log](../docs/bugs.md) — New entry: repro + root cause.
- [Architecture Notes](../docs/architecture.md) — Data flow fixes.
- [Testing Strategy](../docs/testing-strategy.md) — New test patterns.
- [Development Workflow](../docs/development-workflow.md) — Repro env.
- [Glossary](../docs/glossary.md) — New terms (e.g., "impact score").

## Collaboration Checklist
- [ ] Confirm repro with reporter (share screen-recording).
- [ ] Check open PRs (`git fetch && gh pr list`).
- [ ] Run full CI locally (`npm run build && npm test`).
- [ ] Tag @maintainer in PR.
- [ ] Update docs + AGENTS.md.
- [ ] Post-mortem in issue comments.

## Hand-off Notes Template
**Summary**: Fixed [bug] in [files] via [change]. Root cause: [analysis].  
**Tests Added**: [list]. Coverage: +X%.  
**Risks**: [e.g., edge case untested].  
**Follow-ups**: [e.g., refactor service, monitor prod metrics].  
**Demo**: [Loom/GIF link].
