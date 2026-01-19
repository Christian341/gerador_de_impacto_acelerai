# Product Requirements Document (PRD): Aceleraí Impact Simulator (v2.0)

> **Status:** Draft / Aceito  
> **Versão:** 2.0  
> **Responsável:** Equipe de Produto  
> **Última Atualização:** 14/01/2026

---

## 1. Introdução

### 1.1 Propósito
O **Aceleraí Impact Simulator** é a ferramenta definitiva de pré-validação de criativos. Ele atua como uma "bancada de testes virtual", utilizando IA Generativa para simular a reação de diferentes segmentos de público e especialistas em marketing antes que um único centavo seja investido em mídia paga.

### 1.2 Visão do Produto
*"Tornar cada campanha previsível e lucrativa, eliminando o 'achismo' do processo criativo através de dados sintéticos de alta fidelidade."*

### 1.3 Escopo do MVP (Atual)
- **Entradas:** Imagens (Anúncios, LP Prints) e Textos (E-mails, VSLs, Briefings).
- **Processamento:** Análise semântica e visual via LLM (Google Gemini 1.5).
- **Saída:** Relatório visual com Score (0-100), Heatmap preditivo e Feedback de Personas.
- **Plataforma:** Web App (SPA) responsivo.

---

## 2. Métricas de Sucesso (KPIs)

Para considerar o produto um sucesso, devemos atingir os seguintes indicadores:

| Métrica | Meta / Indicador | Descrição |
| :--- | :--- | :--- |
| **Tempo de Análise** | < 15 segundos | Tempo entre o clique em "Analisar" e a exibição do dashboard. |
| **Taxa de Adoção** | 40% dos usuários | % de usuários que realizam ao menos 3 análises na primeira semana. |
| **Retenção (D30)** | > 20% | Usuários que retornam após 30 dias. |
| **Satisfação (CSAT)** | 4.5/5.0 | Baseado no feedback qualitativo dos agentes "virtuais" vs. resultado real. |

---

## 3. Personas do Usuário

1.  **O Gestor de Tráfego ("Analítico")**
    *   *Dores:* Gasta muito testando criativos ruins; CTR baixo; Bloqueios no Facebook.
    *   *Necessidade:* Quer saber se o anúncio vai performar e se viola regras.
2.  **O Designer ("Visual")**
    *   *Dores:* Refação constante; Cliente pede alterações subjetivas.
    *   *Necessidade:* Dados visuais (Heatmap) para justificar escolhas de layout.
3.  **O Copywriter ("Persuasivo")**
    *   *Dores:* Texto ignorado; Dúvida sobre o tom de voz.
    *   *Necessidade:* Feedback sobre clareza, gancho e urgência.

---

## 4. Requisitos Funcionais Detalhados

### 4.1 Módulo de Entrada (Input)
*   **[FR-01] Upload Drag-and-Drop:** Área sensível para arrastar imagens.
    *   *Restrições:* Máx 5MB, Formatos: JPG, PNG, WEBP.
*   **[FR-02] Input de Texto Expandível:** Textarea que cresce conforme o conteúdo (auto-resize).
    *   *Limite:* 5.000 caracteres ( MVP).
*   **[FR-03] Seleção de Contexto (Opcional):** Dropdown para escolher o "Nicho" (ex: E-commerce, Info-produto, B2B) para calibrar a IA (feature futura, mas preparada no código).

### 4.2 Módulo de Processamento (Core AI)
*   **[FR-04] Orquestrador de Prompts:** Sistema que injeta o `SYSTEM_PROMPT` robusto contendo as definições dos 5 Agentes e 5 Personas.
*   **[FR-05] Tratamento de Erros de IA:** Se a IA falhar ou retornar JSON inválido, o sistema deve realizar até 1 retentativa automática silenciosa antes de alertar o usuário.

### 4.3 Módulo de Agentes Sintéticos (O "Jurí")
A IA deve simular 5 personalidades distintas, garantindo diversidade de opinião:
1.  **Phil (Confiança):** Procura prova social, selos de garantia, depoimentos. Odiador de promessas falsas.
2.  **Dra. Camila (Branding):** Avalia paleta de cores, tipografia, tom de voz sofisticado vs. agressivo.
3.  **Toninho (Clareza):** "Explica como se eu tivesse 5 anos". Odeia jargões.
4.  **Juliana (Compliance):** Advogada do diabo. Procura violações de políticas de anúncios (Meta/Google).
5.  **Klebão (Urgência):** Focado em conversão. Procura CTAs claros e escassez.

### 4.4 Módulo de Visualização (Dashboard)
*   **[FR-06] Gauge Chart Animado:** O score geral deve animar de 0 até a nota final para gerar expectativa.
*   **[FR-07] Heatmap Overlay:** Sobrepor camadas de calor na imagem original baseada nas coordenadas `(x,y)` retornadas pela IA (simuladas).
*   **[FR-08] Modo Documento:** Se o input for apenas texto, esconder componentes visuais (Heatmap) e focar em tipografia e legibilidade.

---

## 5. Fluxos de Usuário (User Flows)

### Fluxo A: Auditoria de Novo Criativo (Imagem)
1.  Usuário acessa a Home.
2.  Arrasta imagem do anúncio para a área de upload.
3.  (Opcional) Adiciona breve contexto no campo de texto: "Anúncio para Black Friday".
4.  Clica em "Analisar".
5.  **Estado de Loading:** IA processa (~10s). Exibe mensagens aleatórias ("Consultando a Dra. Camila...", "Phil está desconfiado...").
6.  **Dashboard:**
    *   Vê Nota 72/100 (Cor: Âmbar).
    *   Vê Heatmap: Foco está no logotipo, não no CTA.
    *   Lê Dica do Toninho: "A oferta está confusa".
7.  Usuário ajusta a imagem no Photoshop.
8.  Usuário reenvia para nova análise.

---

## 6. Requisitos Não-Funcionais (NFR)

### 6.1 Usabilidade e Design
*   **Glassmorphism:** Uso de transparências e blur (`backdrop-filter`) para sensação de modernidade.
*   **Dark Mode Native:** A interface deve ser nativamente escura para reduzir fadiga visual e destacar os gráficos coloridos.
*   **Mobile First:** O Dashboard deve empilhar verticalmente em telas < 768px.

### 6.2 Segurança
*   **API Key Protection:** No MVP (Client-side), a chave está exposta. **CRÍTICO:** Para V2, mover para Serverless Function (Next.js API Routes ou Supabase Edge Functions).

---

## 7. Roadmap e Estratégia de Evolução

### Fase 1 (Atual) - Estabilização
*   [x] Validação do Prompt de Sistema.
*   [x] UI Responsiva e Dashboard Básico.
*   [ ] Tratamento de erros de rede (timeout).

### Fase 2 - Aprofundamento (Próximos Passos)
*   [ ] **Comparador A/B:** Upload de 2 imagens e veredito de qual vence ("Winner Takes All").
*   [ ] **PDF Parsing:** Ler PDFs reais (não apenas colar texto).
*   [ ] **Login Social:** Salvar histórico na nuvem (Supabase).
*   [ ] **Botão "Refazer com IA":** A própria IA sugere uma nova versão do texto.

### Fase 3 - Monetização
*   [ ] Sistema de Créditos (5 análises grátis/dia).
*   [ ] Plano Agency (Relatórios Whitelabel em PDF para enviar a clientes).

---

## 8. Glossário de Termos UI
*   **Score Gauge:** O gráfico de velocímetro principal.
*   **Sentiment Pills:** Etiquetas coloridas (Otimista = Verde, Crítico = Vermelho).
*   **Persona Bars:** Gráfico de barras verticais mostrando impacto por público.
