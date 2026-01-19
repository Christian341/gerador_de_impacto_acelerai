# Data Flow & Integrations

This document outlines the data flow in the Simulador de Impacto - Auditoria de Criativos application, a React-based tool for auditing creative content using AI-driven analysis (via Google Gemini). Data enters primarily through user interactions in the UI (e.g., document uploads or text inputs), flows through React components and services for processing, and exits as visualized reports, heatmaps, or review interfaces. The app uses TypeScript for type safety, with core types defined in `types.ts`.

**Status**: filled  
**Generated**: 2024-10-01 (updated from analysis)

## Module Dependencies

Visual dependency graph (App.tsx is the central orchestrator):

```
index.tsx
  ↓
App.tsx ──┬→ components/DocumentReviewView.tsx (types.ts)
          ├→ components/ReportDashboard.tsx (types.ts) ─→ components/HeatmapView.tsx (types.ts)
          └→ services/geminiService.ts (types.ts)
```

- **App.tsx**: Entry point for routing/tabs (`AppTab` type). Manages global state and renders child components.
- **components/DocumentReviewView.tsx**: Handles document input/review (`DocumentReviewViewProps`).
- **components/ReportDashboard.tsx**: Displays aggregated results (`ReportDashboardProps`), embeds `HeatmapView.tsx` (`HeatmapViewProps`).
- **services/geminiService.ts**: AI processing layer, exports functions using `AgentFeedback`, `AnalysisResult`, `Message`, `PersonaImpact` from `types.ts`.
- **types.ts**: Shared types: `AgentFeedback`, `PersonaImpact`, `AnalysisResult`, `Message`.

No circular dependencies detected. App.tsx is imported by 4 files (including tests), confirming its hub role.

## Service Layer

No formal service classes (e.g., no Angular-style injectables). Services are functional modules:

- `services/geminiService.ts`: Stateless functions for Gemini API calls. Inputs: `Message[]` or raw text/documents. Outputs: `AnalysisResult` or `PersonaImpact`.

Example usage in components:
```tsx
// Hypothetical integration in DocumentReviewView.tsx
import { analyzeDocument } from '../services/geminiService';
const result: AnalysisResult = await analyzeDocument(messages);
```

## High-level Flow

Primary pipeline: **User Input → Local State → AI Analysis → Visualization**.

```mermaid
graph TD
    A[User Input<br/>(Document/Text via DocumentReviewView)] --> B[App.tsx State<br/>(AppTab switching)]
    B --> C[geminiService.ts<br/>Gemini API Call<br/>Message[] → AnalysisResult]
    C --> D[ReportDashboard.tsx<br/>Aggregate PersonaImpact]
    D --> E[HeatmapView.tsx<br/>Visual Impact Heatmap]
    E --> F[Export/Review Output]
    
    style A fill:#e1f5fe
    style F fill:#c8e6c9
```

1. **Input**: User selects tab (`AppTab`) in `App.tsx`, enters data in `DocumentReviewView.tsx`.
2. **Processing**: On submit/action, `App.tsx` or child calls `geminiService.ts` with `Message[]`.
3. **Analysis**: Gemini returns `AnalysisResult` (structured feedback via `AgentFeedback`, `PersonaImpact`).
4. **Output**: Results render in `ReportDashboard.tsx` → `HeatmapView.tsx`.

Full cycle: ~seconds (API-dependent). State lifted to `App.tsx` for sharing.

## Internal Movement

React event-driven flow via props/state (no Redux/Context detected; likely `useState`/`useEffect` in `App.tsx`):

- **Queues/Events**: None (synchronous async/await for API). React re-renders on state changes.
- **RPC Calls**: None (client-side only).
- **Shared State**: `App.tsx` passes `AnalysisResult[]` down to `ReportDashboardProps`/`DocumentReviewViewProps`.
- **Collaboration**:
  | Module | Role | Data In | Data Out |
  |--------|------|---------|----------|
  | `App.tsx` | Orchestrator | User events | Props to children |
  | `DocumentReviewView.tsx` | Input | `DocumentReviewViewProps` | `Message[]` |
  | `geminiService.ts` | Processor | `Message[]` | `AnalysisResult` |
  | `ReportDashboard.tsx` | Aggregator | `ReportDashboardProps` (results) | Render to `HeatmapView` |
  | `HeatmapView.tsx` | Visualizer | `HeatmapViewProps` | DOM/UI |

Example state update pattern:
```tsx
// In App.tsx (inferred)
const [results, setResults] = useState<AnalysisResult[]>([]);
const handleAnalyze = async (messages: Message[]) => {
  const analysis = await analyzeWithGemini(messages); // geminiService
  setResults(prev => [...prev, analysis]);
};
```

Cross-references: See `types.ts` for payloads; tests for usage examples.

## External Integrations

| Service | Purpose | Auth | Payload In | Payload Out | Retry |
|---------|---------|------|------------|-------------|-------|
| **Google Gemini API** (`services/geminiService.ts`) | AI analysis of creatives (impact audit, persona feedback). | API Key (env var, e.g., `GEMINI_API_KEY`). | `Message[]` (chat history: `{ role: 'user'/'assistant', content: string }`). Streams optional. | `AnalysisResult` (structured: `PersonaImpact[]`, `AgentFeedback`). | None detected (add exponential backoff recommended). |

Example call:
```ts
// services/geminiService.ts (inferred)
export async function analyzeDocument(messages: Message[]): Promise<AnalysisResult> {
  const response = await gemini.generateContent(messages);
  return parseGeminiResponse(response); // → PersonaImpact, etc.
}
```

No other integrations (e.g., no DB, no auth providers).

## Observability & Failure Modes

- **Metrics/Traces**: None (add Sentry/Vercel Analytics). Console logs likely in services.
- **Logs**: `geminiService.ts` errors → `console.error` (inferred).
- **Failure Modes**:
  | Failure | Handling | Recommendation |
  |---------|----------|----------------|
  | API Rate Limit/Timeout | Unhandled (re-throw). | Add `try/catch` + toast notifications. |
  | Invalid Input | TypeScript catches; runtime validation missing. | Zod/Yup for `Message`. |
  | Network Error | Promise rejection. | Retry with backoff: `p-retry` lib. |
  | No Results | Empty `AnalysisResult`. | Fallback UI in `ReportDashboard`. |

**Dead-Letter**: None. Compensating: Local cache `AnalysisResult` in state.

Monitor via browser DevTools or Playwright tests (`playwright.config.ts`). For production, integrate OpenTelemetry. 

See `technical_architecture.md` for deployment; `product_requirements_document.md` for features.
