# Checklist UI/UX (review)

Use este checklist ao revisar telas, formulários e fluxos que envolvem front-end.

## Formulários e inputs

- [ ] Labels sempre visíveis (não apenas placeholder)
- [ ] Validação inline e mensagens claras
- [ ] Máscaras quando aplicável (CPF, telefone, CEP)
- [ ] Tamanho do campo adequado ao conteúdo
- [ ] Hierarquia de botões (primário/secundário) respeitada
- [ ] `inputmode` adequado em campos numéricos/tel/email (mobile)

## Botões e CTAs

- [ ] Hierarquia visual (primário/secundário/terciário)
- [ ] Microcópia acionável (texto descreve a ação)
- [ ] Estados hover/active/focus/disabled visíveis
- [ ] Área de toque mínima 44–48px
- [ ] Loading state no botão após clique (quando ação é assíncrona)

## Estados de carregamento

- [ ] &lt; 300ms: sem loader
- [ ] 300ms–2s: skeleton com shimmer; dimensões iguais ao conteúdo final
- [ ] &gt; 2s: barra de progresso ou spinner + texto
- [ ] Progressive loading / estado otimista quando fizer sentido

## Arquitetura de informação

- [ ] Regra dos 3 cliques respeitada
- [ ] Agrupamento lógico e rotulagem clara
- [ ] Menu/rodapé consistentes
- [ ] Breadcrumbs em estruturas profundas

## Responsivo e mobile-first

- [ ] Desenvolvido/testado primeiro para mobile
- [ ] Área de toque e gap entre elementos adequados
- [ ] Tipografia em rem/em
- [ ] Imagens flexíveis (max-width, srcset/picture se aplicável)
- [ ] Breakpoints por conteúdo; evitar larguras fixas desnecessárias
