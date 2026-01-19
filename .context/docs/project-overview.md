# Project Overview

A web-based **Creative Impact Simulator and Auditor** that leverages AI (Google Gemini) to analyze marketing creatives (ads, visuals, copy) for their projected impact on diverse personas. It generates persona-specific feedback, heatmaps of attention, and comprehensive audit reports to optimize campaigns before launch.

**Who benefits**: Marketing teams, creative agencies, advertisers, and growth hackers seeking data-driven insights to boost ad performance, reduce waste, and ensure inclusive messaging.

---
status: filled
generated: 2024-10-01
updated: 2024-10-01
---

## Quick Facts

- **Root path**: `C:\Users\Administradorr\Documents\códigos\simulador-de-impacto---auditoria-de-criativos (1)`
- **Primary languages detected**:
  - `.md` (23 files) — Extensive documentation.
  - `.ts` / `.tsx` (10 files) — TypeScript React app.
  - `.json` (5 files) — Configs and metadata.
  - `.html` (1 file) — Entry template.
- **Size**: Compact monorepo (~50 files), frontend-focused.
- **License**: Not specified (check `README.md`).

## Entry Points
- [`index.tsx`](index.tsx) — React root renderer mounting `App.tsx`.
- `npm run dev` — Vite dev server entry.

## Key Exports
**Interfaces (from [`types.ts`](types.ts))**:
- [`AgentFeedback`](types.ts#L2) — AI-generated feedback structure.
- [`PersonaImpact`](types.ts#L9) — Impact scores per persona.
- [`AnalysisResult`](types.ts#L14) — Full analysis output.
- [`Message`](types.ts#L31) — Chat/message format.

These types power all components and services.

## File Structure & Code Organization

```
.
├── App.tsx                          — Main app shell with tabbed navigation (`AppTab` type).
├── commands/                        — Placeholder for CLI commands (future extensibility, e.g., batch analysis scripts).
├── components/                      — Reusable React views:
│   ├── ReportDashboard.tsx          — Analytics dashboard with charts and summaries.
│   ├── HeatmapView.tsx              — Visual attention heatmaps.
│   └── DocumentReviewView.tsx       — Interactive creative review interface.
├── index.html                       — Vite HTML template with root `<div id="root">`.
├── index.tsx                        — Entry point: creates React root and renders `App.tsx`.
├── mcpcontext7.json                 — AI model context config (Gemini prompt tuning).
├── metadata.json                    — Project/app metadata (version, env).
├── package-lock.json                — NPM dependency lockfile (regenerate with `npm install`).
├── package.json                     — Dependencies, scripts (dev, build, test), and metadata.
├── playwright.config.ts             — E2E testing config for Playwright.
├── product_requirements_document.md — Functional specs and user stories.
├── project_backlog.md               — Task backlog and prioritization.
├── README.md                        — Quickstart, setup, and contribution guide.
├── services/                        — API integrations:
│   └── geminiService.ts             — Google Gemini AI client for analysis/feedback.
├── docs/                            — Living documentation (this file included).
│   ├── system_documentation.md      — Runtime behavior and internals.
│   ├── technical_architecture.md    — Diagrams and patterns.
│   └── ...                          — Workflow guides.
├── tests/                           — Playwright E2E tests and fixtures.
├── tsconfig.json                    — TypeScript compiler options (strict mode enabled).
├── types.ts                         — Shared interfaces/types for type safety.
└── vite.config.ts                   — Vite bundler config (React plugin, dev server).
```

**Patterns**:
- Functional components with hooks.
- Type-first design (all props typed).
- Single service layer for AI calls.

## Technology Stack Summary

- **Languages**: TypeScript (strict), JavaScript (via transpilation).
- **Runtime**: Browser (SPA).
- **Build Tooling**: Vite (fast HMR, optimized bundles).
- **Linting/Formatting**: ESLint/Prettier (inferred from `package.json`).
- **Testing**: Playwright (E2E browser automation).
- **AI**: Google Gemini API.

## Core Framework Stack

- **Frontend**: React 18+ (hooks-based, no class components).
  - **Patterns**: Component composition, context for state (e.g., analysis results), tabbed SPA routing (no React Router).
- **Data Layer**: In-memory state + async AI fetches (no persistent backend).
- **No Backend/Messaging**: Pure client-side; AI calls via `fetch`.

## UI & Interaction Libraries

- **Custom UI**: Tailwind CSS or vanilla styles (no heavy libs like MUI/AntD detected).
- **Charts/Visuals**: Likely Recharts or D3 (check `package.json`); heatmaps custom.
- **Accessibility**: Semantic HTML + ARIA (enforce in components).
- **Theming**: CSS variables (dark/light mode ready).
- **i18n**: None (PT-BR focus, English types).

## Development Tools Overview

- **CLIs**:
  | Script | Command | Purpose |
  |--------|---------|---------|
  | `dev` | `npm run dev` | Vite dev server (`http://localhost:5173`). |
  | `build` | `npm run build` | Production bundle (`dist/`). |
  | `preview` | `npm run preview` | Local prod preview. |
  | `test` | `npm run test` | Playwright E2E. |
  | `lint` | `npm run lint` | Code quality checks. |
- **IDE**: VS Code recommended (TS extensions).
- Link: [Tooling & Productivity Guide](./tooling.md) (TBD).

## Getting Started Checklist

1. **Clone & Install**: `git clone ... && npm ci` (uses `package-lock.json`).
2. **Env Setup**: Add `GEMINI_API_KEY` to `.env` for AI features.
3. **Run Dev**: `npm run dev` → Open `localhost:5173`.
4. **Test**: `npm run test` (headless) or `npx playwright test --ui`.
5. **Build**: `npm run build` → Inspect `dist/`.
6. **Review Docs**: [Product Requirements](./product_requirements_document.md), [Architecture](./technical_architecture.md).

## Next Steps

- **Positioning**: AI-powered pre-launch ad optimizer for Meta/Google campaigns.
- **Stakeholders**: Product: Marketing leads; Eng: Frontend devs.
- **External Links**:
  - [Gemini API Docs](https://ai.google.dev/gemini-api/docs).
  - [Playwright Guide](https://playwright.dev/docs/intro).
  - [Vite + React](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

**Contribute**: See `project_backlog.md`. Open issues for features like multi-file upload or persona customization.
