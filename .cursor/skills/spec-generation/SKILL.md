---
name: spec-generation
description: Geração de documentação de especificação (PRD, BDD, TDD, ADR) com sincronização automática para Confluence. Use quando precisar criar Product Requirements Documents, Behavior-Driven Development specs, Test-Driven Development specs, ou Architecture Decision Records. Automaticamente sincroniza com Confluence e vincula à task Jira.
allowed-tools: Read, Write, Glob, user-atlassian-createConfluencePage, user-atlassian-updateConfluencePage, user-atlassian-searchConfluenceUsingCql, user-atlassian-getConfluenceSpaces, user-atlassian-getConfluencePage, user-atlassian-editJiraIssue, user-atlassian-addCommentToJiraIssue
---

# Spec Generation

> Geração de documentação de especificação com integração Confluence/Jira/GitHub

## Quando Usar

Use este skill na fase **P - Plan** do workflow R-P-I para criar:
- **PRD**: Product Requirements Document (features complexas)
- **BDD**: Behavior-Driven Development specs (features com interação)
- **TDD**: Test-Driven Development specs (lógica complexa/crítica)
- **ADR**: Architecture Decision Record (decisões arquiteturais)

## Fluxo Completo de Criação

### Workflow Integrado

```
┌─────────────────────────────────────────┐
│ 1. CRIAR SPEC LOCAL                      │
├─────────────────────────────────────────┤
│ • Gerar arquivo em docs/{tipo}/          │
│ • Seguir template apropriado             │
│ • Incluir metadata com task e links      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. SINCRONIZAR COM CONFLUENCE            │
├─────────────────────────────────────────┤
│ • Criar página no Confluence             │
│ • Registrar confluence_page_id no local  │
│ • Adicionar link bidirecional            │
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

**Localização local:** `docs/prd/PRD-{task-id}.md`
**Localização Confluence:** `[Space]/PRD/PRD-{task-id} - {título}`

### BDD - Behavior-Driven Development

**Quando usar:**
- Features com interação do usuário
- Funcionalidades que requerem especificação de comportamento
- Quando precisar de cenários de teste claros

**Localização local:** `docs/bdd/BDD-{task-id}.md`
**Localização Confluence:** `[Space]/BDD/BDD-{task-id} - {título}`

### TDD - Test-Driven Development

**Quando usar:**
- Integrações com serviços externos
- Lógica de negócio complexa
- Funcionalidades críticas
- Quando alta cobertura de testes é necessária

**Localização local:** `docs/tdd/TDD-{task-id}.md`
**Localização Confluence:** `[Space]/TDD/TDD-{task-id} - {título}`

### ADR - Architecture Decision Record

**Quando usar:**
- Decisões arquiteturais importantes
- Escolha de tecnologias/ferramentas
- Mudanças estruturais significativas
- Trade-offs importantes

**Localização local:** `docs/adr/ADR-{numero}-{titulo-kebab}.md`
**Localização Confluence:** `[Space]/ADR/ADR-{numero} - {título}`

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
- Esta feature requer BDD? (interação do usuário)
- Esta feature requer TDD? (lógica complexa/crítica)
- Houve decisão arquitetural? (ADR)

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

1. Criar arquivo em `docs/{tipo}/`
2. Preencher template com informações coletadas
3. Adicionar metadata inicial (sem IDs do Confluence ainda)

### Passo 4: Sincronizar com Confluence

**Ações automáticas:**
1. Obter `cloudId` e `spaceId`
2. Buscar página pai correta (PRD/BDD/TDD/ADR)
3. Criar página no Confluence com conteúdo
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
Arquivo local: docs/prd/PRD-UAG-45.md
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
| PRD | [docs/prd/PRD-UAG-45.md](github-link) | [PRD-UAG-45](confluence-url) |
| BDD | [docs/bdd/BDD-UAG-45.md](github-link) | [BDD-UAG-45](confluence-url) |
| TDD | [docs/tdd/TDD-UAG-45.md](github-link) | [TDD-UAG-45](confluence-url) |
| ADR | [docs/adr/ADR-001.md](github-link) | [ADR-001](confluence-url) |
```

## Templates Completos

Templates disponíveis em:
- `docs/prd/_TEMPLATE.md`
- `docs/bdd/_TEMPLATE.md`
- `docs/tdd/_TEMPLATE.md`
- `docs/adr/_TEMPLATE.md`

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
| "criar BDD para UAG-XX" | Gera BDD + Confluence + Jira |
| "criar TDD para UAG-XX" | Gera TDD + Confluence + Jira |
| "criar ADR" | Gera ADR + Confluence |
| "atualizar spec" | Atualiza local + Confluence |
| "consultar spec UAG-XX" | Busca e retorna spec |

## Referências

- Workflow completo: Ver skill `task-workflow`
- Integração Confluence: Ver skill `confluence-integration`
- Integração Jira: Ver skill `jira-integration`
- Integração GitHub: Ver skill `github-integration`
- Arquitetura Laravel: Ver skill `laravel-inertia-react-architecture`
