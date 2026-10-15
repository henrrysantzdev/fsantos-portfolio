# Feature Specification: Padronização visual do site

**Feature Branch**: `001-padronizar-visual`

**Created**: 2026-10-14

**Status**: Ready

**Input**: User description: "Padronizar visualmente portfólio, orçamento, ferramentas e painel, no celular e no computador, preservando informações e funcionalidades. Especificar só o que falta."

## Já pronto

O visitante já encontra as quatro áreas no mesmo fundo escuro, com o dourado de destaque e a mesma fonte. A página inicial tem cabeçalho, rodapé, seções, grade de projetos com filtros e visualização de imagens. O orçamento já calcula, mostra a tabela de preços e oferece o WhatsApp. As ferramentas já calculam, exibem passo a passo, aviso e memória para impressão. O painel já restringe o acesso, lista orçamentos, filtra, atualiza status e exporta. No celular, as seções já empilham e as tabelas largas do orçamento e do painel já rolam para o lado.

Esta especificação não reabre esse comportamento.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar do mesmo jeito no celular e no computador (Priority: P1)

Quem visita o site usa o menu para chegar em Sobre, Portfólio, Softwares, Ferramentas, Orçamento e Contato. No celular, esses destinos são os mesmos do computador, inclusive quando a pessoa já está em Ferramentas ou no Painel e volta para uma seção da página inicial. A área restrita continua com barra própria, curta, alinhada à barra pública, sem o menu institucional.

**Why this priority**: Sem o menu, as outras áreas não se sustentam como um site só.

**Independent Test**: Em uma tela estreita e em uma tela larga, cada item do menu público abre o destino que já existe hoje.

**Acceptance Scenarios**:

1. **Given** a página inicial no celular, **When** a pessoa abre o menu e escolhe uma seção, **Then** a página vai até essa seção e o menu fecha.
2. **Given** Ferramentas ou qualquer outra página, **When** a pessoa escolhe Orçamento, Portfólio, Sobre, Softwares ou Contato, **Then** a página inicial abre já na seção correspondente.
3. **Given** a área restrita, **When** a pessoa olha o topo, **Then** vê a mesma marca, altura e separação da barra pública, com e-mail e Sair legíveis no celular, e não vê o menu institucional.
4. **Given** uma página ainda carregando, **When** o conteúdo não chegou, **Then** aparece o mesmo aviso curto de carregamento usado no restante do site.

---

### User Story 2 - Ver os projetos com a mesma apresentação (Priority: P2)

Os projetos continuam com os mesmos títulos, resumos, categorias, quantidades e imagens. O que muda é a leitura: o destaque de ferramentas na abertura usa as cores já adotadas no site, os títulos de Ferramentas e do Painel seguem o mesmo desenho dos títulos da página inicial, e a visualização ampliada continua utilizável em uma tela estreita.

**Why this priority**: O portfólio é o conteúdo principal que o visitante compara entre celular e computador.

**Independent Test**: Abrir a página inicial e um projeto com várias imagens em uma tela de cerca de 390px de largura, sem perder legenda nem fechar.

**Acceptance Scenarios**:

1. **Given** a abertura do site, **When** o destaque de ferramentas aparece, **Then** ele usa as cores já presentes no site e mantém o texto, o aviso de novidade e o destino atuais.
2. **Given** um projeto aberto, **When** a tela é estreita, **Then** a imagem, a legenda com o nome e a posição, e os controles de fechar, anterior e próxima permanecem acionáveis sem cobrir a legenda.
3. **Given** Ferramentas e a lista do painel, **When** a pessoa lê o título da página, **Then** o título segue o mesmo destaque lateral usado nas seções da página inicial, com o mesmo texto de hoje.

---

### User Story 3 - Preencher formulários e entender o resultado (Priority: P3)

Campos de escolha em Ferramentas e no Painel têm a mesma aparência dos outros campos do site, no celular e no computador. Mensagens de sucesso, erro, aviso e carregamento ficam junto da ação que as provocou e usam a mesma linguagem visual. A lista de calculadoras não empurra o formulário para baixo de todas as opções quando a tela é estreita. Tabelas largas rolam dentro da própria área.

**Why this priority**: Orçamento, cálculo e acompanhamento já funcionam; a falha é só de clareza visual.

**Independent Test**: Trocar uma opção de lista em Ferramentas e no filtro do painel, e provocar uma mensagem de sucesso e uma de erro, sem alterar números, status ou permissões.

**Acceptance Scenarios**:

1. **Given** uma calculadora com lista de opções, **When** a pessoa escolhe um valor, **Then** o campo parece os demais campos e o cálculo continua o mesmo, inclusive quando a escolha preenche outros dados da ferramenta.
2. **Given** o celular em Ferramentas, **When** a página abre, **Then** a pessoa troca de calculadora sem percorrer a lista inteira antes do formulário, e a tabela larga da ferramenta rola para o lado.
3. **Given** o painel de um administrador, **When** filtra ou edita o status, **Then** as opções continuam as de hoje e o campo combina com os outros campos.
4. **Given** salvar orçamento, entrar no painel, calcular com dado inválido ou receber um aviso da ferramenta, **When** a operação termina, **Then** a mensagem é texto visível junto da ação: erro no tom de erro já usado, sucesso e aviso nos tons já usados pelo site, sem uma cor nova.

### Edge Cases

- Projeto com uma única imagem: anterior e próxima continuam disponíveis e não quebram a legenda.
- Menu do celular aberto e a pessoa escolhe uma seção: o menu fecha e a seção fica visível abaixo da barra fixa.
- Tabela de orçamento, lista do painel ou tabela de vãos mais larga que a tela: a rolagem fica na tabela, não na página inteira.
- Login negado ou falha ao carregar orçamentos: a mensagem permanece visível e a lista restrita não aparece para quem não tem acesso.
- Memória de cálculo e proposta impressa: permanecem documentos claros para papel, fora da padronização das telas escuras.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O menu público DEVE levar a Sobre, Portfólio, Softwares, Ferramentas, Orçamento e Contato no celular e no computador, a partir da página inicial e das outras páginas.
- **FR-002**: A área restrita DEVE manter barra curta, visualmente alinhada à barra pública, sem o menu institucional, e DEVE manter e-mail e saída legíveis em tela estreita.
- **FR-003**: O aviso de carregamento DEVE ser o mesmo em todas as trocas de página.
- **FR-004**: Títulos, textos, imagens, categorias, contatos, preços, fórmulas, dados de clientes e opções de status DEVEM permanecer os atuais.
- **FR-005**: A visualização ampliada de um projeto DEVE manter imagem, legenda e controles acionáveis em tela estreita.
- **FR-006**: O destaque de ferramentas na abertura e os títulos de Ferramentas e do Painel DEVEM usar o desenho e as cores já adotados nas seções da página inicial.
- **FR-007**: Listas de opções em Ferramentas e no Painel DEVEM parecer os outros campos e DEVEM preservar o efeito atual de cada escolha.
- **FR-008**: Em tela estreita, a troca de calculadora DEVE acontecer sem exigir percorrer todas as calculadoras antes do formulário.
- **FR-009**: Sucesso, erro, aviso e carregamento DEVEM aparecer como texto junto da operação, com os tons já existentes de erro e de destaque. Nenhuma cor nova DEVE ser introduzida.
- **FR-010**: Acesso restrito, cálculos, gravação de orçamentos, exportação e impressão DEVEM continuar com as mesmas regras e os mesmos resultados.
- **FR-011**: Logotipo novo, funcionalidade nova, mudança de preço ou fórmula, mudança de permissão e troca de serviço estão fora desta entrega.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma tela de cerca de 390px e em uma de cerca de 1280px, os seis destinos do menu público abrem em uma ação, sem rolagem horizontal da página.
- **SC-002**: Os projetos visíveis hoje continuam com o mesmo título, resumo, categoria, quantidade de imagens e arquivos de imagem.
- **SC-003**: Os mesmos dados de orçamento exibem os mesmos preços, totais e total por metro quadrado.
- **SC-004**: Os mesmos dados de uma calculadora exibem o mesmo resultado numérico e os mesmos avisos.
- **SC-005**: Quem não é o administrador continua sem ver a lista de orçamentos; o administrador continua vendo e filtrando.
- **SC-006**: Cada operação de salvar, entrar, calcular ou filtrar mostra texto de sucesso, erro ou aviso na própria tela, sem depender só da cor.

## Assumptions

- A área restrita não recebe o menu institucional; a consistência é da barra, da marca e dos campos, não da navegação pública.
- Mensagens continuam no próprio formulário ou painel. Não há um novo sistema de avisos flutuantes.
- A paleta permanece a atual. Cores soltas que hoje fogem dela passam a usar o destaque e o erro já existentes.
- A marca não muda. O arquivo de logo atual permanece até a entrega separada da logo nova.
- Documentos de impressão da proposta e da memória de cálculo ficam como estão.
- Não há pergunta em aberto que impeça definir o resultado.
