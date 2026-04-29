---
name: github-integration
description: Integração com GitHub para gerenciamento de branches e Pull Requests com vinculação de documentação. Use quando precisar criar branches, listar commits, criar PRs com links para specs no Confluence/Jira, ou gerenciar código no GitHub.
allowed-tools: user-github-list_branches, user-github-create_branch, user-github-list_commits, user-github-create_pull_request, user-github-pull_request_read
---

# GitHub Integration

> Operações específicas para integração com GitHub via MCP com rastreabilidade completa

## Quando Usar

Use este skill quando precisar:
- Criar novas branches vinculadas a tasks
- Listar branches existentes
- Verificar commits
- Criar Pull Requests com documentação completa
- Vincular PRs a tasks do Jira e specs do Confluence

## Template de PR com Rastreabilidade Completa

### Estrutura do PR

```markdown
## Resumo
[Descrição concisa das mudanças implementadas]

## 🎫 Task Relacionada
Closes [UAG-XX](https://site.atlassian.net/browse/UAG-XX)

## 📚 Documentação

| Tipo | Arquivo Local | Confluence |
|------|---------------|------------|
| PRD | [`.cursor/docs/prd/PRD-{TASK_ID}.md`](github-link) | [Ver PRD](confluence-link) |
| RFC | [`.cursor/docs/rfc/RFC-{TASK_ID}-titulo-kebab.md`](github-link) | [Ver RFC](confluence-link) |
| TDD | [`.cursor/docs/tdd/TDD-{TASK_ID}.md`](github-link) | [Ver TDD](confluence-link) |
| ADR | [`.cursor/docs/adr/ADR-NNN-titulo-kebab.md`](github-link) | [Ver ADR](confluence-link) |

## Mudanças Principais
- [ ] Mudança 1
- [ ] Mudança 2
- [ ] Mudança 3

## ✅ Checklist de Qualidade
- [ ] Código segue arquitetura definida na spec
- [ ] Testes implementados conforme TDD (se aplicável)
- [ ] Cenários BDD da task do Jira cobertos (se aplicável)
- [ ] `declare(strict_types=1)` em todos os arquivos PHP
- [ ] Sem lógica de negócio no Controller
- [ ] Documentação atualizada

## 🧪 Test Plan
[Como testar as mudanças]

1. [ ] Passo 1
2. [ ] Passo 2
3. [ ] Resultado esperado

## 📸 Screenshots (se aplicável)
[Adicionar screenshots de mudanças visuais]

## ⚠️ Breaking Changes
[Listar se houver breaking changes]

## 📝 Notas para Reviewer
[Informações adicionais para o revisor]
```

## Operações Disponíveis

### Gerenciar Branches

**Criar Branch vinculada a task:**
```
Nome: feature/UAG-45-login-social-portal-cativo
Base: main
```

**Padrão de nomenclatura:**
```
{tipo}/{task-id}-{descricao-kebab}

Tipos:
- feature: Nova funcionalidade
- bugfix: Correção de bug
- hotfix: Correção urgente
- chore: Manutenção/refactoring
```

### Integração Automática com Jira

**⚠️ PRÉ-REQUISITO:** Para vincular branch a task, é necessário que o usuário tenha escolhido a **Opção A (Conectar com Jira/Confluence)** e então passar pelo **Connection Gate** (ver `workflow.mdc`).

**Detecção Automática de TASK_ID:**

Ao criar branch vinculada, extrair TASK_ID do nome usando regex:
```
Padrão: {tipo}/{TASK_ID}-{descricao}
Regex: /^(feature|bugfix|hotfix|chore)\/([A-Z]+-\d+)-/
Grupo capturado: $2 (ex: UAG-45)
```

**Atualização Automática de Status ao Criar Branch:**

Após criar branch vinculada:

1. Extrair TASK_ID do nome da branch
2. Obter task do Jira usando `user-atlassian-getJiraIssue`
3. Verificar status atual da task:
   - Se status for inicial ("To Do", "Backlog", "Open", etc.):
     - Transicionar para "In Progress" usando `user-atlassian-transitionJiraIssue`
     - Verificar status disponíveis antes de transicionar
   - Se status já for "In Progress" ou posterior:
     - Não transicionar (manter status atual)
4. Adicionar comentário na task usando `user-atlassian-addCommentToJiraIssue`:
   ```
   🌿 **Branch criada:**
   - **Nome:** `{nome-da-branch}`
   - **Base:** `{base-branch}`
   - **Repositório:** [owner/repo](github-url)
   
   ---
   *Criada em YYYY-MM-DD HH:MM*
   ```

**Tratamento de Erros:**

- Se falhar ao obter task: Continuar criação da branch e informar usuário
- Se falhar ao transicionar status: Adicionar comentário informando falha (se possível) e continuar
- Se status não disponível: Verificar status disponíveis via API e usar equivalente mais próximo
- Se conexão com Jira indisponível: Continuar criação da branch e informar usuário sobre falha na integração

**Transição de Status ao Criar PR:**

Ao criar Pull Request vinculado a uma task:

1. Extrair TASK_ID de:
   - Título do PR: `[UAG-XX]` → Regex: `/\[([A-Z]+-\d+)\]/`
   - Corpo do PR: `Closes UAG-XX` → Regex: `/Closes\s+([A-Z]+-\d+)/i`
   - Nome da branch origem: `feature/UAG-XX-descricao` → Regex: `/^(feature|bugfix|hotfix|chore)\/([A-Z]+-\d+)-/`

2. Obter task do Jira usando `user-atlassian-getJiraIssue`

3. Verificar status atual:
   - Se status for "In Progress":
     - Transicionar para "Code Review" ou "Review" (verificar status disponíveis)
   - Se status já for "Code Review" ou posterior:
     - Manter status (não transicionar)

4. Adicionar comentário na task com link do PR:
   ```
   🔀 **Pull Request criado:**
   
   | Campo | Valor |
   |-------|-------|
   | **PR** | [#123 - Título](pr-url) |
   | **Status** | Open |
   | **Branch** | `{branch-origem}` → `{branch-destino}` |
   
   ---
   *Criado em YYYY-MM-DD HH:MM*
   ```

**Transição de Status ao Fechar Branch (Merge):**

Ao fechar/mergear branch vinculada:

1. Extrair TASK_ID do nome da branch
2. Obter task do Jira
3. Verificar se PR foi mergeado:
   - Se PR foi mergeado:
     - Transicionar para "Done" ou "Concluído" usando `user-atlassian-transitionJiraIssue`
     - Adicionar comentário final na task
   - Se branch foi deletada sem merge:
     - Não transicionar para "Done" (manter status atual)

### Criar Pull Request Completo

**Campos importantes:**
- **Título**: `[UAG-XX] Descrição concisa`
- **Body**: Usar template com rastreabilidade
- **Base**: Branch de destino (main/develop)
- **Head**: Branch de origem
- **Labels**: Se aplicável
- **Reviewers**: Se necessário

### Ler Pull Request

**Informações disponíveis:**
- Status (open, closed, merged)
- Commits incluídos
- Arquivos alterados
- Reviews e comentários
- Links de documentação

## Workflow Típico com Documentação

### 1. Criar Branch

```
Comando: criar branch para UAG-45
Resultado: feature/UAG-45-login-social-portal-cativo
```

### 2. Desenvolver

```
- Commits descritivos
- Referenciar task: "UAG-45: implementa OAuth Google"
- Seguir specs (PRD/BDD/TDD)
```

### 3. Criar PR com Template

```
Título: [UAG-45] Implementa Login Social no Portal Cativo

Body: [usar template completo com links]
```

### 4. Notificar Jira

Após criar PR, adicionar comentário na task:
```
🔀 PR criado: [#123 - Login Social](url)
Branch: feature/UAG-45-login-social
Documentação: [PRD](link), [BDD](link)
```

## Integração com Documentação

### Coletar Links para PR

**Antes de criar PR, verificar:**
1. Arquivo PRD local existe? → Obter path
2. Arquivo BDD local existe? → Obter path
3. Arquivo TDD local existe? → Obter path
4. Arquivo ADR local existe? → Obter path
5. Páginas no Confluence existem? → Obter URLs

### Construir Seção de Documentação

```python
# Pseudo-código
docs_section = "## 📚 Documentação\n\n"
docs_section += "| Tipo | Arquivo Local | Confluence |\n"
docs_section += "|------|---------------|------------|\n"

for doc in [prd, bdd, tdd, adr]:
    if doc.exists():
        docs_section += f"| {doc.type} | [{doc.local_path}]({github_link}) | [Ver]({confluence_link}) |\n"
```

## Padrões de Nomenclatura

### Branches

```
feature/UAG-45-login-social
bugfix/UAG-46-corrige-validacao
hotfix/UAG-47-correcao-critica
chore/UAG-48-atualiza-deps
```

### Commits

```
UAG-45: implementa OAuth Google
UAG-45: adiciona testes de integração
UAG-45: atualiza documentação
```

### Pull Requests

```
Título: [UAG-45] Login Social no Portal Cativo
Labels: feature, needs-review
```

## Integração com Outros Skills

### Com jira-integration
- Notificar criação de branch
- Notificar criação de PR
- Atualizar status da task

### Com confluence-integration
- Obter URLs das specs
- Incluir links na descrição do PR

### Com spec-generation
- Verificar specs existentes
- Incluir referências no PR

## Exemplos de Uso

### Criar Branch para Task

```
Input:
  Task: UAG-45
  Tipo: feature
  Descrição: login-social-portal-cativo
  Base: main

Output:
  Branch: feature/UAG-45-login-social-portal-cativo
  URL: https://github.com/owner/repo/tree/feature/UAG-45-login-social-portal-cativo
```

### Criar PR Completo

```
Input:
  Task: UAG-45
  Branch: feature/UAG-45-login-social-portal-cativo
  PRD: .cursor/docs/UAG-45/PRD-UAG-45.md
  TDD: .cursor/docs/UAG-45/TDD-UAG-45.md
  Confluence PRD: https://site.atlassian.net/wiki/.../PRD-UAG-45
  Confluence TDD: https://site.atlassian.net/wiki/.../TDD-UAG-45

Output:
  PR #123: [UAG-45] Login Social no Portal Cativo
  URL: https://github.com/owner/repo/pull/123
```

## Referências

- Workflow completo: Ver skill `task-workflow`
- Integração Jira: Ver skill `jira-integration`
- Integração Confluence: Ver skill `confluence-integration`
- Geração de specs: Ver skill `spec-generation`
