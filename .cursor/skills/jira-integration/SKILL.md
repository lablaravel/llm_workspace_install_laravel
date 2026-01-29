---
name: jira-integration
description: Integração com Jira para gerenciamento de tasks com vinculação a documentação. Use quando precisar criar, buscar, atualizar ou transicionar issues do Jira, adicionar comentários com links de documentação, ou listar tasks disponíveis.
allowed-tools: user-atlassian-searchJiraIssuesUsingJql, user-atlassian-getJiraIssue, user-atlassian-createJiraIssue, user-atlassian-editJiraIssue, user-atlassian-transitionJiraIssue, user-atlassian-addCommentToJiraIssue, user-atlassian-atlassianUserInfo, user-atlassian-getAccessibleAtlassianResources
---

# Jira Integration

> Operações específicas para integração com Jira via MCP com vinculação de documentação

## Quando Usar

Use este skill quando precisar:
- Criar novas issues no Jira
- Buscar e obter detalhes de issues
- Atualizar campos de issues
- Transicionar issues entre estados
- Adicionar comentários com links de documentação
- Vincular specs do Confluence à task

## Vinculação de Documentação

### Comentário ao Criar Spec

Quando uma spec é criada, adicionar comentário na task:

```markdown
📄 **Documentação criada:**

| Tipo | Link |
|------|------|
| PRD | [PRD-UAG-XX - Título](confluence-url) |
| Arquivo Local | `docs/prd/PRD-UAG-XX.md` |

---
*Sincronizado automaticamente em YYYY-MM-DD HH:MM*
```

### Comentário ao Criar Branch

```markdown
🌿 **Branch criada:**
- **Nome:** `feature/UAG-XX-descricao`
- **Base:** `main`
- **Repositório:** [owner/repo](github-url)

---
*Criada em YYYY-MM-DD HH:MM*
```

### Comentário ao Criar PR

```markdown
🔀 **Pull Request criado:**

| Campo | Valor |
|-------|-------|
| **PR** | [#123 - Título](pr-url) |
| **Status** | Open |
| **Branch** | `feature/UAG-XX-descricao` → `main` |

### Documentação Relacionada
- [PRD-UAG-XX](confluence-url)
- [BDD-UAG-XX](confluence-url)

---
*Criado em YYYY-MM-DD HH:MM*
```

## Operações Disponíveis

### Buscar Issues

**JQL Query Examples:**
```jql
# Minhas tasks pendentes
assignee = currentUser() AND status != Done ORDER BY priority DESC

# Tasks de um projeto
project = UAG AND status = "To Do" ORDER BY priority DESC

# Tasks com documentação
project = UAG AND description ~ "confluence"
```

### Obter Detalhes de Issue

**Campos retornados:**
- Título e descrição
- Status e prioridade
- Assignee e reporter
- Critérios de aceite
- Links e attachments
- Comentários (incluindo links de documentação)

### Criar Issue

**Campos obrigatórios:**
- Projeto
- Tipo (Story, Bug, Task, etc.)
- Título

**Campos opcionais:**
- Descrição (incluir links de documentação)
- Prioridade
- Assignee
- Labels
- Critérios de aceite

### Atualizar Issue (com documentação)

**Para vincular documentação à descrição:**
```
Adicionar ao final da descrição:

---

## 📚 Documentação

| Tipo | Link |
|------|------|
| PRD | [PRD-UAG-XX](confluence-url) |
| BDD | [BDD-UAG-XX](confluence-url) |
| TDD | [TDD-UAG-XX](confluence-url) |
```

### Transicionar Issue

**Estados típicos com comentário:**
- To Do → In Progress: Adicionar link da branch
- In Progress → Code Review: Adicionar link do PR
- Code Review → Done: Adicionar resumo final

### Adicionar Comentário

**Templates de comentário:**

**Spec criada:**
```
📄 Spec criada: [PRD-UAG-XX - Título](url)
```

**Branch criada:**
```
🌿 Branch: `feature/UAG-XX-desc` criada
```

**PR criado:**
```
🔀 PR: [#123](url) criado
```

**Spec atualizada:**
```
🔄 Spec atualizada: [PRD-UAG-XX](url)
Mudanças: [descrição]
```

## Padrões de Nomenclatura

- **Task ID**: Formato `UAG-XX` ou `PROJECT-XX`
- **Branch**: `{tipo}/{task-id}-{descricao-kebab}`
- **PR**: Título com `[UAG-XX]` e `Closes UAG-XX` no corpo
- **Spec**: `{TIPO}-{TASK-ID}` (ex: `PRD-UAG-45`)

## Integração com Outros Skills

### Com confluence-integration
- Receber URL da página criada
- Adicionar link na task

### Com github-integration
- Receber URL da branch/PR
- Adicionar comentário na task

### Com spec-generation
- Receber notificação de spec criada
- Vincular automaticamente

## Exemplos de Uso

### Listar Minhas Tasks Pendentes

```jql
assignee = currentUser() AND status != Done ORDER BY priority DESC, updated DESC
```

### Buscar Task com Documentação

```jql
key = UAG-45 OR description ~ "PRD-UAG-45"
```

### Criar Task de Feature com Link

```
Projeto: UAG
Tipo: Story
Título: Login Social no Portal Cativo
Descrição: |
  ## Objetivo
  Implementar login via Google/Facebook
  
  ## Documentação
  - PRD: [A ser criado]
Prioridade: High
```

## Referências

- Workflow completo: Ver skill `task-workflow`
- Integração Confluence: Ver skill `confluence-integration`
- Integração GitHub: Ver skill `github-integration`
