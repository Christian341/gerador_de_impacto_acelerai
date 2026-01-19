# Documentation Writer Agent Playbook

## Mission
The Documentation Writer agent ensures the codebase is accompanied by clear, up-to-date, and user-friendly documentation. Engage this agent whenever new features are added, code is refactored, APIs change, or gaps in documentation are identified (e.g., via code reviews or issues labeled "docs"). It supports developers, auditors, and end-users by documenting UI components like DocumentReviewView, data models (e.g., PersonaImpact, AnalysisResult), workflows for creative audits, and integration points.

## Responsibilities
- Generate and maintain Markdown documentation in `/docs/`
- Add JSDoc-style comments to TypeScript/TSX files (e.g., components, services, types)
- Update root `README.md` and agent-specific files (e.g., `agents/README.md`)
- Document testing patterns, data flows, and domain concepts (e.g., creative impact simulation)
- Create examples, diagrams, and API references derived from actual code
- Review and improve existing docs for clarity and completeness

## Key Areas of Focus
Focus on these files and directories, prioritized by impact:

### Core Documentation Files
| File/Path | Purpose |
|-----------|---------|
| `docs/README.md` | Documentation index and quick-start guide |
| `docs/project-overview.md` | High-level app description: Creative Impact Simulator for auditing ad creatives, simulating persona impacts |
| `docs/architecture.md` | System architecture: React frontend (`components/`), services (`services/`), types (`types.ts`) |
| `docs/development-workflow.md` | Setup, build, run, and CI/CD instructions |
| `docs/testing-strategy.md` | Unit/integration tests in `tests/`, patterns (e.g., React Testing Library) |
| `docs/glossary.md` | Domain terms: "PersonaImpact", "AnalysisResult", "Creative Audit" |
| `docs/data-flow.md` | Flows: Document upload → Review (DocumentReviewView) → AI Analysis → Impact Report |
| `docs/security.md` | Compliance for audit tools (e.g., data handling in reviews) |
| `docs/tooling.md` | VS Code extensions, npm scripts, linting |
| `README.md` (root) | Project overview, installation, usage for "simulador-de-impacto---auditoria-de-criativos" |
| `AGENTS.md` | Agent knowledge base, including this playbook |
| `agents/README.md` | Agent handbooks and collaboration guidelines |
| `CONTRIBUTING.md` | Contribution workflow, doc standards |

### Code Files Requiring Inline Documentation
| File/Path | Purpose | Documentation Needs |
|-----------|---------|---------------------|
| `components/DocumentReviewView.tsx` | Main UI for reviewing creatives/documents; props: `DocumentReviewViewProps` | JSDoc for component, props interface, usage examples, event handlers |
| `types.ts` | Core interfaces: `AgentFeedback`, `PersonaImpact`, `AnalysisResult`, `Message` | Full JSDoc for each type, relationships (e.g., how `PersonaImpact` feeds into `AnalysisResult`) |
| `components/` (all *.tsx) | 3+ React components for UI (reviews, simulations, reports) | Inline comments for complex logic, prop tables |
| `services/` | Backend logic: analysis services, impact simulation, API calls | Function docs, error handling, input/output schemas |
| `commands/` | CLI or script commands for audits/simulations | Usage docs, flags, examples |
| `tests/` | Test suites matching components/services | Coverage notes, mocking patterns |
| `index.tsx` | App entry point: routing, providers | High-level flow comments |

## Codebase Conventions (Derived from Analysis)
- **TypeScript Strict**: All symbols use interfaces/types (e.g., `DocumentReviewViewProps`). Document with `@param`, `@returns`, examples.
- **React Patterns**: Functional components with hooks. Use code blocks in docs: ````tsx ... ````.
- **Naming**: PascalCase components/interfaces, camelCase functions. Consistent with "Impact", "Review", "Analysis".
- **No Existing JSDoc**: Add comprehensive comments to `types.ts` and components.
- **Markdown Style**: H1-H3 headings, tables for props/APIs, Mermaid diagrams for flows, fenced code blocks.
- **Examples**: Always include runnable snippets, e.g., using `DocumentReviewView` with sample props.
- **i18n**: Portuguese/English mix (repo name); document both.

## Specific Workflows and Steps

### 1. New Feature Documentation
1. Read changed files: `readFile(path)` for context.
2. Identify touchpoints: Update `docs/project-overview.md`, add section to relevant doc (e.g., `data-flow.md`).
3. Add inline docs: JSDoc to new symbols/functions.
4. Write examples: Copy-paste code snippets with props.
5. Diagram flows: Use Mermaid in Markdown.
6. Validate: Link to code, preview Markdown.
7. PR: Update `docs/README.md` index.

### 2. Code Change / Refactor Updates
1. `analyzeSymbols(file)`: Note prop/type changes (e.g., `DocumentReviewViewProps`).
2. `searchCode('DocumentReviewView')`: Find usages.
3. Update comments in source.
4. Propagate to docs: e.g., `AnalysisResult` changes → `glossary.md`, `data-flow.md`.
5. Deprecations: Add notes with migration guides.

### 3. Full Docs Audit
1. `getFileStructure()`: List all .md, .tsx.
2. `listFiles('**/*.ts*')`: Prioritize components/services.
3. Gap analysis: Undocumented symbols → add JSDoc.
4. Standardize: Ensure all docs have TOC, examples.
5. Generate API reference: Table of key interfaces from `types.ts`.

### 4. README Enhancement
1. Structure: Badge → Overview → Quickstart → Screenshots (DocumentReviewView) → Links to docs/.
2. Usage: `npm install && npm start` → simulate creative audit.

## Best Practices (Codebase-Derived)
- **User-Centric**: Assume auditor/user knows marketing, not code. Explain "PersonaImpact" simulation first.
- **Visuals**: Embed UI screenshots of `DocumentReviewView`; Mermaid for data flow (upload → AI → report).
- **Examples Always**: 
  ```tsx
  <DocumentReviewView
    documentId="creative-123"
    onFeedback={handleAgentFeedback}
    analysis={sampleAnalysisResult}
  />
  ```
- **Versioned**: Link changelogs to docs updates.
- **Searchable**: Use consistent terms: "creative audit", "impact simulation".
- **Concise**: Bullet points/tables > paragraphs.
- **Test-Driven Docs**: Run tests (`tests/`), document assertions as examples.

## Key Symbols to Document
From `types.ts`:
- **`AgentFeedback`**: Interface for AI agent responses in reviews.
- **`PersonaImpact`**: Impact metrics per persona (e.g., engagement score).
- **`AnalysisResult`**: Full audit output: feedback + impacts.
- **`Message`**: Chat/review messages.

## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area (e.g., component changes).
3. Update the relevant doc section listed above.
4. `searchCode()` for related code, ensure consistency.
5. Capture learnings back in `docs/README.md`.
6. Tag PR with "docs".

## Hand-off Notes Template
- **Outcomes**: Docs updated for [feature/files]; added JSDoc to [symbols].
- **Risks**: [e.g., Undocumented services/ if not analyzed].
- **Follow-ups**: Review `tests/` coverage docs; add screenshots to `project-overview.md`.
