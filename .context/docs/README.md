# Simulador de Impacto - Auditoria de Criativos

## Visão Geral do Projeto

Este repositório contém um simulador web para auditoria de impacto de criativos de marketing. A aplicação usa React com TypeScript, Vite para build, e integra com o Google Gemini AI para análise de conteúdo. O foco é em avaliações de impacto de personas, feedback de agentes, e visualizações como dashboards de relatórios, mapas de calor e revisão de documentos.

**Funcionalidades Principais:**
- Análise de criativos com IA (via `services/geminiService.ts`).
- Dashboard de relatórios (`components/ReportDashboard.tsx`).
- Visualização de heatmap (`components/HeatmapView.tsx`).
- Revisão de documentos (`components/DocumentReviewView.tsx`).
- Suporte a fluxos de mensagens e feedback de agentes.

**Tecnologias:**
- Frontend: React 18+, TypeScript, Vite.
- Testes: Playwright (`playwright.config.ts`).
- AI: Google Gemini API.
- Docs: Markdown com índice em `docs/`.

## Tipos e API Pública

Definições centrais em `types.ts`:

```typescript
// types.ts
export interface AgentFeedback {
  // Feedback gerado por agente de IA sobre criativos.
  message: string;
  score: number;
  suggestions?: string[];
}

export interface PersonaImpact {
  // Impacto estimado por persona de usuário.
  persona: string;
  impactScore: number;
  engagementMetrics: Record<string, number>;
}

export interface AnalysisResult {
  // Resultado completo de análise.
  creatives: string[];
  overallScore: number;
  personaImpacts: PersonaImpact[];
  agentFeedback: AgentFeedback[];
}

export interface Message {
  // Mensagens no fluxo de chat/auditoria.
  id: string;
  content: string;
  role: 'user' | 'agent';
  timestamp: Date;
}
```

Esses tipos são usados em componentes como `ReportDashboard` e serviços de IA.

## Instalação e Execução

1. **Pré-requisitos:**
   - Node.js 18+.
   - API Key do Google Gemini (configure em `.env` como `GEMINI_API_KEY`).

2. **Instalação:**
   ```bash
   npm install
   ```

3. **Execução em Desenvolvimento:**
   ```bash
   npm run dev  # http://localhost:5173
   ```

4. **Build e Preview:**
   ```bash
   npm run build
   npm run preview
   ```

5. **Testes:**
   ```bash
   npm test      # Playwright
   npx playwright test
   ```

## Arquitetura

- **Entrada Principal:** `index.tsx` → `App.tsx` (tabs via `AppTab` enum).
- **Componentes:** `components/` (ex: `ReportDashboardProps` para props de dashboard).
- **Serviços:** `services/geminiService.ts` (chamadas async para análise).
- **Fluxo de Dados:** Usuário carrega criativos → Gemini analisa → Renderiza `AnalysisResult` em views.
- **Dependências Chave:**
  | Arquivo | Importado por | Descrição |
  |---------|---------------|-----------|
  | `App.tsx` | 4 arquivos | App root com tabs. |
  | `components/ReportDashboard.tsx` | 2 arquivos | Dashboard principal. |
  | `services/geminiService.ts` | 1 arquivo | Integração Gemini. |

Veja [Arquitetura Detalhada](./architecture.md).

## Fluxo de Desenvolvimento

- **Branches:** `main` (produção), `feature/*`, `hotfix/*`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, etc.).
- **CI/CD:** Playwright roda em PRs (veja `playwright.config.ts`).

Exemplo de uso de serviço:

```typescript
// Em um componente
import { analyzeCreatives } from '../services/geminiService';

const result: AnalysisResult = await analyzeCreatives(['creative1.png'], personas);
```

## Índice de Documentação

Bem-vindo à base de conhecimento do repositório. Comece com a visão geral, depois mergulhe em guias específicos.

### Guias Principais
- [Visão Geral do Projeto](./project-overview.md)
- [Notas de Arquitetura](./architecture.md)
- [Fluxo de Desenvolvimento](./development-workflow.md)
- [Estratégia de Testes](./testing-strategy.md)
- [Glossário & Conceitos de Domínio](./glossary.md)
- [Fluxo de Dados & Integrações](./data-flow.md)
- [Segurança & Conformidade](./security.md)
- [Ferramentas & Guia de Produtividade](./tooling.md)

### Snapshot do Repositório
```
.
├── App.tsx
├── commands/
├── components/
│   ├── ReportDashboard.tsx
│   ├── HeatmapView.tsx
│   └── DocumentReviewView.tsx
├── index.html
├── index.tsx
├── package*.json
├── playwright.config.ts
├── services/
│   └── geminiService.ts
├── tests/
├── tsconfig.json
├── types.ts
├── vite.config.ts
├── docs/
└── ... (veja product_requirements_document.md, etc.)
```

## Mapa de Documentos
| Guia | Arquivo | Entradas Primárias |
|------|---------|--------------------|
| Visão Geral | `project-overview.md` | Roadmap, README, notas de stakeholders |
| Arquitetura | `architecture.md` | ADRs, limites de serviços, grafos de dependência |
| Desenvolvimento | `development-workflow.md` | Regras de branch, CI, guia de contribuição |
| Testes | `testing-strategy.md` | Configs de teste, gates CI, suites flaky |
| Glossário | `glossary.md` | Terminologia de negócio, personas, regras de domínio |
| Fluxo de Dados | `data-flow.md` | Diagramas, specs de integração |
| Segurança | `security.md` | Auth, segredos, conformidade |
| Ferramentas | `tooling.md` | Scripts CLI, configs IDE |

## Próximos Passos
- Explore `App.tsx` para navegação.
- Teste análise: Carregue criativos em dashboard.
- Contribua: Veja [project_backlog.md](../project_backlog.md).

Para issues ou dúvidas: Abra uma [issue](https://github.com/.../issues).
