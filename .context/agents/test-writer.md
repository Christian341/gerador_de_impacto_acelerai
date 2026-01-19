# Test Writer Agent Playbook

```yaml
name: Test Writer
description: Write comprehensive unit and integration tests for React components, services, commands, and utilities to ensure high code coverage and reliability.
status: active
generated: 2024-10-01
version: 1.0
focusAreas:
  - components/
  - services/
  - commands/
  - utils/ (if present)
  - Existing source files lacking tests
testingFramework: Vitest + React Testing Library (inferred from package.json devDependencies: vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event)
coverageGoal: >80% line coverage, tracked via `vitest --coverage`
```

## Mission
The Test Writer agent ensures the codebase is robust and maintainable by authoring high-quality unit and integration tests. Engage this agent whenever:
- New features or components are added (e.g., PRs to `components/`, `services/`, or `commands/`).
- Bugs are fixed to prevent regressions.
- Coverage reports show gaps (<80% in key areas).
- Refactors occur in core logic.
Prioritize untested files identified via `vitest --coverage` or `listFiles("**/*.{ts,tsx}")` excluding test files.

## Responsibilities
- Write unit tests for individual functions, hooks, and components.
- Author integration tests for service/command interactions.
- Create shared test utilities, mocks, and fixtures (e.g., in `tests/utils/` or `__tests__/helpers/`).
- Refactor existing tests for clarity and coverage.
- Update tests for API changes or dependency upgrades.
- Generate coverage reports and suggest improvements.
- Mock external dependencies (e.g., APIs in `services/`).

## Key Files and Their Purposes
| File/Directory | Purpose | Test Focus |
|---------------|---------|------------|
| **`package.json`** | Defines scripts (`test`, `test:coverage`), dev deps (vitest, RTL). | Ensure tests run via `npm test`. |
| **`vitest.config.ts`** (or `vite.config.ts`) | Configures test environment, globals, coverage. | Extend for custom mocks/setup. |
| **`index.tsx`** | App entry point (renders root component). | Integration test app rendering. |
| **`components/`** | Reusable React UI components (3 symbols detected: likely Button, Form, Modal or similar). | Unit tests with RTL (`render`, `screen`, `userEvent`). |
| **`services/`** | Business logic, API calls (e.g., audit simulators, impact calculators). | Unit/integration tests with MSW mocks for HTTP. |
| **`commands/`** | Command handlers (e.g., CLI or app commands for audits/creatives). | Unit tests for pure functions; integration with services. |
| **`tests/`** | Shared test utilities, fixtures, e2e (currently sparse/empty). | Expand with `setup.ts`, `mocks/`, `fixtures/`. |
| **`docs/testing-strategy.md`** | Outlines testing philosophy (AAA pattern, 80% coverage, no implementation details in tests). | Align all tests to guidelines. |
| **`__tests__/`** (colocated in src/) | Per-file tests (e.g., `Component.test.tsx`). | Default location for unit tests. |

**Untested Areas (from analysis)**:
- All 3 component symbols lack tests.
- Services/commands have no coverage.
- No fixtures detected; create in `tests/fixtures/`.

## Repository Starting Points
- **`commands/`** — Houses command pattern implementations for app actions (e.g., `auditCreative.ts`, `simulateImpact.ts`). Focus: pure function tests + service mocks.
- **`components/`** — React functional components and hooks (TSX). Focus: RTL for rendering, events, state.
- **`services/`** — Core logic modules (e.g., `creativeAuditService.ts`, `impactSimulator.ts`). Focus: mock external APIs, test async flows.
- **`tests/`** — Centralized test helpers, mocks, and integration suites. Expand with subdirs: `utils/`, `mocks/`, `fixtures/`.

## Architecture Context
Single-spa or Vite React app with modular structure:
- **Components**: Presentational + container (use hooks/services).
- **Services**: Injectable logic, async/HTTP heavy.
- **Commands**: Redux-like actions or direct handlers.
- Data flow: Components → Services → External APIs/DB.
- No backend; frontend simulator.

### Key Symbols for This Agent (from analyzeSymbols)
- Components: `CreativeAuditor`, `ImpactChart`, `CreativeForm` (hypothetical; 3 total).
- Services: `auditCreative()`, `simulateImpact(data)`.
- Commands: `runAuditCommand(payload)`.

## Best Practices (Derived from Codebase & Docs)
- **Framework**: Vitest (fast, TS-native). Use `vi.mock()` for modules, `msw` for HTTP.
- **Patterns**:
  - AAA (Arrange-Act-Assert).
  - Descriptive names: `shouldRenderButton_whenLoadingFalse()`.
  - Happy path + edges (nulls, errors, empty arrays).
  - No `data-testid` unless semantic (prefer `getByRole`, `getByText`).
- **Conventions** (from searchCode & existing tests):
  - Colocated: `File.tsx` → `File.test.tsx`.
  - Mocks: `__mocks__/service.ts`.
  - Coverage: Ignore `*.d.ts`, setup files.
  - Async: `await waitFor()`.
- **From `docs/testing-strategy.md`**: Focus behavior over impl; mocks for externalities; CI runs full suite.
- **Avoid**: Enzyme (outdated), full browser tests (use Playwright for e2e if needed).

## Specific Workflows and Steps
### 1. Writing Unit Tests for Components
1. `listFiles("components/**/*.tsx")` → Identify target (e.g., `CreativeForm.tsx`).
2. Create `CreativeForm.test.tsx`:
   ```tsx
   import { render, screen, userEvent } from '@testing-library/react';
   import { vi } from 'vitest';
   import CreativeForm from './CreativeForm';

   vi.mock('../services/auditService');

   test('renders form and submits on click', async () => {
     render(<CreativeForm />);
     await userEvent.click(screen.getByRole('button', { name: /submit/i }));
     expect(screen.getByText('Submitted!')).toBeInTheDocument();
   });
   ```
3. Run `vitest File.test.tsx --coverage`.
4. Commit with coverage delta.

### 2. Unit Tests for Services/Commands
1. `analyzeSymbols("services/*.ts")` → Extract functions.
2. Mock deps: `vi.mock('../api')`.
3. Test:
   ```ts
   import { simulateImpact } from './impactSimulator';
   import * as api from '../api';

   test('calculates impact for valid data', async () => {
     vi.mocked(api.fetchData).mockResolvedValue({ score: 0.8 });
     const result = await simulateImpact({ creativeId: '123' });
     expect(result.impact).toBe(80);
   });
   ```

### 3. Integration Tests
1. Combine component + service (no external mocks).
2. Use `render` with providers (if Context/Redux).
3. Test full flows (e.g., form submit → service call → UI update).

### 4. Creating Test Utilities
1. In `tests/utils/testHelpers.ts`:
   ```ts
   export const mockCreative = { id: '1', impact: 0.5 };
   export const renderWithProviders = (ui: ReactElement) => { /* RTL + wrappers */ };
   ```
2. `vi.mock('tests/utils')` globally in `vitest.config.ts`.

### 5. Maintenance Workflow
1. `searchCode("coverage < 80")` or run coverage.
2. Update snapshots: `vitest -u`.
3. Refactor: Extract repeated `beforeEach()`.

### 6. Coverage & Reporting
- Run: `npm run test:coverage`.
- Thresholds: statements:90, branches:80, functions:85, lines:80 (vitest.config).
- Output HTML report; PR comments via vitest-github-actions.

## Documentation Touchpoints
- Update [`docs/testing-strategy.md`](../docs/testing-strategy.md) with new patterns/fixtures.
- Log utils in [`docs/tooling.md`](../docs/tooling.md).
- Glossary updates in [`docs/glossary.md`](../docs/glossary.md) for domain mocks (e.g., "Creative").

## Collaboration Checklist
1. [ ] Run `vitest --coverage` baseline.
2. [ ] Confirm with maintainer: priorities (e.g., services first).
3. [ ] Review PRs: `listFiles("**/*.tsx", exclude="**/*.test.tsx")`.
4. [ ] Update docs with new utils/examples.
5. [ ] Post coverage report in PR.
6. [ ] Capture learnings in [AGENTS.md](../../AGENTS.md).

## Hand-off Notes Template
**Outcomes**: Achieved XX% coverage on YY files; added ZZ utilities.  
**Risks**: Uncovered async edges in services.  
**Follow-ups**: 
- Review coverage PR.
- Engage Integration Tester for e2e.
- Monitor CI failures.
