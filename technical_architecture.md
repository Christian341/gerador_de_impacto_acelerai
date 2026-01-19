# Documento de Arquitetura Técnica: Aceleraí Impact Simulator

> **Status:** Proposta  
> **Versão:** 1.0  
> **Data:** 14/01/2026

---

## 1. Resumo Executivo
Este documento descreve a arquitetura técnica recomendada para o **Aceleraí Impact Simulator**. O objetivo é evoluir do atual MVP (Single Page Application pura) para uma arquitetura **Cloud-Native Serverless** robusta, segura e escalável, capaz de suportar alta carga de usuários e proteger a propriedade intelectual (Prompts do Sistema e Chaves de API).

---

## 2. Diagrama de Arquitetura de Alto Nível (C4 - Level 2)

```mermaid
graph TD
    User[Usuário Final] -->|Acessa via HTTPS| CDN[CDN (Vercel Edge)]
    
    subgraph Frontend [Camada de Apresentação]
        UI[React SPA (Client)]
        Store[Zustand/Context State]
        UI -->|Upload & Input| Store
    end
    
    CDN --> UI
    
    subgraph Backend [Camada de Aplicação Serverless]
        API[API Gateway / Edge Functions]
        Auth[Auth Service (Supabase/NextAuth)]
        Orchestrator[AI Orchestrator Service]
        
        UI -->|Request Analysis (Secure)| API
        API -->|Validate Token| Auth
        API -->|Prompt Assembly| Orchestrator
    end
    
    subgraph AI_Provider [Motor de Inteligência]
        Gemini[Google Gemini 1.5 Flash]
        Orchestrator -->|Send Multimodal Prompt| Gemini
        Gemini -->|Return JSON| Orchestrator
    end
    
    subgraph Data [Persistência]
        DB[(PostgreSQL - Supabase)]
        Storage[Object Storage (S3/Supabase)]
        API -->|Log Usage| DB
        UI -->|Save History (Local)| LocalStore[Local Storage]
    end
```

---

## 3. Decisões Técnicas e Stack Recomendada

### 3.1 Frontend (Apresentação)
*   **Framework:** **Next.js 14+ (App Router)**.
    *   *Justificativa:* Melhor que Vite puro para este caso pois permite renderização híbrida e, crucialmente, **API Routes** integradas para proteger chaves de API.
*   **Estilização:** **Tailwind CSS + Framer Motion**.
    *   *Justificativa:* Tailwind para velocidade de desenvolvimento e consistência; Framer Motion para as animações complexas do Dashboard (Gauge Charts, transições).
*   **State Management:** **Zustand**.
    *   *Justificativa:* Mais leve e simples que Redux, suficiente para gerenciar o estado global de "Análise em Progresso" e "Histórico".

### 3.2 Backend (Aplicação e API)
*   **Paradigma:** **Serverless Functions (Vercel ou Supabase Edge Functions)**.
    *   *Justificativa:* Custo zero quando ocioso, escalabilidade infinita automática. Não faz sentido manter um servidor Node.js (EC2/DigitalOcean) ligado 24/7 para um fluxo de requisições esporádico.
*   **Segurança:** A chave da API do Google Gemini (`GEMINI_API_KEY`) **NUNCA** deve chegar ao navegador do cliente.
    *   *Implementação:* O Frontend chama `/api/analyze`. O Backend (lado seguro) monta o prompt com `SYSTEM_PROMPT` (que também é segredo industrial) e chama o Google.

### 3.3 Banco de Dados e Autenticação (Fase 2+)
*   **Plataforma:** **Supabase (BaaS)**.
    *   *Auth:* Gerenciamento de usuários (Magic Link, Google Login) pronto para uso.
    *   *Database:* PostgreSQL para salvar histórico de análises, créditos de usuário e logs de auditoria.
    *   *Row Level Security (RLS):* Garante que um usuário só veja suas próprias análises via regras do banco, sem código complexo de backend.

---

## 4. Estratégia de Inteligência Artificial (Core Engine)

### 4.1 Modelo
*   **Principal:** **Gemini 1.5 Flash**.
    *   *Por que:* Janela de contexto grande (1M tokens) permite analisar documentos PDF inteiros ou múltiplas imagens. Custo por token muito baixo comparado ao GPT-4o, com performance visual excelente.
*   **Fallback (Redundância):** Caso o Gemini esteja instável, arquitetar o *Orchestrator* para suportar chaveamento para **GPT-4o-mini**.

### 4.2 Engenharia de Prompt (The "Secret Sauce")
*   **Arquitetura de Prompt:** Desenvolver prompts modulares. Em vez de um prompt gigante, usar a técnica de **"Chain of Thought"** implícita ou dividir em steps se a complexidade aumentar:
    1.  *Step 1:* Visão Computacional (Descreva a imagem, extraia texto, identifique elementos).
    2.  *Step 2:* Análise Semântica (Roleplay dos 5 Agentes sobre a descrição).
*   **Output Parsing:** Utilizar o modo **JSON Schema** do Gemini para garantir que a resposta nunca quebre o Dashboard no frontend. **Zod** deve ser usado no backend para validar o schema antes de responder ao front.

---

## 5. Escalabilidade e Performance

### 5.1 Otimização de Imagens
*   **Problema:** Usuários enviam imagens de 10MB (PNG 4K). Isso é lento e caro e pode estourar cotas.
*   **Solução:** Implementar compressão *client-side* (biblioteca `browser-image-compression`) antes do upload. Reduzir para máx 1080px de largura e qualidade 0.8 (WebP).

### 5.2 Cache (CDN)
*   Armazenar resultados de análises repetidas (hash MD5 da imagem + prompt) no Redis (Upstash) ou banco. Se alguém enviar a mesma imagem 2x, retornar o cache instantaneamente (0 custo de IA).

---

## 6. Segurança e Compliance

### 6.1 Proteção de Dados
*   Os dados enviados (imagens de criativos não lançados) são sensíveis.
*   **Política:** Não usar dados de usuários para treinar modelos (verificar Opt-out API settings do Google Enterprise).
*   **Retenção:** Dados temporários de upload devem ser deletados imediatamente após a análise se não houver feature de "Histórico na Nuvem".

---

## 7. Roteiro de Implementação Técnica

### Fase 1: Migração para Next.js (Immediate)
1.  Inicializar projeto Next.js.
2.  Mover lógica de `App.tsx` para `page.tsx` + Client Components.
3.  Criar API Route (`app/api/analyze/route.ts`) e mover a chamada do Google AI para lá.
4.  Configurar variáveis de ambiente na Vercel.

### Fase 2: Persistência (Medium Term)
1.  Configurar projeto Supabase.
2.  Criar tabelas: `users`, `credits`, `analyses`.
3.  Implementar Login.

### Fase 3: Analytics e Monitoramento
1.  Instalar **Vercel Analytics** para performance de página.
2.  Instalar **Helicone** ou **LangSmith** para monitorar custos, latência e qualidade das respostas da LLM.

---

## 8. Estimativa de Custos (Operação)

| Recurso | Serviço Sugerido | Custo Estimado (10k req/mês) |
| :--- | :--- | :--- |
| **Hosting Front/Back** | Vercel Hobby / Pro | Grátis ou $20/mês |
| **Banco de Dados** | Supabase Free Tier | Grátis (até 500MB) |
| **AI (Modelos)** | Google Gemini 1.5 Flash | ~$5.00 a $10.00 (muito barato) |
| **Monitoramento** | LangSmith Free | Grátis |
| **Total** | | **~$5 - $30 / mês** |

*Nota: O custo escala linearmente com o uso da IA, mas é altamente viável cobrar uma assinatura (SaaS) ou pacotes de créditos.*
