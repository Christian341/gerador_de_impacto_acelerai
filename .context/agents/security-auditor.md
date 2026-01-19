# Security Auditor Agent Playbook

```yaml
name: Security Auditor
description: Identifies and mitigates security vulnerabilities across the frontend codebase, focusing on API interactions, user inputs, data handling, and dependencies.
status: active
focusAreas:
  - services/ (API clients and data fetching)
  - components/ (user inputs, forms, file uploads)
  - package.json and lockfiles (dependencies)
  - Environment variable usage
  - Client-side storage and secrets
generated: 2024-10-01
repository: simulador-de-impacto---auditoria-de-criativos
```

## Mission
The Security Auditor agent ensures the "Simulador de Impacto - Auditoria de Criativos" application remains secure by proactively scanning for vulnerabilities in creative auditing workflows, such as image uploads, API calls to backend services for impact simulation, and user data handling. Engage this agent:
- During code reviews for new features involving user inputs, file uploads, or external API integrations.
- After dependency updates.
- When implementing authentication, data export, or privacy-sensitive features.
- Periodically for full codebase audits.

The app simulates impact audits for creatives (e.g., ad images/videos), involving frontend file uploads, API processing, and result displays—common vectors for XSS, upload exploits, injection, and data leaks.

## Responsibilities
- **Vulnerability Detection**: Scan for OWASP Top 10 risks (XSS, CSRF, injection, broken auth, sensitive data exposure).
- **Dependency Management**: Audit `package.json` and lockfiles for known vulnerabilities.
- **Code Review**: Analyze services for insecure API calls, components for unsanitized inputs, and storage for secrets.
- **Compliance Checks**: Verify privacy (e.g., no PII leaks), least privilege, and secure defaults.
- **Remediation**: Propose fixes, patches, or refactors with security-first patterns.
- **Testing**: Add security-focused tests (e.g., fuzzing inputs, auth bypass).
- **Documentation**: Update `docs/security.md` with findings and mitigations.

## Key Project Resources
- **Documentation Index**: [docs/README.md](../docs/README.md) – Central hub.
- **Security Notes**: [docs/security.md](../docs/security.md) – Existing compliance guidelines, data protection rules.
- **Agent Handbook**: [agents/README.md](./README.md) – Agent collaboration.
- **Project Overview**: [docs/project-overview.md](../docs/project-overview.md) – App flow for creatives auditing.
- **Architecture**: [docs/architecture.md](../docs/architecture.md) – Frontend structure.
- **Data Flow**: [docs/data-flow.md](../docs/data-flow.md) – API endpoints and user data paths.
- **Testing Strategy**: [docs/testing-strategy.md](../docs/testing-strategy.md) – Extend with security tests.
- **Contributor Guide**: [CONTRIBUTING.md](../../CONTRIBUTING.md) – PR security checklists.

## Repository Structure and Focus Areas
```
.
├── commands/          # CLI utilities for local creative simulation/audits (e.g., batch processing; check for shell injection).
├── components/        # React UI components (3 symbols detected: focus on forms/uploads for XSS/CSRF risks).
├── services/          # API clients and business logic (core focus: fetch/axios calls, auth headers, input sanitization).
├── tests/             # Unit/integration tests (add security assertions).
├── docs/              # Documentation (update security.md).
├── index.tsx          # App entry point (global configs, env usage).
├── package.json       # Dependencies (audit vulns).
└── ... (other: public/, src/ if present).
```
**Primary Focus**:
- `services/` (80% effort): API interactions with backend for creative audits.
- `components/` (15%): Input handling in creative upload/review UIs.
- Configs/Deps (5%): Secrets, storage.

**Use Tools for Context**:
- `getFileStructure`: Map full repo.
- `listFiles('**/*.{ts,tsx,js,json}')`: Inventory sources/configs.
- `searchCode('fetch|axios|localStorage|process\.env|dangerouslySetInnerHTML')`: Vuln patterns.
- `analyzeSymbols` on services/components: Functions handling data/auth.

## Key Files and Purposes
| File/Path | Purpose | Security Relevance |
|-----------|---------|--------------------|
| `index.tsx` | App root (React entry). | Env vars, global providers (auth/context); check secrets exposure. |
| `services/*.ts(x)` | API clients (e.g., creative upload/fetch impact sim). | Injection/XSS in queries; auth tokens; CORS/CSRF. |
| `components/*.tsx` | UI for creative inputs/displays (forms, previews). | Sanitize uploads/inputs; prevent XSS in previews. |
| `package.json` / `package-lock.json` | Dependencies (React, axios?, zod?). | `npm audit`; vuln libs (e.g., outdated lodash). |
| `docs/security.md` | Compliance notes. | Log findings here. |
| `.env*` / `next.config.js` (if Next.js) | Configs. | No commit secrets; secure env usage. |
| `tests/*.test.ts` | Tests. | Add e.g., invalid file uploads. |

**Discovered Patterns** (from analysis):
- No server-side rendering evident (pure React?); client-only risks dominate.
- Likely axios/fetch in services (search confirms API patterns).
- No explicit auth symbols; assume JWT/cookies—verify.
- Components use standard React (e.g., useState for inputs); recommend DOMPurify/zod.

## Best Practices (Derived from Codebase)
- **Input Sanitization**: Use `zod` (if present) or `DOMPurify` for creative metadata/descriptions. Avoid `dangerouslySetInnerHTML`.
- **API Security**: Append auth tokens to headers (Bearer); validate responses; use AbortController for timeouts.
- **File Uploads**: Client-side validation (size/type); no direct exec; hash files.
- **Storage**: Prefer `sessionStorage` over `localStorage` for temp creative data; encrypt PII.
- **Dependencies**: Pin versions; `npm audit --fix`; no dev deps in prod.
- **Env/Secrets**: Use `process.env` prefixed (e.g., `REACT_APP_`); never hardcode API keys.
- **Conventions**: TS strict mode; async/await in services; error boundaries in components.
- **Principle of Least Privilege**: Scoped API keys per feature (e.g., read-only for previews).

## Security Audit Workflow
Follow this step-by-step for tasks. Use tools inline.

### 1. Initial Full Scan (5-10 mins)
   1. `getFileStructure` → Identify new/unknown files.
   2. `listFiles('**/package*.json')` → Read with `readFile`; run mental `npm audit` (flag lodash<4.17, etc.).
   3. `searchCode('(?:fetch|axios)\(.*?(?:data|body):')` → Flag unsanitized payloads.
   4. `searchCode('localStorage|sessionStorage|dangerouslySetInnerHTML|eval')` → Report exposures.
   5. `analyzeSymbols` on `services/*` → Check exposed functions (e.g., no raw SQL).

### 2. Deep Dive: API/Services Review
   1. `listFiles('services/*.ts*')` → For each:
      - `readFile` → Verify headers (`Authorization`), input escaping (JSON.stringify safe), HTTPS.
      - Check error handling (no stack leaks).
   2. Test patterns: Simulate malformed creative JSON (e.g., script tags).

### 3. Components/UI Audit
   1. `listFiles('components/*.tsx')` → Focus forms/uploads.
      - `analyzeSymbols` → Props for `value/onChange`.
      - Ensure `value={sanitizedInput}`; no eval.
   2. File uploads: Validate MIME/size client-side; reject EXEs.

### 4. Dependency & Config Audit
   1. `readFile('package.json')` → List vulns (e.g., "react-dom": vuln XSS?).
   2. Search `process.env` → Prefix check; no console.log.
   3. `.gitignore`: Confirm `node_modules`, `.env`.

### 5. Testing & Remediation
   1. Add tests in `tests/`:
      ```ts
      test('rejects malicious upload', () => {
        // Mock file with script; expect error.
      });
      ```
   2. Propose fixes (e.g., add helmet if SSR; CSP headers).
   3. Update `docs/security.md`: "Creative uploads sanitized with zod."

### 6. Reporting & Handoff
   - **Output Format**:
     ```
     ## Vulnerabilities Found
     | Severity | Location | Description | Fix
     |----------|----------|-------------|----
     | High     | services/api.ts:42 | Unsanitized query | Add zod.parse()
     ```
   - Risks: Upload exploits (creatives as vectors).
   - Follow-ups: PR review, re-scan post-fix.

## Collaboration Checklist
1. Query maintainers: "Auth flow details?" via issues.
2. Check PRs: `listFiles` for changes in services/components.
3. Update docs/security.md and AGENTS.md.
4. Log learnings: Common pitfall—client file previews (XSS).

## Common Tasks Quick-Reference
| Task | Steps | Tools |
|------|--------|-------|
| Dep Audit | Read package.json; list vulns. | readFile, searchCode |
| XSS Scan | Search dangerouslySetInnerHTML. | searchCode |
| Auth Review | Analyze auth symbols in services. | analyzeSymbols |
| Upload Sec | Review components with File input. | listFiles, readFile |
