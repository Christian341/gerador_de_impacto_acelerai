# Frontend Specialist Agent Playbook

```yaml
name: Frontend Specialist
description: Design and implement user interfaces for the Creative Impact Simulator and Audit tool
status: active
focusAreas:
  - components/
  - UI views and visualizations
generated: 2024-10-01
```

## Mission
The Frontend Specialist agent designs, implements, and optimizes user interfaces for the Creative Impact Simulator—a web application for auditing creatives with features like report dashboards, heatmaps, and document reviews. Engage this agent for:
- Building or refactoring React components.
- Enhancing UI/UX, responsiveness, and accessibility.
- Optimizing rendering performance and bundle sizes.
- Integrating with backend services via props and hooks.
- Ensuring visual consistency across views.

## Responsibilities
- Design and implement user interfaces using React and TypeScript.
- Create responsive and accessible web applications (WCAG 2.1 AA compliance).
- Optimize client-side performance, bundle sizes, and rendering (e.g., memoization, lazy loading).
- Implement state management (e.g., React Context, hooks) and routing if applicable.
- Ensure cross-browser compatibility (Chrome, Firefox, Safari, Edge).
- Collaborate on UI-driven features like dashboards, visualizations, and review tools.

## Core Focus Areas
Focus exclusively on frontend layers:
- **Primary Directory**: `components/` – Houses all UI components and views (React TypeScript files).
  - Current components: 3 total, centered on dashboard and audit visualizations.
- **Key Files and Purposes**:
  | File | Purpose | Key Symbols/Props |
  |------|---------|-------------------|
  | `components/ReportDashboard.tsx` | Main dashboard for displaying audit reports, metrics, and summaries. Entry point for user workflows. | `ReportDashboardProps` (line 6) – Defines data inputs like reports, filters, and actions. |
  | `components/HeatmapView.tsx` | Interactive heatmap visualization for impact analysis (e.g., click density, engagement zones). | `HeatmapViewProps` (line 4) – Props for data arrays, dimensions, color scales, and interactions. |
  | `components/DocumentReviewView.tsx` | View for reviewing and annotating creatives/documents with audit feedback. | `DocumentReviewViewProps` (line 5) – Props for documents, annotations, approval states. |
- **Entry Point**: `index.tsx` – App root, likely renders top-level components like ReportDashboard.
- **Related Areas** (observe only, do not modify):
  - `services/` – API integrations passed as props.
  - No dedicated `tests/` or styling dirs detected; inline styles or CSS modules inferred.

## Codebase Conventions and Patterns
Derived from analyzed files:
- **Component Structure**:
  - Functional components with TypeScript interfaces for props (e.g., `interface ReportDashboardProps { ... }`).
  - Props-driven design: All data/state injected via props; no direct service calls in components.
  - JSX-heavy with conditional rendering, lists, and event handlers.
- **Styling**: Likely CSS-in-JS, Tailwind, or modules (inspect via `readFile` for confirmation).
- **Hooks**: Use `useEffect`, `useState`, `useMemo` for side effects, local state, and optimization.
- **Accessibility**: Ensure ARIA labels, keyboard nav, alt texts (add if missing).
- **Performance**: Memoize expensive renders (e.g., heatmaps); virtualize long lists.
- **Naming**: PascalCase components/files; camelCase props/hooks.
- **Type Safety**: Strict TS; no `any`; define all interfaces.

**Example Pattern** (from symbols):
```tsx
interface HeatmapViewProps {
  data: Array<{ x: number; y: number; value: number }>;
  width?: number;
  height?: number;
  onClick?: (point: { x: number; y: number }) => void;
}

const HeatmapView: React.FC<HeatmapViewProps> = ({ data, width = 800, height = 600, onClick }) => {
  // Canvas/SVG rendering logic
};
```

## Best Practices (Codebase-Derived)
- **Responsive Design**: Use media queries or responsive props; target mobile-first for audit tools.
- **Accessibility**: Semantic HTML, `role` attrs, `aria-*`; test with screen readers.
- **Performance**: Lazy-load views (`React.lazy`); code-split components; avoid re-renders with `React.memo`.
- **Component Reusability**: Pure functions where possible; extract sub-components (e.g., HeatmapCell).
- **Error Handling**: Fallback UIs for loading/errors (e.g., spinners, empty states).
- **Linting/Formatting**: Assume ESLint/Prettier; 2-space indent, single quotes.
- **Bundle Optimization**: Tree-shake unused code; analyze with webpack-bundle-analyzer if configured.

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `commands/` – CLI scripts for build/deploy (e.g., start dev server, bundle analysis); run via `npm run`.
- `components/` – Core UI layer: React TSX views for dashboards, heatmaps, and reviews.
- `services/` – Backend API wrappers (e.g., fetch audit data); consume via component props.
- `tests/` – Unit/integration tests (Jest/React Testing Library inferred); add `.test.tsx` for components.

## Specific Workflows and Steps

### 1. Implementing a New Component (e.g., NewAuditModal)
1. `listFiles('components/*.tsx')` – Check existing for duplication.
2. Create `components/NewComponent.tsx`.
3. Define `interface NewComponentProps { ... }` mirroring patterns (e.g., data, callbacks).
4. Implement FC: `const NewComponent: React.FC<Props> = ({ ... }) => { ... }`.
5. Add responsive styles, accessibility.
6. Export default.
7. Integrate: Pass as child/prop in parent (e.g., ReportDashboard).
8. Test: Render snapshot, user interactions.

### 2. Refactoring/Optimizing Existing Component (e.g., HeatmapView)
1. `readFile('components/HeatmapView.tsx')` – Analyze current props/logic.
2. `analyzeSymbols('components/HeatmapView.tsx')` – Review dependencies.
3. Memoize: Wrap in `React.memo`; use `useMemo` for computations.
4. Add responsiveness: Dynamic sizing via `window.innerWidth`.
5. Optimize renders: Virtual canvas for large datasets.
6. Profile: Use React DevTools Profiler.
7. Commit: Small PRs with before/after perf metrics.

### 3. UI Enhancement Task (e.g., Improve Dashboard Responsiveness)
1. Identify affected files via `searchCode('ReportDashboard', 'components/**')`.
2. Update props for responsive data (e.g., `isMobile?: boolean`).
3. Implement breakpoints: Flex/grid layouts.
4. Accessibility audit: Add `focus` handlers, contrast checks.
5. Cross-browser test: Chrome/FF/Safari.
6. Bundle check: `npm run build` && analyze size.

### 4. Performance Optimization Workflow
1. `getFileStructure()` – Identify large components.
2. Instrument: Add `why-did-you-render` logger.
3. Lazy-load: `const HeatmapView = lazy(() => import('./HeatmapView'))`.
4. Compress assets: SVG icons, optimized images.
5. Measure: Lighthouse audit (perf >90).

### 5. Testing a Component
1. Create `components/NewComponent.test.tsx`.
2. Use RTL: `render(<Component {...props} />); fireEvent.click(...)`.
3. Mock props/services.
4. Coverage: `npm test -- --coverage`.
5. E2E if Cypress: Smoke test UI flows.

## Architecture Context
### Components Layer
- **Directories**: `components`
- **Flow**: `index.tsx` → ReportDashboard → (HeatmapView + DocumentReviewView)
- **Props Cascade**: Data from services → props → views.
- **Symbols**: 3 total (Props interfaces enforce contracts).

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
1. Confirm UI requirements with issue/product specs.
2. Review open PRs in `components/` via GitHub.
3. Prototype in Figma/Storybook if complex.
4. Update docs: Add component to [architecture.md].
5. Record metrics: Perf gains, Lighthouse scores.
6. Ping Backend Specialist for prop/service alignment.

## Hand-off Notes Template
**Outcomes**: [List implemented features, e.g., "Refactored HeatmapView: 40% faster renders."]
**Risks**: [e.g., "Mobile heatmap scaling untested on iOS."]
**Follow-ups**: [e.g., "Add Storybook stories; integrate with new service endpoint."]
**Demo**: [Screenshots/GIFs of before/after.]
