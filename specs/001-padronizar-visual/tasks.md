# Tasks: Padronização visual do site

**Input**: Design documents from `/specs/001-padronizar-visual/`

**Prerequisites**: plan.md, spec.md

**Tests**: Não incluídos. A especificação não pede suíte automatizada. A validação fica na fase final.

**Organization**: Tarefas por história. O que já existe está marcado como concluído.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode seguir em paralelo (arquivo diferente, sem dependência)
- **[Story]**: História da spec (US1, US2, US3)
- Cada tarefa indica o arquivo

## Path Conventions

- App único em `src/`
- Sem pasta `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar que o projeto já está pronto. Não reinstalar nem atualizar dependências.

- [x] T001 Manter React, TypeScript, Vite, Tailwind CSS e shadcn/ui como já estão em `package.json` e `vite.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tema, cabeçalho e componentes de que as histórias dependem. Já estão no repositório.

- [x] T002 Manter tokens, fonte e base em `src/index.css`, a barra pública em `src/components/layout/SiteHeader.tsx`, o rodapé em `src/components/layout/SiteFooter.tsx` e os componentes em `src/components/ui/`

**Checkpoint**: Nada a instalar. As histórias seguintes só corrigem o que foge desse padrão.

---

## Phase 3: User Story 1 - Navegar do mesmo jeito no celular e no computador (Priority: P1) 🎯 MVP

**Goal**: Os seis destinos do menu público funcionam no celular e no computador. A área restrita usa a mesma barra, sem o menu institucional.

**Independent Test**: Em cerca de 390px e em cerca de 1280px, cada item do menu abre o destino atual. No painel deslogado, só a entrada com Google aparece.

### Implementation for User Story 1

- [x] T003 [P] [US1] Fazer os links de seção em `src/components/layout/SiteHeader.tsx` abrirem `#sobre`, `#portfolio`, `#softwares`, `#orcamento` e `#contato` também pelo menu do celular e a partir de outra página, e fechar o menu ao escolher
- [x] T004 [US1] Alinhar a barra de `src/pages/PainelPage.tsx` à barra pública (altura, borda, logo, padding, `max-w-6xl`) e incluir `src/components/layout/SiteFooter.tsx`, sem links institucionais e sem alterar login, `isAdmin`, `load` ou `signOut`
- [x] T005 [P] [US1] Usar o mesmo aviso "Carregando…" no fallback de `src/App.tsx`

**Checkpoint**: O menu e a barra restrita podem ser conferidos sem mexer em portfólio, cálculo ou formulário.

---

## Phase 4: User Story 2 - Ver os projetos com a mesma apresentação (Priority: P2)

**Goal**: O destaque da abertura, os títulos e a imagem ampliada usam o desenho já adotado na página inicial. Textos e imagens permanecem.

**Independent Test**: Na abertura, o selo de ferramentas usa o dourado do site. Um projeto aberto em tela estreita mostra imagem, legenda e os três controles.

### Implementation for User Story 2

- [x] T006 [P] [US2] Trocar o selo ciano/esmeralda de `src/components/home/Hero.tsx` pelas cores `primary` e pelos estilos de Button/Badge já existentes, mantendo o texto, "NOVO" e o destino `/ferramentas`
- [x] T007 [P] [US2] Ajustar o modo ampliado de `src/components/home/Portfolio.tsx` para que fechar, anterior, próxima e a legenda continuem acionáveis em tela estreita, sem editar `src/data/projects.ts`
- [x] T008 [US2] Aplicar o destaque lateral `border-l-4 border-primary` aos títulos de página em `src/pages/FerramentasPage.tsx` e `src/pages/PainelPage.tsx`, sem mudar o texto

**Checkpoint**: Portfólio e títulos conferidos. Cálculos e acesso ainda intactos.

---

## Phase 5: User Story 3 - Preencher formulários e entender o resultado (Priority: P3)

**Goal**: Listas parecem os outros campos, a calculadora cabe no celular e as mensagens usam os tons já existentes.

**Independent Test**: Trocar uma opção em Ferramentas e o status no painel. Sucesso, erro e aviso aparecem em texto junto da ação. Os números não mudam.

### Implementation for User Story 3

- [x] T009 [US3] Em `src/pages/FerramentasPage.tsx`, usar `src/components/ui/select.tsx` nas listas, preservar o preenchimento dos campos ao trocar o tipo de estaca, mostrar um Select compacto de calculadora abaixo de `lg` e a lista de botões a partir de `lg`, e colocar a tabela de vãos em `overflow-x-auto`. Não alterar `src/lib/tools-engine.ts` nem o miolo impresso de `Memorial`. Trocar `text-amber-300` dos avisos por `text-primary`
- [x] T010 [US3] Em `src/pages/PainelPage.tsx`, usar `src/components/ui/select.tsx` no filtro e no status do detalhe, com os valores atuais `novo`, `em análise`, `enviado`, `aprovado` e `recusado`. Trocar `text-emerald-300` por `text-primary`. Não alterar gravação, filtro nem exportação
- [x] T011 [P] [US3] Em `src/components/home/QuoteForm.tsx`, trocar `text-emerald-300` da mensagem de sucesso por `text-primary` e manter `text-destructive` no erro, sem alterar o cálculo

**Checkpoint**: Formulários e mensagens alinhados. Preços, resultados e permissões iguais aos de antes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Uma validação só, depois das alterações.

- [x] T012 Rodar `npm run build` e conferir `src/components/layout/SiteHeader.tsx`, `src/components/home/Portfolio.tsx`, `src/components/home/QuoteForm.tsx`, `src/pages/FerramentasPage.tsx` e `src/pages/PainelPage.tsx`: menu nas duas larguras, inclusive uma âncora a partir de Ferramentas; um projeto aberto em tela estreita; orçamento ainda exibindo total e total por m²; uma calculadora com lista ainda exibindo resultado; painel deslogado ainda na tela de Google, sem a lista

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Já concluída
- **Foundational (Phase 2)**: Já concluída. Não bloqueia mais nada
- **User Stories (Phase 3+)**: Podem avançar depois da Phase 2
- **Polish (Phase 6)**: Depois das histórias que forem implementadas

### User Story Dependencies

- **User Story 1 (P1)**: Sem dependência das outras. T003 e T005 são arquivos diferentes. T004 é o primeiro toque em `src/pages/PainelPage.tsx`
- **User Story 2 (P2)**: T006 e T007 não dependem de US1. T008 mexe em `FerramentasPage.tsx` e `PainelPage.tsx`, então vem depois de T004
- **User Story 3 (P3)**: T009 vem depois de T008. T010 vem depois de T004 e T008. T011 é só `QuoteForm.tsx` e pode seguir junto com T003, T005, T006 e T007

### Within Each User Story

- Sem testes automatizados antes da implementação
- Não há model nem serviço novo
- T012 é a única validação

### Parallel Opportunities

- T003, T005, T006, T007 e T011 podem andar juntos
- T004 antes de T008 e T010
- T008 antes de T009 e T010
- T009 e T010 podem andar juntos depois de T008

---

## Parallel Example: User Story 1

```text
T003 SiteHeader.tsx
T005 App.tsx
```

T004 fica de fora desse par porque T008 e T010 também editam `PainelPage.tsx`.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2 já estão feitas
2. Concluir T003, T004 e T005
3. Parar e conferir só o menu e a barra do painel
4. Não publicar

### Incremental Delivery

1. US1: navegação
2. US2: projetos e títulos
3. US3: listas e mensagens
4. T012 uma vez, no fim

### Parallel Team Strategy

1. Ao mesmo tempo: T003, T005, T006, T007, T011
2. Em seguida, uma pessoa em `PainelPage.tsx` (T004, depois T008 no título, depois T010) e outra em `FerramentasPage.tsx` (T008 no título, depois T009)
3. T012 por último

---

## Notes

- [P] = arquivo diferente, sem dependência aberta
- História no rótulo liga a tarefa à spec
- Não criar teste para troca só visual
- Commit e push só quando forem pedidos
- Não repetir T012 se o build e as checagens passarem
