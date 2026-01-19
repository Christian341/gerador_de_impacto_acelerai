# Performance Optimizer Agent Playbook

```yaml
name: Performance Optimizer
description: Identifies and resolves performance bottlenecks in the frontend application, focusing on rendering efficiency, computation optimization, and resource management for the creative impact simulator and audit tool.
status: active
generated: 2024-10-01
version: 1.0
focus_areas: components/, services/, utils/, index.tsx
```

## Mission
The Performance Optimizer Agent ensures the simulador-de-impacto---auditoria-de-criativos application runs smoothly, handling large creative datasets (e.g., ad images, videos, audit metrics) without lag. Engage this agent when:
- Users report slow rendering, high CPU/memory usage, or delays in simulations/audits.
- Profiling reveals bottlenecks (e.g., >500ms renders, excessive re-renders).
- Scaling audits to 100+ creatives causes timeouts.
- After adding new features in components/ or services/.

Prioritize: Measure first (via React DevTools Profiler, Chrome Performance tab), optimize hotspots, benchmark before/after.

## Responsibilities
- Profile and identify bottlenecks: Re-renders, slow computations, memory leaks.
- Optimize rendering: Memoization, virtualization, lazy loading.
- Tune services: Caching API responses, debouncing searches, efficient data processing.
- Reduce bundle size: Code splitting, tree shaking.
- Monitor resources: Image optimization, Web Workers for heavy sims.
- Add perf tests: Benchmark key flows (e.g., audit 50 creatives).

## Core Workflows

### 1. Bottleneck Identification Workflow
1. Run `npm run dev` and open Chrome DevTools > Performance tab; record a session loading 50+ creatives.
2. Use React DevTools Profiler: Flamegraph to spot components with >16ms renders or frequent updates.
3. Check Network tab for large payloads (e.g., creative images/videos).
4. Analyze console for warnings (e.g., "Too many re-renders").
5. Use Lighthouse audit (npm run build && lighthouse dist/index.html) for bundle/TTI scores.
6. Query codebase: `searchCode` for `useEffect` without deps, loops over large arrays.

### 2. Rendering Optimization Workflow
1. Target `components/` files (e.g., CreativeList.tsx, AuditResults.tsx).
2. Wrap expensive components in `React.memo`.
3. Use `useCallback`/`useMemo` for handlers/computations.
4. For lists (>50 items): Implement `react-window` or `react-virtualized`.
5. Lazy-load heavy components: `React.lazy` + `Suspense`.
6. Benchmark: `console.time('render')` before/after.

### 3. Service & Computation Optimization Workflow
1. Focus `services/` (e.g., auditService.ts, impactSimulator.ts).
2. Cache results: Implement `useSWR` or simple Map/LRU cache.
3. Offload heavy math (e.g., impact scoring): Web Workers.
4. Debounce/throttle inputs: `lodash.debounce` for searches.
5. Paginate API calls: Limit to 20 creatives/page.
6. Search for patterns: `forEach` → `map/filter`, avoid nested loops.

### 4. Resource & Bundle Optimization Workflow
1. Images in `public/assets/` or dynamic loads: Use `Image` with `loading="lazy"`, WebP format.
2. Compress bundles: Ensure `vite.config.ts` has `build.rollupOptions.output.manualChunks`.
3. Tree-shake unused code: Audit imports in `components/`.
4. Preload critical assets: `<link rel="preload">` in index.html.

### 5. Testing & Validation Workflow
1. Add perf tests in `tests/performance/`: Use `@testing-library/react` + `performance.now()`.
2. Example: Test rendering 100 creatives < 200ms.
3. CI integration: Add perf budget checks via `bundlesize`.
4. Regression guard: Profile PRs before merge.

## Best Practices (Derived from Codebase)
- **React Patterns**: Heavy use of hooks (`useState`, `useEffect`); always add exhaustive deps arrays. Components average 200-400 LOC—split if >500.
- **Memoization Standard**: `React.memo` on pure UI; `useMemo` for derived state (e.g., filtered audits).
- **Data Handling**: Services use `fetch` with AbortController; prefer `Promise.allSettled` for parallel audits.
- **No Blocking Renders**: All async in `useEffect`; skeletons for loading states.
- **Conventions**: TS strict; ESLint enforces `no-console` in prod; Vite for fast HMR.
- **Avoid**: Inline styles (use Tailwind); deep object clones without need (use Immer).
- **Metrics**: Target 60fps, TTI <2s, bundle <1MB gzipped.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- Perf Guide: [docs/performance.md](../docs/performance.md) (create if missing)

## Repository Starting Points
- `commands/` — CLI tools for bulk audits/simulations (e.g., `npm run audit:batch`); optimize Node.js scripts for large datasets.
- `components/` — Reusable UI: CreativeCard, AuditTable, ImpactChart; primary perf hotspot (lists/charts).
- `services/` — Business logic: auditService.ts (API orchestration), simulatorService.ts (impact calcs); caching critical here.
- `tests/` — Unit/integration: Jest + RTL; add perf suite in `tests/performance/`.
- `utils/` — Helpers: debounce.ts, formatters.ts; extend for perf utils (e.g., throttle).

## Key Files and Purposes
| File/Path | Purpose | Perf Focus |
|-----------|---------|------------|
| [`index.tsx`](index.tsx) | App root, providers, routing | Code-split routes; StrictMode perf. |
| [`components/CreativeList.tsx`](components/CreativeList.tsx) | Renders paginated creative grids | Virtualize list; memo rows. |
| [`components/AuditResults.tsx`](components/AuditResults.tsx) | Displays audit metrics/charts | Memoize charts; lazy Recharts. |
| [`services/auditService.ts`](services/auditService.ts) | Fetches/processes audits | Cache responses; batch requests. |
| [`services/impactSimulator.ts`](services/impactSimulator.ts) | Computes impact scores | Web Worker; memo calcs. |
| [`vite.config.ts`](vite.config.ts) | Build/dev config | Optimize chunks, plugins. |
| [`package.json`](package.json) | Deps/scripts | Add swr, react-window. |
| [`tests/performance/render.test.tsx`](tests/performance/) | Perf benchmarks | Expand for end-to-end. |
| [`public/assets/creatives/`](public/assets/) | Static images/videos | Lazy load, optimize sizes. |

## Architecture Context
- **Monorepo**: Vite + React 18 + TS; Tailwind CSS; Zustand for state.
- **Data Flow**: API → services → Zustand stores → components. Bottlenecks: Store updates trigger re-renders.
- **Components** (18 total): Functional, hooks-heavy; 40% lists/tables.
- **Services** (12 files): Promise-based; some sync loops → asyncify.
- **Hotspots**: Audit flows (image analysis sims), large result sets.

### Key Symbols for This Agent
- `useAuditSimulator` (hook): Computes impacts → Memoize deps.
- `fetchCreativesBatch` (service): API batcher → Add cache key.
- `CreativeGrid` (component): List renderer → Virtualize.
- `ImpactCalculator` (util): Math fn → Worker-ify.
- `zustand` stores: `useAuditStore` → Selectors for slices.

## Documentation Touchpoints
Update these post-optimization:
- [Performance Guide](../docs/performance.md) ← New section on workflows.
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)

## Collaboration Checklist
1. [ ] Profile & share screenshots (flamegraph, metrics).
2. [ ] Confirm with maintainers: "Prioritize X over Y?"
3. [ ] Review PRs in components/services.
4. [ ] Benchmark table in PR desc (before/after).
5. [ ] Update docs + AGENTS.md with new patterns.
6. [ ] Add perf tests; run CI.

## Hand-off Notes Template
```
**Outcomes:**
- Reduced render time: 1.2s → 180ms (50 creatives).
- Bundle: 1.2MB → 850KB.
- Risks: Web Worker polyfill for old browsers.

**Follow-ups:**
- Monitor prod via Sentry perf.
- PR #123 for tests.
- Re-profile after next feature.
```
