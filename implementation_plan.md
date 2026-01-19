# Plano de Implementação: Menu Flutuante e Ajustes de Layout

## Contexto
O usuário solicitou a remoção do menu lateral (sidebar) e a inclusão de um **Menu Flutuante** posicionado na parte inferior central da tela, sobrepondo a tag "Made with unicorn.studio" vista no design de referência. O cabeçalho (header) deve ser mantido. O sistema de design utiliza Tailwind CSS, fontes DM Sans/Poppins e um tema dark.

## Objetivos
1. **Remover Sidebar**: Garantir que nenhum componente de menu lateral esteja presente no layout.
2. **Criar Menu Flutuante**: Implementar um componente `FloatingMenu` visualmente premium.
3. **Posicionar**: Fixar o menu na parte inferior central.
4. **Integração**: Adicionar o menu à página principal (`page.tsx`).

## Estrutura do Menu Flutuante
O menu deve conter ações rápidas ou navegação. Com base no screenshot e contexto, sugerem-se ícones ou textos curtos. Como o conteúdo exato do menu não foi especificado, usaremos itens genéricos (ex: Home, Histórico, Novo, Configurações) que podem ser customizados posteriormente, mantendo a estética "Glassmorphism" do projeto.

## Tarefas

- [x] **Verificação de Limpeza**: Confirmar ausência de código de sidebar em `layout.tsx` e `page.tsx`.
- [x] **Componente `FloatingMenu`**:
    - Criar `components/FloatingMenu.tsx`.
    - Estilo: Fixed positioning (`bottom-8`), centralizado (`left-1/2 -translate-x-1/2`), fundo glassmorphism (`backdrop-blur`), bordas arredondadas e sombras.
- [x] **Atualização da Home (`page.tsx`)**:
    - Importar e inserir `<FloatingMenu />` dentro da tag `<main>` ou diretamente no `<div>` raiz (para garantir position fixed relativo à viewport).
- [x] **Estilização Fina**:
    - Garantir que o z-index seja alto (`z-50`) para sobrepor outros elementos.
    - Adicionar micro-interações (hover effects).
- [x] **Correção da IA (Gemini)**:
    - Atualizar `services/geminiService.ts` para usar `gemini-2.0-flash`.
    - Atualizar `services/geminiService.ts` para usar `import.meta.env.VITE_GEMINI_API_KEY`.
    - Adicionar `VITE_GEMINI_API_KEY` ao `.env.local`.
- [x] **Correção Layout Review**:
    - Verificar alternância de background no `App.tsx` (Unicorn Studio project switch).

## Diretrizes de Estilo
- **Cores**: Dark mode (pretos/cinzas translúcidos), acentos em branco ou azul (compatível com `globals.css`).
- **Animação**: Transições suaves (`transition-all duration-300`).

## Referências
- `@[commands/commands/ai-coders.md]`
- Design System: Tailwind + Globals.css
