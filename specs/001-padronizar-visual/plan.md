# Implementation Plan: Padronização visual do site

**Branch**: `001-padronizar-visual` | **Date**: 2026-10-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-padronizar-visual/spec.md`

## Summary

Alinhar menu, títulos, listas, mensagens e a visualização dos projetos ao que a página inicial já faz. A stack permanece React, TypeScript, Vite, Tailwind CSS e os componentes shadcn/ui já instalados. Nenhuma dependência é instalada ou atualizada.

Não há pesquisa pendente, entidade nova nem contrato novo. Por isso este plano não cria `research.md`, `data-model.md`, `contracts/` nem `quickstart.md`. A validação fica na última tarefa.

## Technical Context

**Language/Version**: TypeScript com React 19, no Vite já configurado

**Primary Dependencies**: Tailwind CSS 4, componentes em `src/components/ui/` (Button, Input, Label, Card, Badge, Sheet, Table, Dialog, Select). Select existe e ainda não é usado nas listas nativas.

**Storage**: N/A para esta entrega. Firestore e as regras atuais permanecem.

**Testing**: Sem suíte automatizada no repositório. Validação = `npm run build` e checagens manuais dos fluxos afetados. Sem teste novo para troca só de aparência.

**Target Platform**: Navegador, celular (cerca de 390px) e computador (cerca de 1280px)

**Project Type**: Site estático com áreas autenticadas no cliente

**Performance Goals**: N/A. Não há meta nova de desempenho.

**Constraints**: Preservar textos, imagens, contatos, preços, fórmulas, dados e acesso restrito. Não excluir arquivos. Não alterar produção, commit ou push. Não trocar o arquivo da logo.

**Scale/Scope**: Quatro superfícies já existentes: início (portfólio e orçamento), ferramentas, painel e a barra compartilhada.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Simplicidade**: PASS. Só classes e o Select já existente. Sem biblioteca nova.
- **II. Reuso**: PASS. `SiteHeader`, `SiteFooter`, tokens em `src/index.css` e `src/components/ui/select.tsx`.
- **III. Fidelidade**: PASS. Nenhuma cópia, preço, imagem ou opção de status muda.
- **IV. Não destruição**: PASS. Nenhum arquivo sai. A memória de cálculo e a proposta impressa ficam no arquivo.
- **V. Firebase**: PASS. `src/lib/firebase.ts`, `firestore.rules` e as funções de login, leitura e gravação não entram no diff.
- **Verificação**: PASS. Build no fim. Checagem extra só onde o controle de uma calculadora continua ligado ao cálculo. Sem revalidar todas as fórmulas.
- **Entrega**: PASS. Sem publicação.

Revisão após o desenho: os mesmos gates seguem PASS. Não há violação a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/001-padronizar-visual/
├── spec.md
├── plan.md
├── tasks.md
└── checklists/requirements.md
```

`research.md`, `data-model.md`, `contracts/` e `quickstart.md` ficam de fora: não há decisão técnica em aberto, não há dado novo e não há interface nova.

### Source Code (repository root)

```text
src/
├── App.tsx
├── index.css
├── components/
│   ├── home/Hero.tsx
│   ├── home/Portfolio.tsx
│   ├── home/QuoteForm.tsx
│   ├── layout/SiteHeader.tsx
│   ├── layout/SiteFooter.tsx
│   └── ui/select.tsx
└── pages/
    ├── FerramentasPage.tsx
    └── PainelPage.tsx
```

**Structure Decision**: Um único app em `src/`. O tema e o cabeçalho público já existem; o trabalho é corrigir os pontos que fogem deles.

## Alterações necessárias

1. **Menu** — `src/components/layout/SiteHeader.tsx`
   No celular o menu usa `Link` para `/#secao`. No computador usa `a`. Os dois precisam abrir a mesma âncora, também quando a pessoa está em `/ferramentas` ou `/painel`. O menu fecha depois do toque. Não criar outro menu.

2. **Barra da área restrita** — `src/pages/PainelPage.tsx` e `src/components/layout/SiteFooter.tsx`
   A barra do painel fica com a mesma altura, borda, logo e padding da barra pública, dentro de `max-w-6xl`. E-mail e Sair quebram linha no celular. Incluir o rodapé já existente. Não acrescentar os links institucionais. Não alterar `entrar`, `signOut`, `isAdmin` nem `load`.

3. **Carregamento** — `src/App.tsx`
   O fallback do `Suspense` usa o mesmo texto "Carregando…" já usado no painel, com o recuo das páginas.

4. **Abertura** — `src/components/home/Hero.tsx`
   O selo de ferramentas deixa de usar ciano e esmeralda e passa a usar `primary` e o Button/Badge já existentes. Texto, "NOVO" e destino `/ferramentas` permanecem. Setas e pontos do slider ficam como estão.

5. **Projetos** — `src/components/home/Portfolio.tsx`
   No modo ampliado, em tela estreita, fechar, anterior, próxima e a legenda não se cobrem. Dados em `src/data/projects.ts` não mudam.

6. **Títulos** — `src/pages/FerramentasPage.tsx` e `src/pages/PainelPage.tsx`
   O título da página ganha o mesmo destaque lateral das seções da home (`border-l-4 border-primary`). O texto do título não muda.

7. **Listas e celular em Ferramentas** — `src/pages/FerramentasPage.tsx` e `src/components/ui/select.tsx`
   Trocar os `<select>` nativos pelo Select existente, com as mesmas opções. A troca de tipo de estaca continua preenchendo os outros campos. Abaixo de `lg`, a lista longa de botões não antecede o formulário: um Select compacto troca a calculadora e a lista de botões permanece em `lg`. A tabela de vãos entra em `overflow-x-auto`. Não editar `src/lib/tools-engine.ts` nem o miolo de impressão de `Memorial`.

8. **Listas do painel** — `src/pages/PainelPage.tsx`
   Filtro de status e status do detalhe usam o mesmo Select, com os valores atuais de `STATUS`. A filtragem e a gravação não mudam.

9. **Mensagens** — `src/components/home/QuoteForm.tsx`, `src/pages/PainelPage.tsx`, `src/pages/FerramentasPage.tsx`
   Trocar `text-emerald-300` e `text-amber-300` por `text-primary` no sucesso e no aviso. Erro continua `text-destructive`. O texto da mensagem não muda.

## O que não entra

- `package.json`, `package-lock.json`, `src/index.css` (os tokens já bastam)
- `src/lib/orcamento.ts`, `src/lib/tools-engine.ts`, `src/lib/firebase.ts`, `src/data/projects.ts`
- `firestore.rules`, `src/components/proposta/PropostaView.tsx`
- Conteúdo impresso da memória de cálculo dentro de `FerramentasPage.tsx`

## Preservar o comportamento

- Âncoras: `#sobre`, `#portfolio`, `#softwares`, `#orcamento`, `#contato`, mais `/ferramentas`.
- Cálculo do orçamento e das ferramentas: mesma função, mesmos campos. A única ligação a cuidar é o `onChange` do tipo de estaca.
- Painel: a lista só aparece com o administrador já reconhecido. Status continuam `novo`, `em análise`, `enviado`, `aprovado`, `recusado`.
- Impressão da proposta e da memória permanece página clara.

## Validação

Uma etapa, no fim:

- `npm run build`
- Menu público nas duas larguras, incluindo uma âncora a partir de Ferramentas
- Abrir um projeto e ler a legenda em tela estreita
- Orçamento: a tabela continua mostrando total e total por m² com os dados já preenchidos, sem revisar fórmula por fórmula
- Uma calculadora com lista: trocar a opção e ver que o resultado ainda aparece
- Painel deslogado: continua a tela de entrada com Google, sem a lista

Sem suíte nova. Sem repetir a validação se o build e essas checagens passarem.
