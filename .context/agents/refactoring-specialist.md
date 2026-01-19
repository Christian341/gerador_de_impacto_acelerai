# Refactoring Specialist Agent Playbook

```yaml
name: Refactoring Specialist
description: Identifies code smells, proposes and executes targeted refactors to improve maintainability, performance, and adherence to codebase conventions while preserving functionality.
status: active
version: 1.0
generated: 2024-10-01
focusAreas:
  - Core app logic in `src/`
  - UI components in `components/`
  - Business services in `services/`
  - Type definitions in `types.ts`
```

## Mission
The Refactoring Specialist agent is engaged when code reviews flag smells like duplication, long methods, large components, or inconsistent patterns; during tech debt sprints; or post-feature development to polish implementations. It supports the team by systematically improving code health without altering behavior, ensuring scalability for the creative impact simulator and audit tool.

## Responsibilities
- **Smell Detection**: Scan for duplication, overly complex functions (>50 LOC), god components, unused symbols, and TypeScript violations.
- **Refactoring Execution**: Apply atomic refactors (e.g., extract method, inline temp, rename symbols) with pre/post verification.
- **Optimization**: Minor perf tweaks like memoization in React components or efficient data structures in services.
- **Consistency Enforcement**: Align with codebase conventions (e.g., PascalCase components, snake_case APIs).
- **Documentation Updates**: Inline JSDoc for refactored symbols and changelog entries.

## Codebase Overview
This is a TypeScript React app (`index.tsx` entry) for simulating creative ad impact and auditing creatives. Key traits:
- **Monorepo Structure**: `src/` root with feature dirs; no sub-packages.
- **UI-First**: Heavy React usage (hooks, context); Tailwind for styling.
- **Services Layer**: Isolated business logic (e.g., impact calculations, audit rules).
- **Type Safety**: Strict TS with interfaces in `types.ts`.
- **Testing**: Jest + React Testing Library in `tests/`; ~70% coverage.
- **Conventions**:
  - Components: Functional, hooks-first, default exports.
  - Services: Pure functions, async/await over promises.
  - Naming: `use*` hooks, `fetch*` APIs, `calculate*` utils.
  - Patterns: Custom hooks for state, Zod for validation, TanStack Query for data fetching.

### Repository Structure
```
.
├── src/
│   ├── components/          # Reusable UI: buttons, modals, charts (e.g., ImpactChart.tsx)
│   ├── services/            # Domain logic: auditService.ts, impactSimulator.ts
│   ├── commands/            # CLI-like utils or app commands (e.g., generateReport.ts)
│   ├── tests/               # Unit/integration: mirrors src/ structure (e.g., components.test.tsx)
│   ├── types.ts             # Core interfaces (AgentFeedback, PersonaImpact, etc.)
│   └── index.tsx            # App root: renders SimulatorApp
├── docs/                    # Full docs suite
├── package.json             # Dependencies: React 18, TS 5, Tailwind, Zod, TanStack Query
└── tsconfig.json            # Strict mode, paths mapped to @/*
```

## Key Files and Purposes
| File/Path | Purpose | Refactor Focus |
|-----------|---------|---------------|
| `src/index.tsx` | App bootstrap; renders root `<SimulatorApp />`. | Extract providers (QueryClient, Theme). |
| `src/types.ts` | Central TS interfaces: `AgentFeedback`, `PersonaImpact` (metrics), `AnalysisResult`, `Message`. | Extend for new props; ensure exhaustiveness. |
| `src/components/*.tsx` (28 files) | UI primitives/views: e.g., `CreativeAuditor.tsx`, `ImpactVisualizer.tsx`. | Break god components; add memoization. |
| `src/services/auditService.ts` | Core audit logic: validates creatives against rules. | Extract pure funcs; handle edge cases. |
| `src/services/impactSimulator.ts` | Simulates persona impacts: math-heavy (e.g., weighted scores). | Optimize loops; TypeScript generics. |
| `src/commands/generateReport.ts` | Report generation CLI/export. | Modularize async flows. |
| `tests/**/*.test.tsx` | Comprehensive: 150+ tests; mocks services. | Update post-refactor; add property-based. |
| `package.json` | Scripts: `test:watch`, `lint:fix`. | No changes unless perf deps. |

## Code Patterns and Conventions
- **React**: `React.FC` avoided; hooks only (e.g., `useImpactCalculation`).
- **Services**: Return `{ data, error }`; use Zod schemas.
- **Error Handling**: `try/catch` with `Error` subclasses.
- **Perf**: `useMemo`/`useCallback` in lists; `React.lazy` for routes.
- **Linting**: ESLint + Prettier; no-console in prod.
- **Smells to Target**:
  | Smell | Example | Refactor |
  |-------|---------|----------|
  | Duplication | Impact calc repeated in services/components. | Extract `calculatePersonaImpact(persona: PersonaImpact)` util. |
  | Long Method | `auditCreative` (200+ LOC). | Extract steps: `validateInput`, `runRules`, `scoreImpact`. |
  | Primitive Obsession | Raw strings for metrics. | Use `enum MetricType`. |
  | Large Components | `MainDashboard.tsx` (500 LOC). | Split: `DashboardHeader`, `MetricsGrid`. |

## Specific Workflows
### 1. Identify Smells
1. Run `searchCode` for patterns: `function.*\{[\s\S]{50,}` (long funcs), `\.map\([^)]*\.map` (nested maps).
2. `analyzeSymbols` on suspects: flag >5 params, unused exports.
3. `listFiles '**/components/*.tsx'`: Check LOC >200.
4. Prioritize: High-impact (services) > UI > utils.

### 2. Atomic Refactor Workflow
1. **Prep**: `readFile` target; run `npm test`; branch: `refactor/<file>-<smell>`.
2. **Refactor**:
   - Extract: New func/hook/component; move 20-50 LOC.
   - Rename: Align to conventions (e.g., `getData` → `fetchCreatives`).
   - Simplify: Replace ternaries with early returns.
3. **Verify**:
   - `npm test -- --coverage`: 100% unchanged.
   - Manual: Snapshot diffs, perf audit.
   - Types: `tsc --noEmit`.
4. **Commit**: `<file>: refactor <smell> (no-func-changes)`.
5. Repeat until clean.

### 3. Performance Refactor
1. Profile: Chrome DevTools or `npm run analyze`.
2. Target re-renders (WhyDidYouRender), slow services.
3. Apply: Memoize selectors, virtualize lists (`react-window`).
4. Benchmark before/after.

### 4. Cross-Cutting Refactors
- **Types**: Audit `types.ts`; add discriminants to unions.
- **Tests**: Co-locate; refactor brittle mocks to factories.
- **Docs**: Update `docs/architecture.md` with new structure diagrams.

## Best Practices (Codebase-Derived)
- **Incremental**: <100 LOC/commit; rebase often.
- **Test-Driven**: TDD for extracts; never delete tests.
- **Immutable**: Services pure; avoid mutating props.
- **Hooks Custom**: Share logic via `use*` (e.g., `useAuditResults`).
- **Async**: `async/await`; abort signals.
- **Avoid**: Classes, `any`, inline styles.
- **Tools**: Use `eslint --fix`, `prettier --write`; VSCode extensions match repo.

## Key Project Resources
- **Docs**: [README.md](../docs/README.md), [architecture.md](../docs/architecture.md).
- **Agents**: [AGENTS.md](../../AGENTS.md).
- **Workflow**: [development-workflow.md](../docs/development-workflow.md).
- **Tests**: `npm run test`; patterns in `tests/setup.ts`.

## Collaboration Checklist
1. Ping maintainer on smells found.
2. Link PRs: Review #open impacting area.
3. Update docs (e.g., `glossary.md` for new types).
4. Log metrics: Smells fixed, coverage delta.

## Hand-off Notes Template
```
**Outcomes**: Refactored X files; Y% better metrics.
**Risks**: None (tests green).
**Follow-ups**: Perf test on prod-like data; review by QA.
**Changelog**: Added `useOptimizedImpact`; extracted 5 utils.
```
