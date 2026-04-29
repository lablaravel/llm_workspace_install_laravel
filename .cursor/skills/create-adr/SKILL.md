---
name: create-adr
description: Cria Architecture Decision Records (ADRs) no repositório. Use quando o usuário pedir "criar ADR", "escrever ADR", "documentar decisão arquitetural", "registrar por que escolhemos X" ou após uma decisão técnica significativa já tomada. Não use quando a decisão ainda não existe (use discussão na task Jira ou PRD até fechar o tema); não substitui TDD/Spec de implementação.
---

# Create ADR (Architecture Decision Record)

Documenta **decisões arquiteturais já tomadas** para quem entrar no projeto meses depois entender o **porquê**, não o passo a passo de código.

## Quando usar / quando não usar

| Situação | Usar este skill? |
|----------|------------------|
| "Já decidimos usar X" e quer registrar contexto, opções e trade-offs | Sim |
| "Precisamos decidir entre A e B" (ainda em aberto) | Não — trate na task/PRD/comentários; ADR vem **depois** da decisão |
| Plano de implementação, casos de teste, APIs detalhadas | Não — use **TDD** ou **Spec** (skill `spec-generation`) |
| Configuração trivial ou preferência de nome de variável | Não |

**Regra:** RFC/proposta **conduz** a decisão; **ADR registra** a decisão. Use o skill **`create-rfc`** (e `.cursor/docs/rfc/`) para a fase deliberativa estruturada; Jira/PRD continuam válidos para contexto ágil.

## Idioma e termos

- Corpo e títulos de seções em **português**.
- Termos técnicos usuais em inglês quando for o padrão da equipe (API, cache, ADR, RFC).

## Onde salvar e numeração

- **Diretório:** `.cursor/docs/adr/`
- **Arquivo:** `ADR-{NNN}-{titulo-kebab}.md` com `NNN` em três dígitos (`001`, `002`, …).
- **Próximo número:** listar arquivos `ADR-*.md` na pasta (ignorar `_TEMPLATE*`), extrair o maior `NNN` e somar 1. Se houver colisão de número (dois `ADR-003-*`), corrigir antes de criar outro — numeração deve ser **única**.
- **Task Jira:** preencher `task_id` / `task_url` na metadata quando o ADR nascer de uma task; o vínculo com Confluence segue o skill `spec-generation` / `confluence-integration`.

## Sincronização Confluence / Jira

Este skill cuida do **conteúdo e da estrutura** do ADR local. Para publicar na pasta da task no Confluence e comentar no Jira, **seguir o fluxo** em `spec-generation` (Passos 4–5) após o arquivo existir.

## Formatos (escolher um)

| Formato | Quando preferir |
|---------|------------------|
| **MADR** | Várias opções reais foram comparadas; quer tabela de prós/contras |
| **Nygard** | Decisão direta; poucas alternativas |
| **Y-Statement** | Uma decisão pequena ou resumo executivo no mesmo arquivo |

**Padrão:** MADR, salvo pedido explícito em contrário.

### Campos obrigatórios (qualquer formato)

Antes de finalizar, o ADR precisa de:

1. **Título** — frase nominal no passado/decisão: "Uso de PostgreSQL como banco principal", não "Devemos usar PostgreSQL?".
2. **Data** da decisão (ou da redação do ADR).
3. **Status:** Proposto | Aceito | Depreciado | Substituído (e, se Substituído, link para o ADR novo).
4. **Contexto** — forças e restrições que **obrigaram** a decidir, não só "precisávamos de um banco".
5. **Decisão** — o que foi escolhido e **por que não** as outras opções (racional breve).
6. **Consequências** — benefícios **e** custos honestos.

### Imutabilidade

- ADR **aceito** não se edita para mudar a decisão: crie **novo** ADR, marque o antigo como **Substituído** e referencie os dois.

## Checklist de qualidade

- [ ] Título é decisão, não pergunta
- [ ] Há data e status corretos
- [ ] Contexto explica pressões (técnico, negócio, equipe), não só o resultado
- [ ] Consequências negativas estão explícitas
- [ ] (MADR) Pelo menos duas alternativas reais consideradas
- [ ] Links: task Jira, ADRs relacionados, supersede/supersedido quando couber
- [ ] Texto enxuto (meta **200–500 palavras**; detalhe longo vai para TDD/Spec/PRD)

## Anti-padrões

- ADR virar **lista de tarefas de implementação** — extrair para Spec/TDD.
- Só elogios, sem trade-offs — perde credibilidade para o futuro.
- Misturar "ainda vamos decidir" com ADR final — use status **Proposto** só se a equipe já convergiu numa recomendação explícita.

## Referências no projeto

- Template e metadata: `.cursor/docs/adr/_TEMPLATE.md`
- Publicação e links: `spec-generation`, `confluence-integration`, `task-workflow`
- Inspiração de formato: [ADR Creator README](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(creation)/create-adr/README.md) / [SKILL](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(creation)/create-adr/SKILL.md) (tech-leads-club)
