# Glossary & Domain Concepts

This glossary defines project-specific terminology, acronyms, domain entities, and user personas for the **Simulador de Impacto - Auditoria de Criativos** (Impact Simulator - Creative Audit). The application leverages AI (Google Gemini) to analyze marketing creatives (ads, images, videos) for their simulated impact on target audience **personas**, providing audits for effectiveness, compliance, and bias.

## Type Definitions

Key interfaces from [`types.ts`](types.ts), central to the data flow:

- **AgentFeedback** ([`types.ts#L2`](types.ts#L2))  
  Structured feedback from the AI agent (Gemini) on a creative's analysis. Includes ratings, comments, and suggestions. Used in `AnalysisResult` and report generation (e.g., `ReportDashboard.tsx`).

- **AnalysisResult** ([`types.ts#L14`](types.ts#L14))  
  Comprehensive output of creative analysis, aggregating `PersonaImpact`, `AgentFeedback`, and metrics. Rendered in `ReportDashboard.tsx` and `DocumentReviewView.tsx`.

- **Message** ([`types.ts#L31`](types.ts#L31))  
  Represents chat-like interactions or log entries in the analysis workflow. Supports conversational AI feedback loops.

- **PersonaImpact** ([`types.ts#L9`](types.ts#L9))  
  Metrics for a creative's effect on a specific persona (e.g., emotional resonance, conversion potential). Core to heatmaps (`HeatmapView.tsx`) and dashboards.

Related component props:
- **`ReportDashboardProps`** ([`components/ReportDashboard.tsx#L6`](components/ReportDashboard.tsx#L6)) — Props for rendering analysis summaries and charts.
- **`HeatmapViewProps`** ([`components/HeatmapView.tsx#L4`](components/HeatmapView.tsx#L4)) — Props for visualizing `PersonaImpact` as interactive heatmaps.
- **`DocumentReviewViewProps`** ([`components/DocumentReviewView.tsx#L5`](components/DocumentReviewView.tsx#L5)) — Props for uploading/reviewing creatives and displaying `AnalysisResult`.
- **`AppTab`** ([`App.tsx#L8`](App.tsx#L8)) — Type for application tabs (e.g., dashboard, review, heatmap).

## Enumerations

- *No enums detected in the codebase. Use union types like `AppTab` for tab navigation.*

## Core Terms

- **Creative**  
  A marketing asset (image, video, ad copy) submitted for AI-driven impact simulation and audit. Processed via `geminiService.ts` to generate `AnalysisResult`.  
  *Usage*: Uploaded in `DocumentReviewView.tsx`; audited for compliance and persona fit.

- **Persona**  
  A semi-fictional target audience profile (e.g., "young professional", "parent shopper") with demographics, behaviors, and goals. Creatives are scored for resonance.  
  *Relevance*: Central to `PersonaImpact`; visualized in `HeatmapView.tsx`. Predefined or customizable.

- **Impact Simulation**  
  AI-powered prediction of a creative's effect on personas, measuring emotional, cognitive, and behavioral responses. Outputs `PersonaImpact` scores (e.g., 0-100 scale).  
  *Surfaces in*: `services/geminiService.ts` calls, `ReportDashboard.tsx`.

- **Audit**  
  Systematic review of creatives for effectiveness, bias, regulatory compliance, and optimization suggestions via `AgentFeedback`.  
  *Workflow*: Triggered post-upload; results in dashboards and exportable reports.

- **Heatmap**  
  Visual representation of `PersonaImpact` scores across personas/dimensions, using color gradients for quick insights.  
  *Component*: `HeatmapView.tsx`.

## Acronyms & Abbreviations

| Acronym | Expansion | Context |
|---------|-----------|---------|
| **AI** | Artificial Intelligence | Powers analysis via Gemini models. |
| **Gemini** | Google Gemini | Multimodal AI service for creative evaluation ([`services/geminiService.ts`](services/geminiService.ts)). |
| **UI** | User Interface | React-based app with tabs (`App.tsx`) for dashboard, review, and heatmap views. |

## Personas / Actors

| Persona | Goals | Key Workflows | Pain Points Addressed |
|---------|-------|---------------|-----------------------|
| **Creative Auditor** | Validate creatives pre-launch; detect issues early. | Upload creative → AI analysis → Review `AnalysisResult` & `AgentFeedback` → Iterate. | Manual reviews are slow; bias overlooked. App automates with simulations. |
| **Marketing Analyst** | Optimize campaigns by persona. | View `ReportDashboard.tsx` → Explore `HeatmapView.tsx` → Export reports. | Lack of quantifiable impact data. Provides metrics & visuals. |
| **Campaign Manager** | High-level oversight; compliance checks. | Switch `AppTab`s → Dashboard summaries → Share analyses. | Fragmented tools. Unified interface with AI insights. |

## Domain Rules & Invariants

- **Creative Validation**: Must be valid formats (image/video/text); size limits enforced client-side. Invalid uploads rejected before `geminiService.ts` call.
- **Persona Coverage**: Analyses require ≥1 persona; scores normalized across all (e.g., average `PersonaImpact` in reports).
- **AI Response Handling**: `AnalysisResult` must include `AgentFeedback`; retries on Gemini API failures (handled in `geminiService.ts`).
- **Compliance**: Audits flag bias, misinformation, or regulatory issues (e.g., GDPR for EU personas). Region-specific: Brazilian Portuguese localization implied.
- **Data Privacy**: No persistent storage of creatives; analyses ephemeral unless exported.
- **Scoring Invariants**: `PersonaImpact` scores ∈ [0, 100]; thresholds for "high/medium/low" impact (customizable in dashboard).

*Cross-references*: See [`App.tsx`](App.tsx) for tab navigation; [`index.tsx`](index.tsx) for app entry; tests for usage examples (if available).*
