# Backlog do Produto: Aceleraí Impact Simulator (Definitive Build)

> **Baseado em:** `product_requirements_document.md` (v2.0) e `technical_architecture.md` (v1.0)  
> **Objetivo:** Guia tático para transformação do MVP em Produto SaaS Scalável.

---

## 🟢 Épico 1: Fundação Tech & Migração (Prioridade Máxima)
*Objetivo: Sair do ambiente SPA/Vite inseguro para uma arquitetura Next.js Serverless robusta, permitindo proteção de API Key e futura escalabilidade.*

### Sprint 1.1: Setup Core & Migração
- [ ] **CHORE:** Inicializar novo repo Next.js 14+ (App Router) com TypeScript e Tailwind.
- [ ] **REFAC:** Migrar componentes de UI (`ReportDashboard`, `HeatmapView`, `InputArea`) do Vite para Next.js Components.
- [ ] **FEAT:** Configurar Roteamento básico (`/` Home, `/report` Resultado).
- [ ] **SRA:** Migrar definições de tipos (`types.ts`) para `@/types`.

### Sprint 1.2: Backend for Frontend (BFF)
- [ ] **SEC:** Criar API Route `/api/analyze/route.ts` para encapsular a chamada ao Google Gemini.
- [ ] **SEC:** Configurar `GEMINI_API_KEY` apenas em variáveis de ambiente server-side (`.env.local` e Vercel Env).
- [ ] **FEAT:** Implementar Server Action ou Route Handler que recebe o JSON do front e chama o serviço de IA.
- [ ] **IMP:** Implementar validação de input com **Zod** no backend (bloquear payloads maliciosos).

---

## 🟡 Épico 2: Motor de Inteligência & Qualidade (Core Experience)
*Objetivo: Refinar a qualidade da análise, garantir estabilidade e melhorar a UX de espera.*

### Sprint 2.1: Robustez da IA
- [ ] **AI:** Refatorar `geminiService.ts` para usar **JSON Schema Mode** nativo do Gemini 1.5 (garantir que o JSON nunca quebre).
- [ ] **IMP:** Implementar lógica de *retry* automático no backend (1 tentativa em caso de erro 500/Timeout).
- [ ] **FEAT:** Adicionar fallback para "Modo Texto" caso a análise de imagem falhe mas o texto seja processado.

### Sprint 2.2: Otimização de Assets
- [ ] **PERF:** Implementar compressão de imagem client-side (`browser-image-compression`) antes do upload para a API.
- [ ] **UX:** Melhorar feedback de Loading com "Mensagens de Status Variáveis" (Ex: "Consultando Phil...", "Analisando Cores...").

---

## 🔵 Épico 3: Identidade & Persistência (SaaS Ready)
*Objetivo: Transformar visitantes em usuários cadastrados e salvar dados.*

### Sprint 3.1: Supabase Setup
- [ ] **INFRA:** Criar projeto Supabase (Banco + Auth).
- [ ] **DB:** Modelar banco de dados (`users`, `analyses`, `credits`).
- [ ] **AUTH:** Implementar Login Social (Google) e Magic Link no Next.js.

### Sprint 3.2: Histórico Cloud
- [ ] **FEAT:** Substituir `localStorage` por API de Histórico (`GET /api/history`).
- [ ] **FEAT:** Salvar resultados de análise no PostgreSQL após sucesso.
- [ ] **FEAT:** RLS (Row Level Security): Garantir que usuário X só leia as análises de X.

---

## 🟣 Épico 4: Expansão de Features (Growth)
*Objetivo: Funcionalidades avançadas para validar monetização.*

### Sprint 4.1: Comparador A/B
- [ ] **UI:** Criar nova tela com "Split View" para upload de 2 imagens.
- [ ] **AI:** Criar novo Prompt de Sistema "Battle Mode" (Qual vence e por que?).
- [ ] **FEAT:** Exibir resultado comparativo lado-a-lado.

### Sprint 4.2: Exportação
- [ ] **FEAT:** Gerar PDF do relatório para download (Biblioteca `react-pdf` ou serviço server-side).

---

## 📊 Definição de Pronto (DoD)
Para um item ser considerado "Feito":
1.  Código commitado no repositório Next.js.
2.  Deploy de Preview na Vercel funcionando.
3.  Nenhuma chave de API exposta no Network Tab do navegador.
4.  UI Responsiva testada em dimensões Mobile.
