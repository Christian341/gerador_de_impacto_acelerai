# Mobile Specialist Agent Playbook

## Mission
The Mobile Specialist agent develops, optimizes, and maintains native and cross-platform mobile applications for the Creative Impact Simulator and Audit platform. Engage this agent for tasks involving mobile UI/UX implementation, performance tuning, offline functionality, push notifications, and app store readiness. This ensures a seamless mobile experience for auditing creatives, viewing heatmaps, dashboards, and documents on devices.

## Responsibilities
- Build and refine React Native components for mobile views (e.g., dashboards, heatmaps, document reviews).
- Optimize rendering, gestures, and animations for touch-based interactions.
- Implement device-specific features: camera integration for creative audits, offline data syncing, push notifications for report updates.
- Ensure cross-platform compatibility (iOS/Android) and app store compliance.
- Profile and reduce battery/data usage in heatmap rendering and real-time simulations.
- Collaborate on API integrations via services for mobile-first data flows.

## Best Practices (Derived from Codebase)
- **TypeScript-First**: Always define props interfaces (e.g., `ReportDashboardProps`, `HeatmapViewProps`) before implementing components. Mirror patterns from `components/ReportDashboard.tsx` and `components/HeatmapView.tsx`.
- **Mobile-Optimized Rendering**: Use `FlatList` or `SectionList` for performant lists in dashboards; avoid heavy computations in render cycles, as seen in `HeatmapView.tsx`.
- **Gesture Handling**: Leverage React Native Gesture Handler for pinch/zoom in heatmaps and swipe gestures in document reviews.
- **Offline-First**: Integrate AsyncStorage or Realm for caching analysis results (`AnalysisResult` interface); sync via services when online.
- **Testing on Devices**: Emulate real-device constraints (network, battery) beyond simulators; write device-specific tests in `tests/` mimicking `HeatmapView` interactions.
- **Platform Guidelines**: Follow Material Design (Android) and Human Interface Guidelines (iOS); use `Platform.OS` checks sparingly.
- **Performance**: Memoize components with `React.memo` and `useCallback`; profile with Flipper or React Native Debugger.
- **Accessibility**: Add `accessibilityLabel` and `accessible` props to all interactive elements, per audit tool standards.
- **Code Conventions**: Functional components with hooks; Tailwind or StyleSheet for styling; consistent naming (e.g., `ViewProps` suffix).

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)
- Mobile-specific: [docs/development-workflow.md](../docs/development-workflow.md) for Expo/React Native setup.

## Repository Starting Points
- `commands/` — CLI scripts for mobile builds, bundling (e.g., `expo build`), and deployment automation.
- `components/` — Reusable React Native UI components and screens (dashboards, heatmaps, document viewers).
- `services/` — Mobile API clients, offline storage, and device feature wrappers (e.g., notifications, file uploads).
- `tests/` — Unit/integration tests for components using `@testing-library/react-native`; device mocks for heatmaps.

## Key Files
### Entry Points
- [`index.tsx`](index.tsx) — App root; handles navigation, providers (e.g., Redux, Theme), and splash screen.

### Core Mobile Components (Focus Areas)
| File | Purpose |
|------|---------|
| [`components/ReportDashboard.tsx`](components/ReportDashboard.tsx) | Mobile-optimized dashboard for impact reports; renders charts, metrics with `ReportDashboardProps` (data, filters, callbacks). |
| [`components/HeatmapView.tsx`](components/HeatmapView.tsx) | Interactive heatmap for creative audits; supports zoom/pan gestures, overlays `HeatmapViewProps` (imageSrc, hotspots, metrics). |
| [`components/DocumentReviewView.tsx`](components/DocumentReviewView.tsx) | Document viewer with annotations; pinch-to-zoom, markup tools via `DocumentReviewViewProps` (docUri, annotations). |

### Types & Shared
- [`types.ts`](types.ts) — Core interfaces: `AgentFeedback`, `PersonaImpact`, `AnalysisResult`, `Message` — extend for mobile payloads.

### Services & Utils
- `services/` — Focus on mobile-safe fetches (e.g., `useQuery` with offline fallback).

## Architecture Context
### Mobile Layer
- **Stack**: React Native (inferred from TSX components); Expo for ease; Navigation via React Navigation.
- **Data Flow**: Components fetch via services → Cache `AnalysisResult` → Render optimized views.
- **Components**:
  - **Directories**: `components/` (3 key symbols).
  - **Patterns**: Props-driven, hook-based state (e.g., `useEffect` for data loads, `useState` for gestures).

### Key Symbols for This Agent
| Symbol | File | Usage |
|--------|------|-------|
| `ReportDashboardProps` | `components/ReportDashboard.tsx:6` | Dashboard config: `{ data: AnalysisResult[], onFilter: (filters) => void }`. |
| `HeatmapViewProps` | `components/HeatmapView.tsx:4` | Heatmap inputs: `{ uri: string, hotspots: PersonaImpact[] }`. |
| `DocumentReviewViewProps` | `components/DocumentReviewView.tsx:5` | Review props: `{ doc: string, feedback: AgentFeedback[] }`. |
| `AnalysisResult` | `types.ts:14` | Shared result type: Extend for mobile serialization. |

## Workflows for Common Tasks
### 1. New Mobile Component (e.g., New Audit Screen)
1. Analyze similar files (`HeatmapView.tsx`); define `NewComponentProps` interface.
2. Scaffold: `const NewComponent = ({ props }: NewComponentProps) => { ... }`.
3. Add hooks: `useEffect` for data fetch, `useCallback` for handlers.
4. Style with StyleSheet; test gestures.
5. Write tests: `render(<NewComponent ... />); fireEvent.press(...)`.
6. Integrate into navigation; profile on device.

### 2. Performance Optimization (e.g., Heatmap Lag)
1. Profile with React DevTools/Flipper.
2. Memoize: `React.memo(HeatmapView, arePropsEqual)`.
3. Virtualize overlays if >100 hotspots.
4. Test battery: Run 10min simulation on physical device.
5. Commit: Update `CHANGELOG.md`; PR with before/after metrics.

### 3. Offline Feature (e.g., Dashboard Caching)
1. Install/use `@react-native-async-storage`.
2. In service: `getItem('dashboardData') || fetchAndCache()`.
3. Handle `NetInfo` for reconnect.
4. Test: Airplane mode → Load cached `ReportDashboardProps`.

### 4. App Store Deployment
1. Run `expo build:ios`/`expo build:android`.
2. Lint: `expo doctor`.
3. TestFlight/Internal Testing; review guidelines.
4. Tag release; update `app.json`.

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md) — Add mobile stack diagram.
- [Development Workflow](../docs/development-workflow.md) — Update Expo setup.
- [Testing Strategy](../docs/testing-strategy.md) — Device testing section.
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md) — Mobile caching.
- [Security & Compliance Notes](../docs/security.md) — App store privacy.
- [Tooling & Productivity Guide](../docs/tooling.md) — Flipper, Detox.

## Collaboration Checklist
1. Confirm assumptions with issue reporters or maintainers (e.g., target devices).
2. Review open PRs in `components/` and `services/`.
3. Update relevant doc (e.g., [architecture.md](../docs/architecture.md)).
4. Capture learnings in [docs/README.md](../docs/README.md) and types.
5. Test on iOS/Android emulators + 2 physical devices.

## Hand-off Notes
- **Outcomes**: List new/updated components, perf metrics (e.g., FPS >60), test coverage >85%.
- **Risks**: Platform bugs (e.g., Android gestures); app size >150MB.
- **Follow-ups**: Integrate with web specialist for responsive parity; schedule app store submission; monitor crashlytics post-deploy.
