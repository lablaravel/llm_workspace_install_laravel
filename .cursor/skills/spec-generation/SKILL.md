---
name: spec-generation
description: Geração de documentação de especificação (PRD, TDD, ADR, RFC) com sincronização automática para Confluence. Use quando precisar criar Product Requirements Documents, Test-Driven Development specs, Architecture Decision Records ou Request for Comments. Automaticamente sincroniza com Confluence e vincula à task Jira.
allowed-tools: Read, Write, Glob, user-atlassian-createConfluencePage, user-atlassian-updateConfluencePage, user-atlassian-searchConfluenceUsingCql, user-atlassian-getConfluenceSpaces, user-atlassian-getConfluencePage, user-atlassian-editJiraIssue, user-atlassian-addCommentToJiraIssue
---

# Spec Generation

> Geração de documentação de especificação com integração Confluence/Jira/GitHub

## Quando Usar

Use este skill na fase **P - Plan** do workflow R-P-I para criar:
- **PRD**: Product Requirements Document (features complexas)
- **RFC**: Request for Comments (proposta **antes** da decisão; alinhamento e opções)
- **TDD**: Test-Driven Development specs (lógica complexa/crítica)
- **ADR**: Architecture Decision Record (decisões arquiteturais **já tomadas**)

> **Nota:** BDD (Behavior-Driven Development) não é mais um documento separado. Os critérios de aceite em formato Gherkin ficam integrados na descrição da task do Jira através do template `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`.

## Fluxo Completo de Criação

### Workflow Integrado

```
┌─────────────────────────────────────────┐
│ 1. CRIAR SPEC LOCAL                      │
├─────────────────────────────────────────┤
│ • Gerar arquivo na pasta do tipo:        │
│   prd/, rfc/, tdd/, adr/, specs/, jira/  │
│ • Nomenclatura: {TASK_ID} + título       │
│ • Seguir template em .cursor/docs/{tipo}/│
│ • Incluir metadata com task e links      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. SINCRONIZAR COM CONFLUENCE            │
├─────────────────────────────────────────┤
│ • Criar ou usar pasta da task no         │
│   Confluence ({TASK_ID} - {Título})      │
│ • Criar página como subpágina dessa pasta│
│   (PRD, RFC, TDD, ADR e Spec —            │
│   Refinamento NÃO vai para Confluence)    │
│ • Registrar confluence_page_id no local  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. VINCULAR À TASK JIRA                  │
├─────────────────────────────────────────┤
│ • Adicionar link na descrição da task    │
│ • Ou comentário: "📄 Spec criada: [link]"│
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. PREPARAR PARA PR                      │
├─────────────────────────────────────────┤
│ • Salvar URL para uso no PR              │
│ • Registrar em metadata local            │
└─────────────────────────────────────────┘
```

## Tipos de Documentação

### PRD - Product Requirements Document

**Quando usar:**
- Features novas ou significativas
- Mudanças que impactam múltiplos usuários
- Funcionalidades que requerem planejamento detalhado

**Localização local:** `.cursor/docs/prd/PRD-{TASK_ID}.md`
**Localização Confluence:** Dentro da **pasta da task** `{TASK_ID} - {título}` (criar subpágina PRD).

### RFC - Request for Comments

**Quando usar:**
- Decisão ainda **não** fechada e precisa de opções, critérios e aprovadores explícitos
- Impacto alto, múltiplos stakeholders, escolha de fornecedor/arquitetura em discussão

**Quando não usar:** direção já aprovada — use **ADR** (registro) e **TDD** (implementação).

**Conteúdo (RACI, critérios antes das opções, status quo, Outcome):** skill **`create-rfc`**.

**Localização local:** `.cursor/docs/rfc/RFC-{TASK_ID}-{titulo-kebab}.md`
**Localização Confluence:** Dentro da **pasta da task** `{TASK_ID} - {título}` (criar subpágina **RFC**).

### TDD - Test-Driven Development

**Quando usar:**
- Integrações com serviços externos
- Lógica de negócio complexa
- Funcionalidades críticas
- Quando alta cobertura de testes é necessária

**Localização local:** `.cursor/docs/tdd/TDD-{TASK_ID}.md` ou `{TASK_ID}-{titulo}.md`
**Localização Confluence:** Dentro da **pasta da task** `{TASK_ID} - {título}` (criar subpágina TDD).

### ADR - Architecture Decision Record

**Quando usar:**
- Decisão arquitetural **já tomada** (o ADR registra o *porquê*, não a discussão em aberto)
- Escolha de tecnologias, padrões estruturais ou trade-offs que afetam o sistema por anos

**Quando não usar:** decisão ainda não fechada (tratar na task/PRD primeiro); plano de implementação detalhado (use **TDD** ou **Spec**).

**Conteúdo e formato (MADR / Nygard / Y-Statement, checklist, imutabilidade):** seguir o skill **`create-adr`** — ADR deve ser enxuto (≈200–500 palavras); detalhes longos vão para TDD/Spec.

**Localização local:** `.cursor/docs/adr/ADR-{NNN}-{titulo-kebab}.md` (`NNN` sequencial; ver `create-adr` para regra do próximo número)
**Localização Confluence:** Dentro da **pasta da task** `{TASK_ID} - {título}` (criar subpágina ADR).

### Spec (Spec Técnica)

**Quando usar:** Toda task com spec técnica de implementação.

**Localização local:** `.cursor/docs/specs/{TASK_ID}-{titulo-kebab}.md`
**Localização Confluence:** Dentro da **pasta da task** `{TASK_ID} - {título}` (criar subpágina **Spec-{TASK_ID} - {Título}**).

**Importante:** Refinamento (história, escopo, aceite) **não é publicado no Confluence** — fica apenas na task do Jira (descrição e comentários). No Confluence a pasta da task contém PRD, RFC (quando existir), TDD, ADR e Spec.

## Template com Metadata de Integração

### Cabeçalho Padrão (Todos os Tipos)

```markdown
---
# Metadata de Integração
task_id: UAG-45
task_url: https://site.atlassian.net/browse/UAG-45
confluence_page_id: 123456789
confluence_url: https://site.atlassian.net/wiki/spaces/DOC/pages/123456789
github_repo: owner/repo
github_branch: feature/UAG-45-descricao
last_sync: 2026-01-28T19:00:00
status: draft | review | approved
---

# [TIPO]: [Nome da Feature]

> **Task:** [UAG-45](jira-url) | **Confluence:** [Ver no Confluence](confluence-url)

[Conteúdo da spec...]
```

## Processo de Criação Passo a Passo

### Passo 1: Identificar Necessidade

**Perguntas ao usuário:**
- Esta feature requer PRD? (complexidade, impacto)
- Há decisão em aberto com opções e aprovação? (RFC)
- Esta feature requer TDD? (lógica complexa/crítica)
- Houve decisão arquitetural já fechada? (ADR)

### Passo 2: Coletar Informações

**Do Jira:**
- Título e descrição da task
- Critérios de aceite
- User stories

**Do Código:**
- Estrutura atual
- Padrões existentes
- Dependências

### Passo 3: Gerar Documento Local

1. Criar arquivo na **pasta do tipo** (`.cursor/docs/prd/`, `rfc/`, `tdd/`, `adr/`, `specs/`, `jira/`) com nomenclatura `{TASK_ID}` + título
2. Usar template em `.cursor/docs/{tipo}/_TEMPLATE.md`
3. Preencher template com informações coletadas
4. Adicionar metadata inicial (sem IDs do Confluence ainda)

### Passo 4: Sincronizar com Confluence

**Ações automáticas:**
1. Obter `cloudId` e `spaceId`
2. Criar ou localizar a **pasta da task** no Confluence (`{TASK_ID} - {Título da tarefa}`)
3. Criar a página como **subpágina dentro dessa pasta** (não na raiz do space)
4. Obter `pageId` e URL da página criada
5. Atualizar metadata no arquivo local

### Passo 5: Vincular à Task Jira

**Opção A - Atualizar descrição:**
```
Adicionar no final da descrição:
---
📄 **Documentação:**
- [PRD-UAG-45](confluence-url)
```

**Opção B - Adicionar comentário:**
```
📄 Spec criada: [PRD-UAG-45 - Login Social](confluence-url)
Arquivo local: .cursor/docs/prd/PRD-UAG-45.md
```

### Passo 6: Revisar e Aprovar

**Aguardar aprovação do usuário antes de implementar.**

## Atualização de Specs Existentes

### Workflow de Atualização

```
1. Editar arquivo local
2. Sincronizar com Confluence (updateConfluencePage)
3. Adicionar versionMessage descrevendo mudança
4. Atualizar last_sync no metadata
```

## Integração com PR do GitHub

### Seção de Documentação no PR

```markdown
## 📚 Documentação Relacionada

| Tipo | Link Local | Confluence |
|------|------------|------------|
| PRD | [.cursor/docs/prd/PRD-UAG-45.md](github-link) | [PRD-UAG-45](confluence-url) |
| RFC | [.cursor/docs/rfc/RFC-UAG-45-titulo-kebab.md](github-link) | [RFC](confluence-url) |
| TDD | [.cursor/docs/tdd/TDD-UAG-45.md](github-link) | [TDD-UAG-45](confluence-url) |
| ADR | [.cursor/docs/adr/ADR-001-titulo-kebab.md](github-link) | [ADR no Confluence](confluence-url) |
```

## Templates Completos

Templates em `.cursor/docs/{tipo}/_TEMPLATE.md`. Arquivos finais vão na **pasta do tipo** (prd/, rfc/, tdd/, adr/, specs/, jira/) com nomenclatura `{TASK_ID}` + título:
- `.cursor/docs/prd/_TEMPLATE.md`
- `.cursor/docs/rfc/_TEMPLATE.md`
- `.cursor/docs/tdd/_TEMPLATE.md`
- `.cursor/docs/adr/_TEMPLATE.md`

## Consulta de Specs pelo LLM

### Buscar Spec no Confluence

```cql
# Por task
title ~ "PRD-UAG-45" AND type = page

# Por tipo
title ~ "BDD-*" AND space = "DOC"

# Por modificação recente
type = page AND label = "spec" AND lastModified > now("-7d")
```

### Obter Conteúdo para Contexto

```
1. searchConfluenceUsingCql → obter pageId
2. getConfluencePage → obter conteúdo em markdown
3. Usar conteúdo como contexto para LLM
```

## Comandos Rápidos

| Comando | Ação |
|---------|------|
| "criar PRD para UAG-XX" | Gera PRD + Confluence + Jira |
| "criar TDD para UAG-XX" | Gera TDD + Confluence + Jira |
| "criar RFC para UAG-XX" | Redige RFC (skill `create-rfc`) + sincroniza Confluence/Jira conforme fluxo acima |
| "criar ADR" | Redige ADR (skill `create-adr`) + sincroniza Confluence/Jira conforme fluxo acima |
| "atualizar spec" | Atualiza local + Confluence |
| "consultar spec UAG-XX" | Busca e retorna spec |

## Referências

- Workflow completo: Ver skill `task-workflow`
- Redação de RFC (pré-decisão, RACI, critérios): Ver skill `create-rfc`
- Redação de ADR (estrutura, formatos, anti-padrões): Ver skill `create-adr`
- Integração Confluence: Ver skill `confluence-integration`
- Integração Jira: Ver skill `jira-integration`
- Integração GitHub: Ver skill `github-integration`
- Arquitetura Laravel: Ver skill `laravel-inertia-react-architecture`
