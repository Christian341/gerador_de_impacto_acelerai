# Testing Strategy

This document outlines how quality is maintained in the **Simulador de Impacto - Auditoria de Criativos** codebase, a React TypeScript application for auditing creative content impact using AI services like Gemini. Testing ensures reliability across UI components (e.g., `ReportDashboard`, `HeatmapView`, `DocumentReviewView`), services (e.g., `geminiService`), and types (e.g., `AgentFeedback`, `AnalysisResult`).

The project uses **Vitest** (or Jest, inferred from standard React TS setups) with **React Testing Library** for unit and integration tests. No end-to-end tests are implemented yet. Tests follow naming conventions: `{filename}.test.tsx` colocated with source files.

## Test Types

### Unit Tests
- **Framework**: Vitest/Jest + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`).
- **Focus**: Isolated testing of components, hooks, utilities, and pure functions.
  - Render components like `<ReportDashboard />` and assert rendered output based on props (e.g., `ReportDashboardProps`).
  - Test type utilities and validators from `types.ts` (e.g., `AgentFeedback`, `PersonaImpact`).
- **File Naming**: `{component}.test.tsx` (e.g., `ReportDashboard.test.tsx` next to `components/ReportDashboard.tsx`).
- **Example**:
  ```tsx
  // components/ReportDashboard.test.tsx
  import { render, screen } from '@testing-library/react';
  import { ReportDashboard } from './ReportDashboard';

  test('renders dashboard with analysis results', () => {
    const mockResults: AnalysisResult[] = [{ /* mock data */ }];
    render(<ReportDashboard results={mockResults} />);
    expect(screen.getByText('Analysis Complete')).toBeInTheDocument();
  });
  ```

### Integration Tests
- **Scenarios**: Component + service interactions (e.g., `DocumentReviewView` calling `geminiService`).
- **Tooling**: `jest.mock()` or **MSW** (`mswjs`) for mocking API calls to Gemini.
  - Mock `geminiService` responses returning `AgentFeedback` or `Message[]`.
- **File Naming**: `{integration}.integration.test.tsx`.
- **Example**:
  ```tsx
  // services/geminiService.integration.test.ts
  vi.mock('./geminiService');
  import { analyzeCreative } from './geminiService';

  test('integrates with Gemini API', async () => {
    const mockFeedback: AgentFeedback = { /* mock */ };
    (analyzeCreative as jest.Mock).mockResolvedValue(mockFeedback);
    const result = await analyzeCreative('test creative');
    expect(result).toMatchObject(mockFeedback);
  });
  ```

### End-to-End (E2E) Tests
- **Status**: Not implemented.
- **Planned**: Use **Playwright** or **Cypress** for user flows (e.g., upload creative → AI analysis → view heatmap in `HeatmapView`).
- **Environment**: Requires mocked Gemini API keys and a test database if added.
- **Setup Command**: `npx playwright test` (post-installation).

## Running Tests

- **All Tests**: `npm run test` (runs Vitest/Jest in CI-friendly mode).
- **Watch Mode** (local dev): `npm run test -- --watch` (reruns on file changes).
- **Coverage**: `npm run test -- --coverage` (generates `coverage/` report; aim for >80% lines/functions).
  - View HTML report: Open `coverage/lcov-report/index.html`.
- **Specific File**: `npm run test components/ReportDashboard.test.tsx`.
- **Type Check**: `npm run type-check` (ensures TS types like `AppTab` are valid).

Update `package.json` scripts if using Vitest:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Quality Gates

Enforced via CI/CD (e.g., GitHub Actions):
- **Coverage**: ≥80% statements, branches, functions, lines (configured in `vitest.config.ts` or `jest.config.js`).
- **Linting**: `npm run lint` (ESLint with `@typescript-eslint` parser; fixes with `--fix`).
- **Formatting**: Prettier (`npm run format`); enforce via `.prettierrc` and Husky pre-commit hook.
- **TypeScript**: `tsc --noEmit` must pass.
- **Merge Requirements**:
  | Gate | Command | Threshold |
  |------|---------|-----------|
  | Tests | `npm run test -- --coverage` | 80% coverage |
  | Lint | `npm run lint` | 0 errors |
  | Types | `npm run type-check` | Pass |

Example Husky setup (`.husky/pre-commit`):
```bash
npm run lint -- --fix && npm run type-check && npm run test -- --watch=false
```

## Troubleshooting

- **Flaky Tests**: None reported. Watch for async Gemini mocks—use `waitFor` from RTL:
  ```tsx
  await waitFor(() => expect(screen.getByText('Loaded')).toBeInTheDocument());
  ```
- **Long-Running Tests**: Mock external services (`geminiService`) to avoid real API calls. Use `vi.useFakeTimers()` for timeouts.
- **Environment Quirks**:
  - **Node Version**: Use ≥18 (`.nvmrc`).
  - **Coverage Ignores**: Add to `vitest.config.ts`:
    ```ts
    coverage: {
      exclude: ['node_modules', 'docs', 'types.ts'] // Skip docs/types
    }
    ```
  - **Windows Paths**: Use `cross-env` if path issues arise.
- **No Tests Found?**: Run `npm init vitest` to scaffold. Add first test for `App.tsx`.

## Related Files
- [types.ts](types.ts): Test exported types (`AgentFeedback`, `AnalysisResult`).
- [App.tsx](App.tsx): Entry point; test tab switching (`AppTab`).
- [package.json](package.json): Scripts and dev deps (`vitest`, `@testing-library/react`).
- [vitest.config.ts](vitest.config.ts) or [jest.config.js](jest.config.js): Config coverage/plugins.

For contributions: Add tests for new features (e.g., `PersonaImpact` handling). See [components/ReportDashboard.tsx](components/ReportDashboard.tsx) for patterns.
