---
name: ui-ux-design
description: >-
  Applies UI/UX best practices for forms, inputs, buttons, CTAs, loading states, skeletons,
  information architecture, navigation, breadcrumbs, responsive and mobile-first design,
  breakpoints, and form accessibility. Activates when creating or changing React/Inertia pages,
  forms, inputs, buttons, loading states, navigation, or responsive layouts; or when the user
  mentions UI, UX, form, button, loading, mobile-first, skeleton, or CTA.
---

# UI/UX Design

## When to Apply

Activate this skill when:
- Creating or altering React/Inertia pages, forms, inputs, or buttons
- Implementing loading states, skeletons, or progress indicators
- Designing or refining navigation, menus, breadcrumbs, or information hierarchy
- Working on responsive layouts or mobile-first breakpoints
- The user mentions UI, UX, formulário, botão, loading, mobile-first, skeleton, CTA, or design de interface

For accessibility implementation (e.g. associating label to input with `useId` and `htmlFor`), the project already follows `laravel-inertia-react-architecture` (see `react-inertia.md`). This skill focuses on **design criteria**: visible labels, inline validation, masks, button hierarchy, loading patterns, and responsive rules.

---

## Formulários e inputs

- **Labels sempre visíveis:** Não confiar apenas em placeholder; manter label visível acima ou ao lado do campo.
- **Validação inline:** Mostrar erros próximos ao campo, de forma clara e imediata após blur ou submit.
- **Máscaras:** Usar máscaras adequadas para CPF, telefone, CEP etc., mantendo o campo legível e o valor limpo para o backend.
- **Tamanho do campo:** Largura/altura adequada ao conteúdo esperado (ex.: CEP curto, descrição longa em textarea).
- **Hierarquia de botões:** Primário para ação principal (ex.: "Salvar"); secundário para cancelar ou ações alternativas.
- **Mobile:** Usar `inputmode="tel"`, `inputmode="numeric"` ou `inputmode="email"` quando apropriado para teclado adequado no mobile.

---

## Botões e CTAs

- **Hierarquia visual:** Primário (destaque), secundário (contorno ou tom neutro), terciário (texto ou link).
- **Microcópia acionável:** Texto do botão deve descrever a ação ("Criar conta", "Enviar pedido"), não genérico ("OK", "Enviar" sem contexto).
- **Estados:** Garantir estados hover, active, focus e disabled visíveis e consistentes.
- **Área de toque:** Mínimo 44–48px de altura/largura em elementos clicáveis para uso em touch.
- **Consistência:** Manter forma e estilo coerentes no app (ex.: pill-shaped ou cantos arredondados definidos).
- **Loading no botão:** Após clique em ação assíncrona, mostrar estado de loading no próprio botão (spinner + texto desabilitado ou "Carregando...") em vez de só desabilitar.

---

## Estados de carregamento

- **&lt; 300ms:** Não exibir loader; a transição pode ser imperceptível.
- **300ms–2s:** Usar skeleton com shimmer; dimensões do skeleton devem corresponder ao conteúdo final para evitar layout shift.
- **&gt; 2s:** Considerar barra de progresso ou spinner com texto explicativo ("Carregando dados...").
- **Progressive loading:** Carregar acima da dobra primeiro; lazy load ou paginação para listas longas.
- **Estado otimista:** Para ações que o usuário espera instantâneas (ex.: like, favoritar), atualizar a UI imediatamente e reverter em caso de erro.

---

## Arquitetura de informação

- **Regra dos 3 cliques:** Conteúdo importante acessível em até três cliques a partir da entrada principal.
- **Agrupamento lógico (Gestalt):** Agrupar itens relacionados (proximidade, similaridade); rotulagem clara de seções.
- **Menu e rodapé:** Estrutura consistente entre páginas; itens de navegação previsíveis.
- **Breadcrumbs:** Usar em estruturas profundas (ex.: Categoria > Produto > Detalhe) para contexto e retorno.
- **Triângulo:** Equilibrar Contexto (onde estou), Conteúdo (o que é exibido) e Ações do usuário (o que posso fazer).

---

## Responsivo e mobile-first

- **Mobile-first:** Desenvolver e testar primeiro para viewport pequeno; depois escalar para tablet e desktop.
- **Área de toque:** Mínimo 44×44px para alvos tocáveis; espaço (gap) entre elementos para evitar cliques acidentais.
- **Tipografia:** Preferir rem/em para escalar com preferências do usuário e consistência entre breakpoints.
- **Imagens:** Flexíveis (`max-width: 100%`); usar `srcset`/`picture` quando houver múltiplos tamanhos.
- **Above the fold:** Ordenar conteúdo por importância; informação crítica visível sem scroll excessivo no mobile.
- **Breakpoints:** Definir por conteúdo e leitura (onde o layout quebra), não por dispositivo fixo.
- **Larguras:** Evitar larguras fixas em px para conteúdo fluido; usar max-width, porcentagens ou unidades de container.

---

## Referências

- **Checklist de review:** `.cursor/skills/ui-ux-design/references/checklist.md` — uso em revisão de telas e formulários.
