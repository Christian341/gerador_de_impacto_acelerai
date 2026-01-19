# Feature Developer Agent Playbook

```yaml
name: Feature Developer
description: Implement new features according to specifications, ensuring seamless integration with the existing React/TypeScript codebase for the Creative Impact Simulator and Audit tool.
status: active
generated: 2024-10-01
focusAreas:
  - src/components
  - src/services
  - src/types.ts
  - src/tests
```

## Mission
The Feature Developer agent builds new features for the Creative Impact Simulator—a dashboard application for auditing creatives with visualizations like heatmaps, document reviews, and reports. Engage this agent when specifications require new UI components, services, data integrations, or business logic. It ensures features align with the app's architecture, maintaining performance, type safety, and test coverage.

## Responsibilities
- Analyze feature specs and map to codebase areas (e.g., new visualization → `components/HeatmapView.tsx` extension).
- Design and implement React functional components with TypeScript interfaces.
- Create or extend services for data fetching/processing (e.g., API calls for audit reports).
- Integrate features into entry points like `ReportDashboard.tsx`.
- Write unit/integration tests using patterns from `tests/`.
- Refactor for maintainability, adhering to existing hooks and utils.

## Core Workflows

### 1. Implementing a New UI Component (e.g., New View or Widget)
   **Steps:**
   1. Review spec for props/data needs; extend `types.ts` with new interfaces (e.g., `NewWidgetProps` mirroring `HeatmapViewProps`).
   2. Create `components/NewWidget.tsx`:
      - Use functional component: `const NewWidget = ({ data, onUpdate }: NewWidgetProps) => { ... }`.
      - Leverage existing patterns: `useEffect` for data fetching, memoization for perf.
      - Import shared hooks/utils from `hooks/` or `utils/`.
   3. Style with Tailwind/CSS modules matching dashboard (grid/flex layouts).
   4. Integrate: Export and add to parent like `ReportDashboard.tsx` via props drilling or context.
   5. Test: Add `tests/NewWidget.test.tsx` with RTL/Jest (render, user events, snapshots).
   6. Lint/test: `npm run lint && npm test`.

### 2. Adding a New Service or Business Logic (e.g., Audit API Integration)
   **Steps:**
   1. Define types in `types.ts` (e.g., `AuditResult extends AnalysisResult`).
   2. Create `services/auditService.ts`:
      - Use `axios` or `fetch` wrappers: `export const fetchAudits = async (id: string): Promise<AuditResult[]> => { ... }`.
      - Handle errors with custom hooks (e.g., `useQuery` from React Query if present).
   3. Hook-ify: `hooks/useAudit.ts` with `useEffect`/`useState`.
   4. Integrate into components: Pass service to views like `DocumentReviewView.tsx`.
   5. Test: Mock API in `tests/services/auditService.test.ts` (expect calls, responses).

### 3. Feature Integration and Refactoring
   **Steps:**
   1. Locate entry: Update `src/index.tsx` or `App.tsx` for routing/state.
   2. Use context/providers for shared state (e.g., `AuditContext`).
   3. Optimize: Memoize callbacks (`useCallback`), lists (`React.memo`).
   4. Edge cases: Loading spinners, empty states, errors (Toasts from `react-hot-toast` if used).
   5. E2E test if impacts flow: `tests/e2e/report-flow.test.ts`.

### 4. Full Feature Rollout Checklist
   | Step | Action | Verify |
   |------|--------|--------|
   | 1. Planning | Spec → PR description; list affected files. | Git diff preview. |
   | 2. Types | Update `types.ts`. | TS compiler passes. |
   | 3. Impl | Component/service/tests. | `npm run dev` visuals. |
   | 4. Tests | 80%+ coverage. | `npm test --watch`. |
   | 5. Docs | Update `docs/architecture.md`. | Links work. |
   | 6. Deploy | Branch/PR. | CI passes. |

## Best Practices (Derived from Codebase)
- **TypeScript First**: All props/services use interfaces (e.g., `ReportDashboardProps { reports: Report[]; onFilter: (f: Filter) => void; }`). Strict mode enabled.
- **Component Patterns**: Functional + Hooks. Props exhaustive (`satisfies` utility types). Colocate styles/types.
- **State Management**: Local `useState/useReducer`; Context for app-wide (e.g., user audits). No Redux unless scaled.
- **Data Flow**: Services → Hooks → Components. Async with Suspense or loading states.
- **Error Handling**: Try/catch in services; UI fallbacks (e.g., "No data available").
- **Performance**: `useMemo` for computations; Virtualize lists (react-window if large datasets).
- **Testing**: Jest + React Testing Library. Test behavior > snapshots. Mock services deeply.
- **Styling**: Tailwind classes (e.g., `grid grid-cols-3 gap-4`). Responsive (sm/md breakpoints).
- **Conventions**: PascalCase components, camelCase functions. ESLint/Prettier enforced.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `commands/` — CLI scripts for dev tools (e.g., data generation, build commands).
- `components/` — Reusable UI components and views (e.g., dashboards, heatmaps for audit visuals).
- `services/` — Business logic, API clients, data processors (e.g., creative analysis endpoints).
- `tests/` — Unit/integration/E2E tests organized by feature (e.g., `tests/components/`, `__mocks__/`).

## Key Files and Purposes
| File/Path | Purpose |
|-----------|---------|
| `src/index.tsx` | App entry: Renders root `<App />`, sets providers (Theme, QueryClient). |
| `components/ReportDashboard.tsx` | Main dashboard: Aggregates views, filters reports (`ReportDashboardProps`). |
| `components/HeatmapView.tsx` | Interactive heatmap for creative impact (`HeatmapViewProps`). |
| `components/DocumentReviewView.tsx` | Document auditing interface (`DocumentReviewViewProps`). |
| `src/types.ts` | Shared interfaces (e.g., `AgentFeedback`, `PersonaImpact`, `AnalysisResult`, `Message`). |
| `src/services/*` | API/data services (extend for new endpoints). |
| `tests/**/*.test.tsx` | Feature tests (mock patterns: `jest.mock('services/')`). |
| `docs/architecture.md` | Update for new flows. |

## Architecture Context
```
src/
├── components/     # Views: Dashboard → Heatmap/DocumentReview
├── services/       # Logic: Fetch/process audit data
├── hooks/          # Custom: useAuditData, useHeatmap
├── types.ts        # Core: AnalysisResult, Message
├── utils/          # Helpers: formatImpact, validateCreative
└── index.tsx       # Bootstrap
```
- **Data Flow**: API → Service → Hook → Component → UI (heatmaps/reports).
- **Tech Stack**: React 18+, TypeScript, Tailwind, Jest/RTL, Vite/Webpack.

## Key Symbols for This Agent
- `ReportDashboardProps` (`components/ReportDashboard.tsx:6`): { reports, filters, callbacks }
- `HeatmapViewProps` (`components/HeatmapView.tsx:4`): { data: HeatmapData[], onClick }
- `DocumentReviewViewProps` (`components/DocumentReviewView.tsx:5`): { docs: Document[], status }
- `AnalysisResult` (`types.ts:14`): Core audit output { score, insights }
- `PersonaImpact` (`types.ts:9`): { persona: string, impact: number }

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).
5. Tag @reviewer for UX/Perf review.

## Hand-off Notes
- **Outcomes**: Feature spec fully implemented, tests pass (coverage >80%), docs updated.
- **Risks**: Perf on large datasets (monitor with React DevTools); API changes (mock in tests).
- **Follow-ups**: QA testing, deploy to staging, monitor analytics for adoption. PR link: [TBD].
