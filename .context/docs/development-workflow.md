# Development Workflow

This document outlines the day-to-day engineering process for the **Simulador de Impacto - Auditoria de Criativos** repository, a React-based dashboard application for analyzing creative content impact using AI agents (powered by Google Gemini). It integrates components like `ReportDashboard`, `HeatmapView`, `DocumentReviewView`, and types such as `AgentFeedback`, `AnalysisResult`, `PersonaImpact`, and `Message`.

## Branching & Releases

### Branching Model
- **Trunk-based development** with short-lived feature branches:
  - Main branch: `main` (protected, requires PR approvals).
  - Feature branches: `feat/<feature-name>` (e.g., `feat/gemini-integration`).
  - Hotfix branches: `hotfix/<issue>` for urgent production fixes.
  - Release branches: `release/vX.Y.Z` for stabilizing releases.
- Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc., to automate changelog generation and semantic versioning.
- Pull Requests (PRs) must target `main` and follow the [PR template](.github/pull_request_template.md) (if present).

### Releases
- **Cadence**: Weekly minor releases on Mondays; major releases quarterly.
- **Tagging**: Semantic versioning (`v1.2.3`) via `npm version <patch|minor|major>` and `git push --tags`.
- **Automation**: CI/CD via GitHub Actions (check `.github/workflows/` for deploy.yml, test.yml). Releases publish to npm or Vercel/Netlify for hosting.
- Post-release: Update changelog.md and create GitHub Release notes.

## Local Development

### Prerequisites
- Node.js >=18.x
- Git
- API Key for Google Gemini (set as `GEMINI_API_KEY` environment variable)

### Setup
```bash
# Clone and install
git clone <repo-url>
cd simulador-de-impacto---auditoria-de-criativos
npm install

# Copy env template
cp .env.example .env.local
# Edit .env.local with GEMINI_API_KEY=your-key
```

### Run Modes
| Command | Description | Default Port |
|---------|-------------|--------------|
| `npm run dev` | Development server with hot reload (Vite-based) | 5173 |
| `npm run build` | Production build (outputs to `dist/`) | - |
| `npm run preview` | Preview production build locally | 4173 |
| `npm run lint` | Run ESLint for code quality | - |
| `npm run lint:fix` | Auto-fix lint issues | - |
| `npm run test` | Run Vitest/Jest unit tests (coverage via `--coverage`) | - |
| `npm run test:ui` | Interactive test UI | - |
| `npm run type-check` | TypeScript type checking | - |

### Key Files for Local Dev
- `App.tsx`: Root app with tabs (`AppTab` type).
- `types.ts`: Core types (`AgentFeedback`, `AnalysisResult`, etc.).
- `services/geminiService.ts`: AI service calls.
- Components: `components/ReportDashboard.tsx`, `components/HeatmapView.tsx`, `components/DocumentReviewView.tsx`.

**Example dev workflow**:
```bash
npm run dev
# Open http://localhost:5173
# Edit components/ReportDashboard.tsx → hot reloads
```

### Debugging
- Use React DevTools and VS Code extensions (ES7 React/Redux snippets, Tailwind CSS IntelliSense).
- Console logs in `geminiService.ts` for AI responses.

## Code Review Expectations

### Checklist
- [ ] Passes `npm run lint && npm run type-check && npm run test`.
- [ ] Tests added/updated for new features (aim for 80% coverage).
- [ ] Types updated in `types.ts` if new `AgentFeedback` or `AnalysisResult` fields added.
- [ ] No console.logs in production code.
- [ ] Docs updated (e.g., this file or component READMEs).
- [ ] Cross-browser tested (Chrome, Firefox, Safari).
- [ ] Accessibility: ARIA labels on charts/heatmaps.

### Approvals
- **1 approving review** required (team lead or peer).
- **2 reviewers** requested via GitHub CODEOWNERS.
- No self-merges on `main`.
- Reference [AGENTS.md](../../AGENTS.md) for collaborating with AI agents during reviews (e.g., using `AgentFeedback` in PR comments).

### Common Pitfalls
- Ensure `GEMINI_API_KEY` is not committed (gitignored).
- Handle AI rate limits in `geminiService.ts`.

## Onboarding Tasks

### Week 1: Get Up to Speed
1. Run local dev server and explore `ReportDashboard` → Submit a sample creative for analysis.
2. Read [types.ts](src/types.ts) and trace `AnalysisResult` flow.
3. Fix a lint issue or add a test for `HeatmapView`.

### Starter Issues
- Label: `good first issue` or `help wanted` on GitHub Issues.
- Examples:
  - [#42](https://github.com/org/repo/issues/42): Add loading states to `DocumentReviewView`.
  - [#15](https://github.com/org/repo/issues/15): Improve `PersonaImpact` type docs.
- Dashboards: [GitHub Projects](https://github.com/orgs/.../projects/1), [Codecov Coverage](https://app.codecov.io/gh/...).

### Resources
- [Architecture Overview](docs/architecture.md)
- [API Runbook](docs/api-runbook.md)
- Slack/Discord: #dev-workflow channel
- Ask agents via [AGENTS.md](../../AGENTS.md) for code suggestions.

**Pro Tip**: Use `npm run dev` with `--open` flag (if supported) for instant browser launch. Happy coding! 🚀
