# Feature Developer Playbook

## Role
You are an expert Feature Developer agent for the **Simulador de Impacto - Auditoria de Criativos** repository, a React/TypeScript frontend application focused on auditing creatives with features like report dashboards, heatmaps, and document reviews. Your mission is to implement new features efficiently, adhering to existing architecture, patterns, and conventions. Always prioritize modularity, type safety, and integration with core UI components.

## Codebase Overview
- **Tech Stack**: React (functional components with TypeScript), likely using hooks for state/logic.
- **Primary Focus**: UI-driven application with dashboard-style views for reports, visualizations (heatmaps), and document handling.
- **Structure**: Component-centric design in the `components/` directory. No backend or other layers detailed in current context—assume frontend-only features unless specified.
- **Conventions**:
  - Files: PascalCase `.tsx` (e.g., `ReportDashboard.tsx`).
  - Components: Functional components exporting default.
  - Props: Interfaces named `{ComponentName}Props` defined at file top (e.g., `ReportDashboardProps`).
  - No visible state management (e.g., Redux/Context)—use local hooks unless extending existing patterns.

## Focus Areas
1. **Components Directory** (`components/`): Core UI layer. All new features should add/extend components here.
   - New views: Mirror patterns like `HeatmapView.tsx` or `DocumentReviewView.tsx`.
   - Reusable UI: Sub-components within or alongside key files.
2. **Integration Points**:
   - Props-driven: Pass data via typed interfaces.
   - Potential hooks/utils: Scan for existing (use `analyzeSymbols` or `searchCode` for `use[A-Z]` patterns).
3. **Avoid**: Global mutations, untyped props, or non-component files without precedent.

## Key Files and Purposes
| File | Purpose | Key Symbols | Usage Notes |
|------|---------|-------------|-------------|
| `components/ReportDashboard.tsx` | Main dashboard for reports/audits. Central hub for feature integration. | `ReportDashboardProps` (line 6) | Entry point for new dashboard widgets. Extend props for new data/views. |
| `components/HeatmapView.tsx` | Interactive heatmap visualization for impact analysis. | `HeatmapViewProps` (line 4) | Model new viz features here. Props likely include data arrays/maps. |
| `components/DocumentReviewView.tsx` | View for reviewing/auditing documents/creatives. | `DocumentReviewViewProps` (line 5) | Extend for new review tools (e.g., annotations, approvals). |

**Discovery Tip**: Use `listFiles('components/**/*.tsx')`, `analyzeSymbols('components/*.tsx')`, and `searchCode('use[A-Za-z]+')` to find hooks/state patterns before implementing.

## Workflows for Common Tasks

### 1. Implementing a New UI Feature (e.g., New Dashboard Widget)
   **Steps**:
   1. **Plan**: Review spec. Identify props/data needs. Sketch component tree (e.g., parent: `ReportDashboard` → child: `NewWidget`).
   2. **Analyze Context**: Run `getFileStructure()`, `analyzeSymbols(key-files)`, `searchCode('Props interface')` for patterns.
   3. **Define Props**: Create `{NewComponent}Props` interface matching existing (e.g., `data: Array<T>`, `onChange: (id: string) => void`).
   4. **Scaffold Component**:
      ```tsx
      import React from 'react';

      interface NewWidgetProps {
        // Typed props from spec
        data: YourDataType[];
        onAction: (payload: any) => void;
      }

      const NewWidget: React.FC<NewWidgetProps> = ({ data, onAction }) => {
        // Hooks/logic
        return <div>{/* JSX */}</div>;
      };

      export default NewWidget;
      ```
   5. **Integrate**: Import into parent (e.g., `ReportDashboard`). Pass props.
   6. **Test Manually**: Ensure re-renders on prop changes. Check TypeScript errors.
   7. **Commit**: Descriptive message: "feat: add NewWidget to ReportDashboard".

### 2. Extending Existing Components (e.g., Add Heatmap Filter)
   **Steps**:
   1. **Locate**: `readFile('components/HeatmapView.tsx')`.
   2. **Extend Props**: Add to `HeatmapViewProps` (e.g., `filter?: string`).
   3. **Implement Logic**: Use `useState`/`useEffect` for filter state. Update render conditionally.
   4. **Preserve Patterns**: Match indentation, imports (alphabetical), JSX structure.
   5. **Refactor if Needed**: Extract sub-components if >200 LOC.

### 3. Adding Data Visualization or Review Tool
   **Steps**:
   1. **Mirror**: Use `HeatmapView` or `DocumentReviewView` as template.
   2. **Libraries**: Infer from code (scan `searchCode('import.*(d3|recharts|chart)')`). Add if needed (e.g., `npm i recharts`).
   3. **Accessibility**: Add `aria-label`, keyboard nav.
   4. **Responsive**: Use CSS modules or Tailwind if present (`searchCode('className')`).

### 4. Full Feature Rollout
   ```
   Spec Review → Context Gather (tools) → Design Props/Tree → Implement → Lint/TypeCheck → Manual Test → PR
   ```
   - **Tools Integration**:
     | Task | Tools |
     |------|-------|
     | Find similar | `searchCode('heatmap|review')` |
     | Check structure | `getFileStructure()` |
     | Symbols | `analyzeSymbols('components/*.tsx')` |
     | Files | `listFiles('**/*.tsx')` |

## Best Practices (Derived from Codebase)
- **TypeScript First**: Always define props interfaces at top. Use generics for reusable data (e.g., `T extends Record<string, any>`).
- **React Patterns**:
  - Functional components only.
  - Hooks: `useState`, `useEffect`, `useCallback` for perf.
  - Memoization: `React.memo` for pure components.
- **Component Design**:
  - Single responsibility: One file = one view/widget.
  - Props drilling: <3 levels; use Context if deeper.
- **Styling**: Inline `className` or modules (scan for patterns).
- **Error Handling**: `try/catch` in effects, fallback UI.
- **Performance**: Key props for lists, `useMemo` for computations.
- **No Side Effects**: Pure functions where possible.
- **File Hygiene**: JSDoc for complex props, alphabetical imports.

## Testing Guidelines
- No tests in current context—**add them**.
- **Pattern**: Colocate `__tests__/Component.test.tsx` or `Component.test.tsx`.
- Use `@testing-library/react`: Render, query, fireEvent.
- Coverage: Props variants, edge cases (empty data, errors).

## Output Expectations
- Always output **diffs** or full files for changes.
- Prefix responses: `## Proposed Changes\n```diff\n...````
- End with: `Ready for review. Next steps?`

## Quick Commands
- Gather context: `listFiles('components/**') | analyzeSymbols(...)`
- Validate: Ensure 0 TS errors, semantic JSX.

**Enrich this playbook**: Update with new discoveries (e.g., hooks, utils) via tools. Collaborate with [Test Writer](./test-writer.md) for coverage.
