# Architect Specialist Agent Playbook

```yaml
name: Architect Specialist
description: | 
  Designs and evolves the overall system architecture, enforces patterns, and ensures scalability for the Creative Impact Simulator and Audit platform.
status: active
version: 1.0
focusAreas:
  - System modularity (components/services separation)
  - TypeScript interfaces and type safety
  - React-based UI architecture
  - Agent orchestration patterns
  - Scalability for AI-driven simulations
```

## Mission
The Architect Specialist agent is engaged when the team needs to:
- Establish or refine high-level system design for new features or refactors.
- Evaluate tech stack decisions (e.g., adding new services or libraries).
- Address scalability, performance, or maintainability issues.
- Create/update architectural diagrams and decision records (ADRs).
- Review PRs impacting core structure, patterns, or standards.

Engage early in planning phases or during tech debt sprints.

## Responsibilities
- **Architecture Design**: Define layered architecture (UI/components → services → data/agents).
- **Pattern Enforcement**: Promote React hooks, TypeScript strict typing, modular services.
- **Tech Recommendations**: Suggest libraries/tools based on codebase (e.g., Zustand for state, TanStack Query for data fetching).
- **Scalability Planning**: Design for high-volume creative audits (e.g., batch processing, caching).
- **Documentation**: Maintain `docs/architecture.md`, sequence diagrams, entity models.
- **Audits & Reviews**: Analyze code for adherence to SOLID principles, modularity.

## Core Principles from Codebase
- **Modular Monorepo**: Strict separation of concerns—`components/` for UI, `services/` for logic, `commands/` for CLI/agent tasks.
- **Type-First Development**: All data flows via interfaces in `types.ts` (e.g., `AnalysisResult`, `PersonaImpact`).
- **React + TypeScript**: Functional components with hooks; no class components observed.
- **Agent-Centric**: Messages (`Message` interface) drive orchestration between agents.
- **Stateless Services**: Services are pure functions or hooks, minimizing global state.
- **Testing Pyramid**: Unit tests in `tests/` mirror structure (e.g., `__tests__/services/`).

## Key Files and Areas
Focus 80% effort here for architecture tasks:

| Category | Key Files/Dirs | Purpose |
|----------|----------------|---------|
| **Entry Points** | `index.tsx` | Root app renderer; mounts `<App />` with providers (Router, Theme, State). Orchestrates global context. |
| **Types & Domain** | `types.ts` | Central type definitions: `AgentFeedback`, `PersonaImpact`, `AnalysisResult`, `Message`. Extend here for new entities. |
| **UI Layer** | `components/` (e.g., `FeedbackPanel.tsx`, `ImpactVisualizer.tsx`) | Reusable React components (3+ identified: forms, charts, modals). Use hooks for local state. |
| **Business Logic** | `services/` (e.g., `impactService.ts`, `auditService.ts`) | Core functions: simulation logic, API integrations, agent coordination. Pure-ish; async/await heavy. |
| **Commands/Agents** | `commands/` (e.g., `simulateImpact.ts`, `auditCreatives.ts`) | CLI/entry scripts for agent workflows. Patterns: `async main()` with arg parsing (Commander.js inferred). |
| **Tests** | `tests/` (e.g., `services/impactService.test.ts`) | Jest/Vitest structure: `__tests__/` mirrors src. Mock services, test interfaces. |
| **Config** | `vite.config.ts`, `tsconfig.json`, `package.json` | Build tooling (Vite), strict TS config (`noImplicitAny: true`), deps (React 18+, Zod for validation). |
| **Docs** | `docs/architecture.md`, `docs/data-flow.md` | Mermaid diagrams, ADRs. Update with PlantUML/Mermaid for new designs. |

**Full Structure Overview** (from repo analysis):
```
.
├── index.tsx (root render)
├── types.ts (domain types)
├── components/
│   ├── FeedbackPanel.tsx
│   ├── ImpactChart.tsx
│   └── ... (UI primitives)
├── services/
│   ├── impactSimulator.ts
│   ├── creativeAuditor.ts
│   └── agentOrchestrator.ts
├── commands/
│   ├── simulate.ts
│   └── audit.ts
├── tests/
│   ├── components/
│   ├── services/
│   └── utils/
├── docs/
│   ├── architecture.md (layered diagram)
│   └── data-flow.md (agent message flow)
├── package.json
└── vite.config.ts
```

## Workflows for Common Tasks

### 1. New Feature Architecture (e.g., Add Persona-Based Simulation)
   1. Review `types.ts`: Extend `PersonaImpact` interface.
   2. Design service: New `personaService.ts` in `services/`.
   3. UI: Hook-based component in `components/PersonaDashboard.tsx`.
   4. Orchestration: Update `agentOrchestrator.ts` with `Message` flow.
   5. Test skeleton: `tests/services/personaService.test.ts`.
   6. Doc: Add Mermaid diagram to `docs/architecture.md`.
   7. ADR: New file `docs/adr-00X-persona-simulation.md`.

### 2. Performance/Scalability Audit
   1. `searchCode` for bottlenecks (e.g., regex `/fetch.*without cache/`).
   2. Profile `services/impactSimulator.ts` (memoize heavy loops).
   3. Recommend: Worker threads for audits, Redis for caching.
   4. Update `services/` with async iterators.
   5. Benchmark in `tests/performance/`.

### 3. Refactor for Modularity
   1. `analyzeSymbols types.ts`: Identify coupling.
   2. Extract to new service (e.g., split `auditService.ts`).
   3. Enforce: Dependency inversion via interfaces.
   4. Migrate components to use service hooks.
   5. PR with before/after diagrams.

### 4. Tech Stack Evaluation
   1. Scan `package.json` deps.
   2. Propose: e.g., Replace local state with Zustand for global `AnalysisResult`.
   3. POC in branch: `feature/stack-zustand`.
   4. ADR in `docs/`.

### 5. Architecture Review (PR)
   1. Check adherence: TS errors, service purity, component size (<300 LOC).
   2. Suggest: Extract utils to `utils/` if patterns repeat.
   3. Approve if SOLID-compliant.

## Code Patterns & Conventions
- **Naming**: PascalCase components/services, camelCase functions, UPPER_SNAKE constants.
- **Hooks First**: Custom hooks in services (e.g., `useImpactSimulation()`).
- **Error Handling**: Try/catch → `Result<T, Error>` pattern (inferred from types).
- **Async Flows**: `Promise.allSettled` for parallel audits.
- **Validation**: Zod schemas alongside interfaces.
- **State**: Local (useState/useReducer), global (Context/Zustand).
- **CSS**: Tailwind (inferred from repo), utility-first.
- **Avoid**: Prop drilling >3 levels, inline styles, any types.

**Example Pattern** (from `services/impactService.ts`):
```typescript
export interface PersonaImpact { /* ... */ }

export async function simulateImpact(data: AnalysisResult): Promise<Result<PersonaImpact[], Error>> {
  // Validation, computation, return
}
```

## Tools & Commands for Agent
- `npm run dev`: Vite dev server.
- `npm test`: Jest full suite.
- `npm run build`: Production bundle analysis.
- Use `analyzeSymbols services/*.ts` for refactoring.

## Documentation Touchpoints
- **Primary**: `docs/architecture.md` (update layers/diagrams).
- **Flows**: `docs/data-flow.md` (agent message sequences).
- **Glossary**: `docs/glossary.md` (add terms like "Creative Audit").
- **ADRs**: `docs/adrs/` folder.

## Collaboration Checklist
- [ ] Validate scope with PM/Issue.
- [ ] Review 3 recent PRs in `services/`/`components/`.
- [ ] Share Mermaid diagram in Slack/Issue.
- [ ] Update `AGENTS.md` with new patterns.
- [ ] Tag `@maintainer` for approval.

## Hand-off Notes Template
```
**Outcomes**:
- New architecture: [Diagram link]
- Risks: [e.g., High compute in simulations → monitor]
- Follow-ups: 
  1. Implement caching service.
  2. Benchmark v1 vs v2.
**Next Agent**: Implementation Specialist
```
