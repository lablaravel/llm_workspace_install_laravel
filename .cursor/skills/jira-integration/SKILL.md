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
| Arquivo Local | `.cursor/docs/{TASK_ID}/PRD-{TASK_ID}.md` |

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

# Buscar task por título (para verificar duplicatas)
project = UAG AND summary ~ "título da task"

# Listar Epics disponíveis
project = UAG AND type = Epic ORDER BY updated DESC

# Buscar tasks relacionadas a um Epic
project = UAG AND "Epic Link" = UAG-XX

# Listar histórias disponíveis (para criar subtask)
project = UAG AND type = Story AND status != Done ORDER BY updated DESC

# Buscar subtasks de uma história
project = UAG AND parent = UAG-XX

# Listar todas as histórias do projeto
project = UAG AND type = Story ORDER BY updated DESC

# Buscar issues por categoria (label)
project = UAG AND labels = "categoria-existente"

# Buscar issues por component
project = UAG AND component = "componente-existente"
```

### Obter e Atribuir Categorias

**Processo de Atribuição de Categorias:**

1. **Obter categorias disponíveis do projeto:**
   - **Labels:** Buscar issues existentes e extrair labels únicos usados
     - Exemplo: `project = UAG ORDER BY updated DESC LIMIT 100`
     - Analisar campo `labels` de cada issue
     - Criar lista de labels únicos disponíveis
   - **Components:** Usar API do Jira para listar components do projeto
     - Componentes são configurados no projeto
     - Não podem ser criados dinamicamente

2. **Analisar contexto da issue:**
   - Título da issue
   - Descrição/História de usuário
   - Tipo de issue (Story/Task/Subtask)
   - Epic relacionado (se houver)
   - Palavras-chave e termos técnicos

3. **Atribuir categorias automaticamente:**
   - Comparar contexto com categorias existentes
   - Atribuir apenas categorias que fazem sentido
   - **Exemplo:** Issue sobre "Login" → Verificar se existe label "Autenticação" ou "Segurança"
   - **Exemplo:** Issue sobre "API" → Verificar se existe component "Backend" ou "API"

4. **Regras de atribuição:**
   - Atribuir no máximo 3-5 categorias relevantes
   - Priorizar categorias mais específicas
   - Se não houver categoria adequada, **deixar sem categoria**

**⚠️ REGRAS CRÍTICAS:**
- **NUNCA criar novas categorias** (labels ou components)
- **Usar APENAS categorias que já existem** no projeto
- **Atribuir automaticamente** baseado no contexto, sem perguntar ao usuário
- **NUNCA sugerir categorias** a menos que explicitamente solicitado pelo usuário
- Se não houver categoria adequada existente, **deixar sem categoria** (não criar)

### Obter Detalhes de Issue

**Campos retornados:**
- Título e descrição
- Status e prioridade
- Assignee e reporter
- Critérios de aceite
- Links e attachments
- Comentários (incluindo links de documentação)

### Criar Issue

**⚠️ REGRAS OBRIGATÓRIAS ANTES DE CRIAR:**

1. **Verificar se task já existe no Jira:**
   - Buscar por título similar usando JQL
   - Buscar por descrição/termos-chave relacionados
   - Se encontrar task existente, **NÃO criar nova** e informar ao usuário
   - Exemplo de busca: `project = UAG AND summary ~ "título da task"`

2. **Sempre perguntar antes de criar:**
   - Mostrar resumo da task que será criada
   - Perguntar explicitamente: "Deseja criar esta task no Jira?"
   - Aguardar confirmação do usuário antes de prosseguir

3. **Seleção de Tipo de Issue (OBRIGATÓRIO):**
   - Perguntar: "Qual o tipo desta issue?"
   - Opções:
     1. **História (Story)** - Nova história de usuário
     2. **Task** - Tarefa independente
     3. **Subtask** - Subtarefa de uma história existente
   - Se escolher **Subtask**:
     - Listar histórias disponíveis usando JQL: `project = UAG AND type = Story AND status != Done ORDER BY updated DESC`
     - Apresentar lista numerada de histórias ao usuário
     - Perguntar: "A qual história esta subtask pertence?"
     - Relacionar a subtask à história escolhida (parent issue)

4. **Seleção de Epic (OBRIGATÓRIO para Story e Task):**
   - Listar todos os Epics disponíveis no projeto usando JQL: `project = UAG AND type = Epic ORDER BY updated DESC`
   - Apresentar lista numerada de Epics ao usuário
   - Perguntar: "A qual Epic esta issue deve pertencer?"
   - Relacionar a issue ao Epic escolhido ao criar
   - **Nota:** Subtasks herdam o Epic da história pai

5. **Atribuição de Categorias (Labels/Components):**
   - **⚠️ REGRA:** Usar APENAS categorias já existentes no projeto
   - **⚠️ REGRA:** NÃO criar novas categorias
   - **⚠️ REGRA:** NÃO sugerir categorias a menos que explicitamente solicitado
   - **Processo:**
     1. Obter categorias disponíveis do projeto (via API do Jira)
     2. Analisar o contexto da issue (título, descrição, tipo)
     3. Atribuir automaticamente categorias relevantes que já existem
     4. Se não houver categoria adequada existente, deixar sem categoria
   - **Exemplo:** Se a issue é sobre "Login", verificar se existe categoria "Front-end" ou "Back-end" e atribuir se existir
   - **Sugestão:** Apenas se o usuário solicitar explicitamente ("sugerir categorias", "quais categorias usar")

**Campos obrigatórios:**
- Projeto
- Tipo (Story, Task, Subtask, Bug, etc.)
- Título
- **Epic (relacionamento obrigatório para Story e Task)**
- **Parent Issue (obrigatório para Subtask)**

**Campos opcionais:**
- Descrição (incluir links de documentação)
- Prioridade
- Assignee
- **Labels/Components (atribuir automaticamente apenas se existirem no projeto)**
- Critérios de aceite

**Template de Descrição:**

Ao criar uma task, use o template de refinamento em `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md` para garantir que a task tenha:
- História de usuário no formato invertido (Feature Injection)
- Valor de negócio explícito
- Escopo MVP bem definido
- Fora de escopo explícito (YAGNI)
- Requisitos de aceitação verificáveis
- Critérios de aceite em formato BDD/Gherkin
- Observações técnicas

**Processo recomendado:**
1. **Verificar se task já existe** (buscar no Jira)
2. **Refinar a task** usando skill `task-refinement`
3. **Usar o template** `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md` como base
4. **Perguntar tipo de issue:**
   - História (Story)
   - Task
   - Subtask (se escolhido, listar histórias disponíveis)
5. **Listar Epics disponíveis** e perguntar ao usuário (se não for Subtask)
6. **Obter categorias disponíveis do projeto** (Labels/Components via API)
7. **Atribuir categorias automaticamente** baseado no contexto:
   - Analisar título e descrição da issue
   - Verificar quais categorias existentes são relevantes
   - Atribuir apenas categorias que já existem no projeto
   - Se não houver categoria adequada, deixar sem categoria
8. **Perguntar confirmação** antes de criar (mostrar categorias atribuídas)
9. **Criar a issue no Jira** com:
   - Descrição refinada
   - Tipo escolhido (Story/Task/Subtask)
   - Epic relacionado (se Story ou Task)
   - Parent Issue (se Subtask)
   - Categorias atribuídas (se houver)
10. Vincular documentação (PRD/BDD) quando criada

**⚠️ IMPORTANTE sobre Categorias:**
- **NUNCA criar novas categorias** no Jira
- **NUNCA sugerir categorias** a menos que explicitamente solicitado
- **SEMPRE usar apenas categorias existentes** do projeto
- **Atribuir automaticamente** baseado no contexto da issue
- Se não houver categoria adequada existente, **deixar sem categoria**

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

**Transição Automática:**

Ao transicionar status automaticamente (ex: ao criar branch ou PR), seguir este fluxo:

1. **Verificar status atual da task:**
   - Obter task usando `user-atlassian-getJiraIssue`
   - Extrair campo `status` da resposta

2. **Verificar status disponíveis para transição:**
   - Usar API do Jira para obter transições disponíveis
   - Identificar status equivalente mais próximo se o status desejado não existir

3. **Aplicar regras de transição:**

   **Ao criar branch vinculada:**
   - Se status for inicial ("To Do", "Backlog", "Open", etc.):
     - Transicionar para "In Progress" ou equivalente
   - Se status já for "In Progress" ou posterior:
     - Não transicionar (manter status atual)
   - Sempre adicionar comentário com link da branch

   **Ao criar PR vinculado:**
   - Se status for "In Progress":
     - Transicionar para "Code Review" ou "Review" ou equivalente
   - Se status já for "Code Review" ou posterior:
     - Não transicionar (manter status atual)
   - Sempre adicionar comentário com link do PR

   **Ao fechar branch (merge):**
   - Se PR foi mergeado:
     - Transicionar para "Done" ou "Concluído" ou equivalente
     - Adicionar comentário final

4. **Idempotência:**
   - Sempre verificar status atual antes de transicionar
   - Evitar transições desnecessárias (ex: "In Progress" → "In Progress")
   - Se status já estiver no estado desejado, apenas adicionar comentário

**Detecção de TASK_ID em nomes de branch:**

Padrão de detecção para extrair TASK_ID do nome da branch:
```
Padrão: {tipo}/{TASK_ID}-{descricao}
Regex: /^(feature|bugfix|hotfix|chore)\/([A-Z]+-\d+)-/
Grupo capturado: $2 (ex: UAG-45)
```

**Detecção de TASK_ID em PRs:**

- **Título do PR:** `[UAG-XX]` → Regex: `/\[([A-Z]+-\d+)\]/`
- **Corpo do PR:** `Closes UAG-XX` → Regex: `/Closes\s+([A-Z]+-\d+)/i`
- **Branch origem:** `feature/UAG-XX-descricao` → Regex: `/^(feature|bugfix|hotfix|chore)\/([A-Z]+-\d+)-/`

**Tratamento de Erros:**

- Se falhar ao obter task: Informar usuário e continuar operação Git (não bloquear)
- Se falhar ao transicionar: Logar erro, adicionar comentário informando falha (se possível) e continuar
- Se status não disponível: Verificar status disponíveis via API e usar equivalente mais próximo
- Se conexão com Jira indisponível: Continuar operação Git e informar usuário sobre falha na integração

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

### Com task-refinement
- Usar template de refinamento antes de criar task
- Garantir valor de negócio claro e escopo MVP bem definido

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

**Processo completo:**

1. **Verificar duplicatas:**
```jql
project = UAG AND summary ~ "Login Social"
```

2. **Perguntar tipo de issue:**
   - Opções: História (Story), Task ou Subtask
   - Se Subtask → Listar histórias:
```jql
project = UAG AND type = Story AND status != Done ORDER BY updated DESC
```

3. **Listar Epics disponíveis (se Story ou Task):**
```jql
project = UAG AND type = Epic ORDER BY updated DESC
```

4. **Obter categorias disponíveis:**
   - Buscar labels existentes: `project = UAG ORDER BY updated DESC LIMIT 100`
   - Listar components do projeto via API
   - Exemplo de labels encontrados: ["Autenticação", "Segurança", "Frontend", "Backend"]
   - Exemplo de components encontrados: ["Portal Cativo", "API", "Dashboard"]

5. **Atribuir categorias automaticamente:**
   - Analisar contexto: "Login Social no Portal Cativo"
   - Verificar categorias relevantes que existem
   - Atribuir: Labels ["Autenticação", "Segurança"], Component ["Portal Cativo"]
   - **Não perguntar ao usuário** (atribuição automática)

6. **Perguntar ao usuário:**
   - Mostrar resumo completo:
     - Tipo: Story
     - Epic: UAG-10 (Autenticação e Segurança)
     - Categorias atribuídas: Labels ["Autenticação", "Segurança"], Component ["Portal Cativo"]
   - "Deseja criar esta issue no Jira?"
   - Aguardar confirmação

7. **Criar issue:**

**Exemplo 1 - História (Story):**
```
Projeto: UAG
Tipo: Story
Título: Login Social no Portal Cativo
Epic: UAG-10 (Autenticação e Segurança)
Labels: ["Autenticação", "Segurança"]  # Apenas se existirem no projeto
Components: ["Portal Cativo"]  # Apenas se existir no projeto
Descrição: |
  ## Objetivo
  Implementar login via Google/Facebook
  
  ## Documentação
  - PRD: [A ser criado]
Prioridade: High
```

**Exemplo 2 - Task:**
```
Projeto: UAG
Tipo: Task
Título: Configurar variáveis de ambiente para OAuth
Epic: UAG-10 (Autenticação e Segurança)
Labels: ["Backend", "Configuração"]  # Apenas se existirem
Components: ["API"]  # Apenas se existir
Descrição: |
  Configurar credenciais do Google OAuth
Prioridade: Medium
```

**Exemplo 3 - Subtask:**
```
Projeto: UAG
Tipo: Subtask
Título: Criar componente de botão de login Google
Parent: UAG-45 (Login Social no Portal Cativo)
Labels: ["Frontend"]  # Apenas se existir
Components: ["Portal Cativo"]  # Apenas se existir
Descrição: |
  Implementar componente React para botão de login
Prioridade: Medium
```

**⚠️ Nota sobre Categorias:**
- Se não houver categorias adequadas existentes, criar issue **sem categorias**
- **NUNCA criar novas categorias** mesmo que façam sentido
- **NUNCA sugerir** ao usuário criar novas categorias (a menos que explicitamente solicitado)

## Referências

- Template de Task Jira: `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`
- Refinamento de tasks: Ver skill `task-refinement`
- Workflow completo: Ver skill `task-workflow`
- Integração Confluence: Ver skill `confluence-integration`
- Integração GitHub: Ver skill `github-integration`
