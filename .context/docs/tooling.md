# Tooling & Productivity Guide

This guide covers the essential tools, automation, and setups to streamline development on the **Simulador de Impacto - Auditoria de Criativos** project. The stack is built on React with TypeScript, Vite for bundling, and Google Gemini for AI-driven analysis. Efficiency comes from standard web tooling with minimal custom scripts.

## Required Tooling

| Tool | Version | Installation | Purpose |
|------|---------|--------------|---------|
| **Node.js** | >=18.0.0 | [Download](https://nodejs.org/) or `nvm install 20` | Runtime for dev server, build, and Gemini service. |
| **pnpm** (preferred) or **npm** | pnpm >=8 / npm >=9 | `npm i -g pnpm` | Package management. Faster installs with pnpm. Run `pnmp install` after clone. |
| **Google Gemini API** | N/A | Get key from [Google AI Studio](https://aistudio.google.com/app/apikey). Add to `.env`: `VITE_GEMINI_API_KEY=your_key` | Powers `services/geminiService.ts` for `AgentFeedback` and `AnalysisResult` generation. |
| **Git** | >=2.30 | System package manager | Version control. |

Verify setup:
```bash
node --version
pnpm --version
git --version
```

## Recommended Automation

Standard Vite + TypeScript workflows. No custom hooks or generators yet—contribute via PRs!

### Core Scripts (from `package.json`)
```bash
pnpm dev          # Start dev server at http://localhost:5173 (HMR enabled)
pnpm build        # Production build to /dist
pnpm lint         # ESLint: `eslint src/ --ext .ts,.tsx`
pnpm format       # Prettier: `prettier --write src/`
pnpm preview      # Local prod preview: `pnpm build && pnpm preview`
pnpm type-check   # `tsc --noEmit`
```

### Local Dev Loop
1. `pnpm install`
2. Copy `.env.example` to `.env` and add Gemini key.
3. `pnpm dev` (watches TSX changes, reloads on type errors).
4. Test AI flows: Open `/report` tab, upload creative—triggers `geminiService.analyzeCreative()`.

**Watch Mode Tips**:
- Vite HMR: Instant React/TS updates.
- ESLint + Prettier on save (VSCode config below).

Future: Add Husky + lint-staged for pre-commit (`pnpm dlx husky-init && pnpm exec lint-staged`).

## IDE / Editor Setup

**VS Code** recommended (`.vscode/settings.json` included).

### Essential Extensions
Install via VS Code marketplace:
- **ESLint** (dbaeumer.vscode-eslint): Lints `.tsx`/`.ts` on save.
- **Prettier - Code formatter** (esbenp.prettier-vscode): Formats on save.
- **TypeScript Importer** (pmneo.tsimporter): Quick imports.
- **GitLens** (eamodio.gitlens): Blame, history inline.
- **Thunder Client** (rangav.vscode-thunder-client): Test Gemini API endpoints locally.
- **Error Lens** (usernamehw.errorlens): Inline TS errors.

### Workspace Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["typescript", "typescriptreact"],
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": { "typescriptreact": "html" }
}
```

### Snippets
Custom snippet for new component (`.vscode/app-component.code-snippets`):
```json
{
  "New React Component": {
    "prefix": "rcc",
    "body": [
      "import React from 'react';",
      "",
      "interface ${1:Props} {}",
      "",
      "export const ${2:ComponentName}: React.FC<${1:Props}> = ({}) => {",
      "  return (",
      "    <div>${2:ComponentName}</div>",
      "  );",
      "};"
    ]
  }
}
```

## Productivity Tips

- **Terminal Aliases** (add to `~/.zshrc` or `~/.bashrc`):
  ```bash
  alias dev="pnpm dev"
  alias lintf="pnpm lint --fix && pnpm format"
  alias t="pnpm type-check && pnpm dev"
  alias gemini-test="curl -H 'Content-Type: application/json' -d '{\"contents\": [{\"parts\":[{\"text\": \"Test\"}]}]}' 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$VITE_GEMINI_API_KEY'"
  ```
- **Env Management**: Use `direnv` (`brew install direnv`) + `.envrc`: `export VITE_GEMINI_API_KEY=...`. Auto-loads on `cd`.
- **Debug AI Service**: In VS Code, set breakpoint in `services/geminiService.ts`, run `pnpm dev`, inspect `AnalysisResult` responses.
- **Prototyping**: Use `AppTab` enum from `App.tsx` to switch tabs quickly. Mock `PersonaImpact` data in stories (add Storybook? #42).
- **Team Dotfiles**: Sync VS Code settings via [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync).
- **Container Workflow**: Dockerize for prod sim (`docker build -t simulador . && docker run -p 80:80 simulador`—TBD).

Contributions welcome: Add CI/CD (GitHub Actions), Storybook, or Playwright tests! See `types.ts` for core models like `AgentFeedback`.
