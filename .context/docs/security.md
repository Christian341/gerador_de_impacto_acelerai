# Security & Compliance Notes

**Status**: draft  
**Generated**: 2024-10-01  
**Last Updated**: 2024-10-01  
**Owner**: Development Team  

This document outlines security practices, compliance considerations, and operational guardrails for the **Simulador de Impacto - Auditoria de Criativos** project. The application is a React-based web tool for analyzing creative content using Google Gemini AI, featuring components like `ReportDashboard`, `HeatmapView`, `DocumentReviewView`, and services like `geminiService.ts`. It processes user-uploaded documents and generates AI-driven feedback (`AgentFeedback`, `AnalysisResult`, `PersonaImpact`).

Security is foundational but currently minimal due to the prototype nature. Focus areas include API key protection, client-side data handling, and future scalability.

## Authentication & Authorization

### Current Implementation
- **No built-in authentication**: The app (`App.tsx`, `index.tsx`) runs as a static single-page application (SPA) without server-side auth. Access is unrestricted.
- **Session Strategy**: None. Relies on browser storage (e.g., localStorage for tabs like `AppTab`).
- **Roles/Permissions**: Undefined. All users have full access to features like document review and AI analysis.

### Recommendations & Future Plans
- Integrate Firebase Auth or Auth0 for email/password + Google OAuth.
- Use JWT tokens stored in httpOnly cookies to prevent XSS.
- Implement role-based access:
  ```typescript
  // Example in types.ts extension
  type UserRole = 'admin' | 'auditor' | 'viewer';
  interface User {
    uid: string;
    role: UserRole;
  }
  ```
- Protect routes in `App.tsx`:
  ```tsx
  // Guard example
  if (!user || user.role !== 'auditor') {
    return <Navigate to="/login" />;
  }
  ```

**Evidence**: No auth-related symbols in `analyzeSymbols` output. Client-side only.

## Secrets & Sensitive Data

### Current Practices
- **Primary Secret**: Google Gemini API key in `services/geminiService.ts`.
  - Loaded via environment variables (e.g., `import.meta.env.VITE_GEMINI_API_KEY`).
  - **Risk**: Client-side exposure in bundled JS—vulnerable to network inspection.
- **Sensitive Data**:
  - User-uploaded documents in `DocumentReviewView.tsx`.
  - AI outputs (`AnalysisResult`, `Message`) stored in memory/state.
  - Classification: PII low (creatives/ad copy); no health/financial data.
- **Storage/Encryption**:
  - No vaults (e.g., AWS Secrets Manager) used.
  - No client-side encryption.
  - Rotation: Manual (update `.env` and redeploy).

### Best Practices & Enforcement
| Data Type | Storage | Encryption | Rotation | Access |
|-----------|---------|------------|----------|--------|
| API Keys | `.env.local` | None (env vars) | 90 days | Devs only |
| User Docs | Browser File API | None | N/A | Ephemeral |
| AI Results | React state | None | N/A | Session-only |

- **Immediate Action**: Proxy Gemini calls through a secure backend (e.g., Node.js/Express) to hide API keys.
  ```typescript
  // Backend proxy example (future /api/gemini)
  app.post('/analyze', async (req, res) => {
    const result = await geminiService.analyze(req.body.document, process.env.GEMINI_KEY);
    res.json(result);
  });
  ```
- Use `.env` gitignore'd. Scan with `git-secrets` or `truffleHog`.

**Evidence**: `geminiService.ts` is a key dependency; no encryption symbols found.

## Compliance & Policies

### Applicable Standards
- **GDPR/CCPA**: Potential if processing EU user data (creatives may contain personal info). Ensure consent for AI analysis.
- **No SOC2/HIPAA**: Not applicable (non-financial, non-health).
- **Internal Policies**:
  - OWASP Top 10 compliance (address XSS via CSP in `index.html`).
  - AI Ethics: Bias checks in `PersonaImpact` outputs.

### Evidence & Audits
- **Self-Attestation**: Run `npm audit`, Snyk scans weekly.
- **Logs**: Console-only; add Sentry for errors.
- **Requirements**:
  | Standard | Status | Evidence |
  |----------|--------|----------|
  | GDPR | Partial | Data minimization in `Message` types |
  | OWASP | Pending | No auth (A07), API exposure (A01) |

**Action Items**:
- Add privacy policy link in `App.tsx`.
- Document retention: Delete uploads after 24h.

## Incident Response

### Escalation Process
1. **Detection**: Browser console/Sentry alerts.
2. **Triage**: Dev notifies Slack `#incidents`.
3. **Response**: Contain (e.g., revoke API key), assess impact.
4. **Post-Mortem**: GitHub Issue + update this doc.

### Contacts & Tooling
- **On-Call**: Admin (Administradorr) via email/Discord.
- **Tools**:
  - Monitoring: Sentry (future).
  - Detection: Gemini API quota alerts.
  - Analysis: Browser DevTools + network logs.

### Playbooks
- **API Key Leak**:
  1. Rotate key in Google Cloud Console.
  2. Redeploy (`npm run build`).
  3. Scan commits with `searchCode` for patterns like `GEMINI_API_KEY`.
- **Data Breach**: Notify users if PII exposed (unlikely).

**Evidence**: No IR tooling in codebase. Integrate via `getFileStructure` for logs.

---

**Next Steps**:
- Backend proxy for secrets (priority 1).
- Auth integration (priority 2).
- Audit with `listFiles('*.ts') \| grep -i auth`.

Cross-references: [types.ts](types.ts), [geminiService.ts](services/geminiService.ts), [App.tsx](App.tsx). Review after major changes.
