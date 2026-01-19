# Documentação do Sistema: Simulador de Impacto - Auditoria de Criativos

## 1. Visão Geral
O **Simulador de Impacto** é uma aplicação web desenvolvida para auxiliar profissionais de marketing e estrategistas a auditarem a eficácia de criativos visuais e documentos de vendas. 

O sistema utiliza Inteligência Artificial Generativa (Google Gemini) para simular o comportamento de diferentes personas e "agentes sintéticos", fornecendo uma análise preditiva de performance antes que o material seja veiculado.

### Principais Funcionalidades
- **Análise Multimodal:** Aceita textos, imagens e documentos (PDF simulado via texto/imagem).
- **Conselho de Agentes Sintéticos:** Simula feedbacks de especialistas virtuais em Confiança, Branding, Clareza, Compliance e Urgência.
- **Simulação de Personas:** Calcula o impacto esperado em 5 categorias de público (ex: Impulsivos, Céticos, etc.).
- **Heatmap Simulado:** Prevê áreas de atenção visual na imagem.
- **Histórico Local:** Armazena as últimas análises no navegador do usuário.

---

## 2. Arquitetura Técnica

### Stack Tecnológica
- **Frontend Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS (com customizações de fonte e paleta)
- **Integração IA:** SDK `@google/genai` (Modelo Gemini 1.5 Flash ou similar)
- **Gerenciamento de Estado:** React Hooks (`useState`, `useContext` - implícito no App)
- **Persistência:** `localStorage`

### Fluxo de Dados
1. **Input:** O usuário insere um texto ou faz upload de uma imagem em `App.tsx`.
2. **Processamento:** A função `analyzeCreative` em `geminiService.ts` monta um prompt complexo e envia para a API do Google Gemini.
3. **Inferência:** O modelo retorna um JSON estruturado contendo pontuações, feedbacks e coordenadas de atenção.
4. **Renderização:** O componente `ReportDashboard.tsx` consome esse JSON e exibe os gráficos, scores e heatmaps.

---

## 3. Estrutura de Pastas

```
/
├── components/          # Componentes de UI reutilizáveis e visualizações
│   ├── DocumentReviewView.tsx  # Visualização focada em documentos de texto
│   ├── HeatmapView.tsx         # Componente que desenha o mapa de calor sobre a imagem
│   └── ReportDashboard.tsx     # Painel principal de resultados (gráficos, scores)
├── services/            # Lógica de negócios e integrações externas
│   └── geminiService.ts        # Cliente da API do Google Gemini e Prompt do Sistema
├── App.tsx              # Componente Raiz e Orquestrador de Telas
├── types.ts             # Definições de Tipos TypeScript (Modelos de Dados)
├── index.html           # Ponto de entrada HTML
├── package.json         # Dependências e scripts
└── tailwind.config.js   # (Suposto) Configurações de tema
```

---

## 4. Detalhes dos Módulos Principais

### `App.tsx`
- Gerencia o estado global da aplicação (input do usuário, resultado da análise, navegação entre abas).
- Implementa a lógica de upload de arquivos (convertendo imagens para Base64).
- Controla a alternância entre a "Visão de Home" (Input) e "Visão de Relatório".

### `services/geminiService.ts`
- Contém o **SYSTEM_PROMPT**: A "alma" da IA, definindo as personas (Phil, Dra. Camila, etc.) e as regras de saída JSON estrito.
- Instancia o `GoogleGenAI` e trata a resposta, garantindo que o JSON seja válido.

### `components/ReportDashboard.tsx`
- Responsável pela renderização visual rica ("Glassmorphism").
- Exibe o Score Geral (Gauge Chart), Sentimento e feedbacks individuais dos agentes.
- Renderiza o gráfico de barras verticais para o impacto nas personas.

### `types.ts`
Define a estrutura dos dados retornados pela IA, garantindo type-safety em todo o projeto:
```typescript
interface AnalysisResult {
  overall_score: number;
  sentiment: string;
  simulated_heatmap: { ... };
  agents_feedback: AgentFeedback[];
  persona_impact: PersonaImpact[];
  actionable_tips: string[];
  // ...
}
```

---

## 5. Configuração e Instalação

### Pré-requisitos
- Node.js instalado.
- Uma chave de API válida do Google Gemini (Google AI Studio).

### Passos
1. **Clonar/Baixar o repositório.**
2. **Instalar dependências:**
   ```bash
   npm install
   ```
3. **Configurar Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz e adicione:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_aqui
   # Nota: O código atual referencia process.env.API_KEY, ajuste conforme necessário para Vite (import.meta.env) 
   # ou configuração de build.
   ```
4. **Rodar em Desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 6. Observações para Manutenção

- **Prompt Engineering:** A qualidade da análise depende inteiramente do `SYSTEM_PROMPT` em `geminiService.ts`. Alterações lá afetam diretamente o comportamento dos "agentes".
- **Limites de Token:** Imagens muito pesadas podem consumir muitos tokens ou exceder limites da API. O frontend atualmente envia a imagem em Base64.
- **Segurança:** A chave de API está sendo usada no frontend. Para produção real, recomenda-se um backend proxy para ocultar a chave.
