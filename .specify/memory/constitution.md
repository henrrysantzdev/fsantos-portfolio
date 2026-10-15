<!--
Sync Impact Report
- Version change: unversioned template → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Simplicidade
  - [PRINCIPLE_2_NAME] → II. Reuso do existente
  - [PRINCIPLE_3_NAME] → III. Fidelidade do conteúdo
  - [PRINCIPLE_4_NAME] → IV. Não destruição
  - [PRINCIPLE_5_NAME] → V. Segurança do Firebase
- Added sections:
  - Escopo e verificação
  - Decisão e entrega
- Removed sections: none (placeholders replaced; no prior ratified text)
- Follow-up TODOs: none
-->

# FSantos Engenharia Constitution

## Core Principles

### I. Simplicidade

O trabalho DEVE fazer o básico bem feito e DEVE escolher a solução mais simples que atenda ao pedido.

Rationale: elaboração extra aumenta risco sem um pedido que a justifique.

### II. Reuso do existente

O trabalho DEVE aproveitar o código, os componentes e as dependências existentes. Abstrações, bibliotecas ou refatorações novas só DEVEM ser criadas quando houver necessidade concreta.

Rationale: o site já tem stack, rotas e componentes em uso; duplicá-los sem motivo concreto dispersa a manutenção.

### III. Fidelidade do conteúdo

Textos, imagens, projetos, contatos, links, preços, fórmulas, dados de clientes e configurações do site DEVEM ser preservados. Informação NÃO DEVE ser inventada nem substituída sem solicitação.

### IV. Não destruição

Arquivos ou dados NÃO DEVEM ser excluídos para facilitar a implementação. Quando uma substituição for necessária, DEVE haver uma forma de recuperar o conteúdo original.

### V. Segurança do Firebase

Autenticação, permissões e regras do Firebase DEVEM ser preservadas. Segredos NÃO DEVEM ser expostos. Controles de acesso NÃO DEVEM ser enfraquecidos.

## Escopo e verificação

A inspeção DEVE limitar-se aos arquivos relevantes. Contexto já obtido DEVE ser reutilizado. Leituras ou verificações NÃO DEVEM ser repetidas sem motivo.

As verificações DEVEM ser proporcionais ao risco. Depois que os checks relevantes passarem, o trabalho DEVE encerrar. A repetição só DEVE ocorrer se houver mudança posterior, falha ou dúvida concreta.

Mudanças triviais de texto ou aparência NÃO DEVEM receber testes novos. Cálculos, dados e autorização DEVEM ter verificação direcionada ao comportamento afetado.

## Decisão e entrega

Decisões rotineiras DEVEM ser resolvidas com bom senso. Uma pergunta só DEVE ser feita quando faltar informação que afete escopo, conteúdo, segurança ou comportamento.

Serviços de produção NÃO DEVEM ser alterados, e publicação, commit ou push NÃO DEVEM ocorrer, sem pedido explícito.

O encerramento DEVE informar brevemente o que mudou, o que foi validado e qualquer pendência real.

## Governance

Esta constituição prevalece sobre preferências locais de implementação quando houver conflito. Emendas exigem solicitação explícita e atualização deste arquivo.

O versionamento segue semver:

- MAJOR: remoção ou redefinição incompatível de um princípio.
- MINOR: princípio ou seção nova, ou expansão material de uma regra.
- PATCH: esclarecimento, redação ou correção sem mudança de sentido.

A data de ratificação permanece a da adoção inicial. A data da última emenda muda a cada alteração deste arquivo.

A revisão de conformidade é o relato de encerramento: o que mudou, o que foi validado e as pendências reais. Commit e push deste arquivo exigem pedido explícito, como qualquer outro arquivo do repositório.

**Version**: 1.0.0 | **Ratified**: 2026-10-14 | **Last Amended**: 2026-10-14
