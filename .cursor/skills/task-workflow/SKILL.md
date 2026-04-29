---
name: task-workflow
description: Orquestrador do fluxo completo de desenvolvimento seguindo metodologia R-P-I (Research, Plan, Implement). Integra Jira, GitHub, Confluence e documentação para gerenciar o ciclo completo de desenvolvimento de features. Sincroniza automaticamente specs com Confluence e vincula tudo à task.
allowed-tools: user-atlassian-searchJiraIssuesUsingJql, user-atlassian-getJiraIssue, user-atlassian-createJiraIssue, user-atlassian-editJiraIssue, user-atlassian-transitionJiraIssue, user-atlassian-addCommentToJiraIssue, user-atlassian-atlassianUserInfo, user-atlassian-getAccessibleAtlassianResources, user-atlassian-createConfluencePage, user-atlassian-updateConfluencePage, user-atlassian-getConfluencePage, user-atlassian-searchConfluenceUsingCql, user-atlassian-getConfluenceSpaces, user-github-list_branches, user-github-create_branch, user-github-list_commits, user-github-create_pull_request, user-github-pull_request_read, Shell, Read, Write, Grep, Glob
---

# Task Workflow - Orquestrador R-P-I Integrado

> Fluxo disciplinado de desenvolvimento com integração completa: Jira ↔ Confluence ↔ GitHub

## Pergunta Inicial (Escolha do Fluxo)

Antes de iniciar qualquer automação, **pergunte qual caminho seguir**:

- **A) Conectar com Jira/Confluence agora (recomendado)**: executar Connection Gate, obter/criar `TASK_ID`, manter rastreabilidade total.
- **B) Executar R‑P‑I sem Jira (modo local)**: seguir Research → Plan → Implement, mas **sem usar Jira/Confluence** e sem `TASK_ID`.
- **C) Ir direto para Implementação**: aplicar correção/ajuste pontual rapidamente; ainda assim respeitar arquitetura e testes mínimos.

**Regras:**
- Se escolher **A**, pode usar as ferramentas Atlassian/GitHub desta skill normalmente.
- Se escolher **B** ou **C**, **não executar ações Atlassian** (buscar/criar issue, Confluence, transições). Trabalhar somente com o repositório local/Git.

## Overview

Esta skill orquestra o ciclo completo de desenvolvimento usando a metodologia **R-P-I** com **integração total** entre todas as ferramentas:

```
┌──────────────────────────────────────────────────────────────┐
│                    ECOSSISTEMA INTEGRADO                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐     ┌─────────────┐     ┌─────────┐          │
│   │  JIRA   │◄───►│  CONFLUENCE │◄───►│ GITHUB  │          │
│   │ (Tasks) │     │   (Specs)   │     │ (Code)  │          │
│   └────┬────┘     └──────┬──────┘     └────┬────┘          │
│        │                 │                  │               │
│        └────────────┬────┴────┬────────────┘               │
│                     │         │                             │
│              ┌──────┴─────────┴──────┐                     │
│              │    REPOSITÓRIO LOCAL   │                     │
│              │  .cursor/docs/{prd,tdd,adr}    │                     │
│              └────────────────────────┘                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Todos os artefatos são vinculados bidirecionalmente:**
- Task Jira → Links para Confluence, Branch, PR
- Página Confluence → Links para Jira, Arquivo Local
- PR GitHub → Links para Jira, Confluence
- Arquivo Local → Links para Jira, Confluence

## Metodologia R-P-I (com Refinamento)

### R - Research (Pesquisa)

**Objetivo:** Entender completamente o contexto antes de planejar.

**Ações:**
- Analisar código existente (Models, Services, Controllers)
- Consultar documentação técnica existente no Confluence
- Consultar documentação técnica (Laravel, pacotes, APIs)
- Identificar dependências e impactos
- Verificar tasks relacionadas no Jira
- Revisar branches e PRs existentes

**Saída:** Resumo do contexto atual e arquivos impactados.

### REFINE - Refinamento Agile (Nova Etapa)

**Objetivo:** Aplicar princípios Agile (Feature Injection, YAGNI, KISS) para garantir valor de negócio claro e escopo MVP bem definido.

**Ações:**
1. Aplicar template de refinamento (`.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`)
2. Definir valor de negócio explícito
3. Explicitar YAGNI (fora de escopo)
4. Criar história no formato invertido (PARA QUE → COMO → EU QUERO)
5. Gerar BDD preliminar (Gherkin)

**Saída:** Task refinada pronta para ser criada no Jira.

**Skill utilizada:** `task-refinement`

### P - Plan (Planejamento + Documentação)

**Objetivo:** Criar especificações detalhadas antes de escrever o código e sincronizar com Confluence.

**Ações:**
0. **Gate de escolha do fluxo (obrigatório):**
   - Confirmar se o usuário está em **A**, **B** ou **C**.
   - Se **B**: executar somente passos que não dependem de Jira/Confluence.
   - Se **C**: pular para Implementação (mantendo testes mínimos e arquitetura).

1. **Verificar se task já existe no Jira:**
   - Buscar por título/descrição similar usando JQL
   - Se encontrar task existente → Informar ao usuário e PARAR
   - Se não existir → Prosseguir

2. **Perguntar tipo de issue:**
   - Mostrar resumo da task refinada
   - Perguntar: "Qual o tipo desta issue?"
   - Opções:
     1. **História (Story)** - Nova história de usuário
     2. **Task** - Tarefa independente
     3. **Subtask** - Subtarefa de uma história existente
   - Aguardar escolha do usuário

3. **Se Subtask escolhida:**
   - Listar histórias disponíveis: `project = UAG AND type = Story AND status != Done ORDER BY updated DESC`
   - Apresentar lista numerada de histórias ao usuário
   - Perguntar: "A qual história esta subtask pertence?"
   - Aguardar escolha do usuário

4. **Se Story ou Task escolhida:**
   - Listar Epics disponíveis: `project = UAG AND type = Epic ORDER BY updated DESC`
   - Apresentar lista numerada de Epics ao usuário
   - Perguntar: "A qual Epic esta issue deve pertencer?"
   - Aguardar escolha do usuário

5. **Obter e atribuir categorias:**
   - Obter categorias disponíveis do projeto (Labels/Components via API)
   - Analisar contexto da issue (título, descrição, tipo)
   - Atribuir automaticamente categorias relevantes que já existem
   - **⚠️ NUNCA criar novas categorias**
   - **⚠️ NUNCA sugerir categorias** a menos que explicitamente solicitado
   - Se não houver categoria adequada existente, deixar sem categoria

6. **Perguntar confirmação:**
   - Mostrar resumo completo da issue que será criada:
     - Tipo escolhido
     - Epic (se Story ou Task) ou História pai (se Subtask)
     - Categorias atribuídas (se houver)
     - Título e descrição refinada
   - Perguntar: "Deseja criar esta issue no Jira?"
   - Aguardar confirmação do usuário

7. **Criar issue no Jira:**
   - Usar template refinado (`.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`)
   - Criar com tipo escolhido (Story/Task/Subtask)
   - Relacionar ao Epic escolhido (se Story ou Task)
   - Relacionar à história pai (se Subtask)
   - Incluir categorias atribuídas (se houver)
   - Incluir descrição completa refinada

8. Criar spec local (PRD/TDD/ADR)
9. Sincronizar com Confluence (automático)
10. Vincular à task Jira (automático)
11. Definir arquitetura proposta

**Regras Críticas:**
- ⚠️ **NUNCA criar issue sem verificar se já existe**
- ⚠️ **SEMPRE perguntar tipo de issue (Story/Task/Subtask)**
- ⚠️ **SEMPRE perguntar antes de criar**
- ⚠️ **SEMPRE relacionar Story/Task a um Epic**
- ⚠️ **SEMPRE relacionar Subtask a uma história pai**
- ⚠️ **NUNCA criar novas categorias** (Labels/Components)
- ⚠️ **Usar APENAS categorias existentes** do projeto
- ⚠️ **Atribuir categorias automaticamente** baseado no contexto
- ⚠️ **NUNCA sugerir categorias** a menos que explicitamente solicitado
- ⚠️ Aguardar aprovação do usuário antes de implementar

**Saída:** Documentos em `.cursor/docs/` + Páginas no Confluence + Links no Jira + Issue no Jira vinculada ao Epic (ou história pai se Subtask).

### I - Implement (Implementação)

**Objetivo:** Implementar código seguindo as especificações aprovadas.

**Ações:**
- Criar branch vinculada à task
- Implementar seguindo specs
- Criar PR com links para documentação
- Atualizar Jira com progresso

**Saída:** Código + PR com rastreabilidade completa.

## Fluxo 1: Criar Nova Task (Completo)

**Trigger:** "tenho uma ideia", "criar task", "nova funcionalidade"

```
┌─────────────────────────────────────────┐
│ R - RESEARCH                            │
├─────────────────────────────────────────┤
│ • Entender contexto do projeto          │
│ • Verificar tasks similares no Jira     │
│ • Buscar specs relacionadas no Confluence│
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ REFINE (NOVO)                           │
├─────────────────────────────────────────┤
│ • Aplicar template de refinamento       │
│ • Definir valor de negócio              │
│ • Explicitar YAGNI (fora de escopo)     │
│ • Criar história no formato correto     │
│ • Gerar BDD preliminar                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ P - PLAN                                │
├─────────────────────────────────────────┤
│ 1. Verificar se issue já existe no Jira│
│    Se existir → Informar e PARAR        │
│ 2. Perguntar tipo: Story/Task/Subtask  │
│ 3. Se Subtask → Listar histórias        │
│    Se Story/Task → Listar Epics         │
│ 4. Obter categorias disponíveis         │
│ 5. Atribuir categorias automaticamente  │
│    (apenas existentes, sem criar)       │
│ 6. Perguntar confirmação                │
│ 7. Criar issue no Jira (com template)  │
│    - Tipo escolhido                     │
│    - Epic (se Story/Task)                │
│    - Parent (se Subtask)                 │
│    - Categorias atribuídas               │
│ 8. Criar spec local (PRD)              │
│ 9. Sincronizar spec → Confluence        │
│ 10. Vincular Confluence → Jira          │
│ 11. Aguardar aprovação                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ I - IMPLEMENT                           │
├─────────────────────────────────────────┤
│ • Criar branch: feature/UAG-XX-desc     │
│ • Após criar branch vinculada:           │
│   1. Extrair TASK_ID do nome da branch  │
│      (padrão: {tipo}/{TASK_ID}-{desc})  │
│   2. Obter task do Jira                  │
│   3. Verificar status atual:             │
│      - Se "To Do"/"Backlog"/"Open":      │
│        → Transicionar para "In Progress" │
│      - Se já "In Progress" ou posterior: │
│        → Manter status (não transicionar)│
│   4. Adicionar comentário com link       │
│      da branch                           │
│ • Se falhar integração: Continuar       │
│   (não bloquear criação da branch)       │
└─────────────────────────────────────────┘
```

## Fluxo 2: Puxar Task para Desenvolvimento

**Trigger:** "puxar task", "começar task", "iniciar UAG-XX"

```
┌─────────────────────────────────────────┐
│ R - RESEARCH                            │
├─────────────────────────────────────────┤
│ • Obter detalhes da task do Jira        │
│ • Buscar specs existentes no Confluence │
│ • Analisar código relacionado           │
│ • Verificar dependências                │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ P - PLAN                                │
├─────────────────────────────────────────┤
│ 1. Verificar se specs existem           │
│    Se NÃO → Criar specs necessárias     │
│    - Criar arquivo local                │
│    - Sincronizar → Confluence           │
│    - Vincular → Jira                    │
│ 2. Se TDD necessário → Criar TDD        │
│ 3. Aguardar aprovação do usuário        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ I - IMPLEMENT                           │
├─────────────────────────────────────────┤
│ • Criar branch vinculada                │
│ • Após criar branch:                    │
│   1. Extrair TASK_ID do nome da branch  │
│   2. Obter task do Jira                 │
│   3. Verificar status atual:            │
│      - Se inicial → Transicionar para   │
│        "In Progress"                    │
│      - Se já "In Progress" → Manter     │
│   4. Adicionar comentário com links     │
│      de documentação e branch           │
│ • Iniciar desenvolvimento               │
└─────────────────────────────────────────┘
```

## Fluxo 3: Finalizar Task (PR Completo)

**Trigger:** "finalizar task", "task pronta", "criar PR"

```
┌─────────────────────────────────────────┐
│ R - RESEARCH                            │
├─────────────────────────────────────────┤
│ • Verificar estado da branch            │
│ • Revisar commits e mudanças            │
│ • Verificar se specs foram seguidas     │
│ • Buscar links de documentação          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ P - PLAN                                │
├─────────────────────────────────────────┤
│ 1. Decisão ainda em aberto? → RFC       │
│    (skill `create-rfc`, pasta rfc/)     │
│ 2. Decisão arquitetural fechada? → ADR │
│    (skill `create-adr`, pasta adr/)     │
│    Sincronizar → Confluence (spec)      │
│ 3. Preparar descrição do PR com links   │
│ 4. Definir checklist de review          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ I - IMPLEMENT                           │
├─────────────────────────────────────────┤
│ • Push da branch                        │
│ • Criar PR com template completo:       │
│   - Link para task Jira                 │
│   - Links para specs no Confluence      │
│   - Links para arquivos locais          │
│ • Após criar PR vinculado:              │
│   1. Extrair TASK_ID de:                │
│      - Título: [UAG-XX]                 │
│      - Corpo: Closes UAG-XX             │
│      - Branch: feature/UAG-XX-desc      │
│   2. Obter task do Jira                 │
│   3. Verificar status atual:            │
│      - Se "In Progress":                │
│        → Transicionar para "Code Review"│
│      - Se já "Code Review" ou posterior:│
│        → Manter status (não transicionar)│
│   4. Adicionar comentário com link      │
│      do PR                              │
│ • Se falhar integração: Continuar       │
│   (não bloquear criação do PR)          │
└─────────────────────────────────────────┘
```

## Template de PR com Rastreabilidade

```markdown
## Resumo
[Descrição das mudanças implementadas]

## 🎫 Task
Closes [UAG-XX](https://site.atlassian.net/browse/UAG-XX)

## 📚 Documentação

| Tipo | Local | Confluence |
|------|-------|------------|
| PRD | [.cursor/docs/prd/PRD-{TASK_ID}.md](link) | [Ver no Confluence](confluence-link) (dentro da pasta da task) |
| RFC | [.cursor/docs/rfc/RFC-{TASK_ID}-titulo-kebab.md](link) | [Ver no Confluence](confluence-link) (dentro da pasta da task) |
| TDD | [.cursor/docs/tdd/TDD-{TASK_ID}.md](link) | [Ver no Confluence](confluence-link) (dentro da pasta da task) |
| ADR | [.cursor/docs/adr/ADR-NNN-titulo-kebab.md](link) | [Ver no Confluence](confluence-link) (dentro da pasta da task) |

## ✅ Checklist
- [ ] Código segue arquitetura definida na spec
- [ ] Testes implementados conforme TDD (se aplicável)
- [ ] Cenários BDD da task do Jira cobertos (se aplicável)
- [ ] Documentação atualizada

## Test Plan
[Descrição de como testar]
```

## Vinculação Automática

### Ao Criar Spec → Jira

**Comentário automático na task:**
```
📄 Documentação criada:
- PRD: [PRD-UAG-XX - Título](confluence-url)
- Arquivo local: .cursor/docs/prd/PRD-{TASK_ID}.md
```

### Ao Criar Branch → Jira

**Comentário automático:**
```
🌿 Branch criada: feature/UAG-XX-descricao
Repositório: owner/repo
```

### Ao Criar PR → Jira

**Processo automático:**

1. Extrair TASK_ID do PR (título, corpo ou branch)
2. Obter task do Jira
3. Verificar status atual:
   - Se "In Progress" → Transicionar para "Code Review"
   - Se já "Code Review" ou posterior → Manter status
4. Adicionar comentário automático:
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

### Ao Fechar Branch (Merge) → Jira

**Processo automático:**

1. Extrair TASK_ID do nome da branch
2. Obter task do Jira
3. Verificar se PR foi mergeado:
   - Se mergeado → Transicionar para "Done" ou "Concluído"
   - Se deletado sem merge → Manter status atual
4. Adicionar comentário final (se mergeado)

## Skills Relacionados

Esta skill orquestra e utiliza:

- **task-refinement**: Refinamento Agile de tasks (Feature Injection, YAGNI, KISS)
- **confluence-integration**: Sincronização de specs com Confluence
- **jira-integration**: Operações específicas do Jira
- **github-integration**: Operações específicas do GitHub
- **spec-generation**: Criação de PRD/RFC/TDD/ADR (publicação Confluence/Jira)
- **create-rfc**: RFC antes da decisão (RACI, opções, critérios)
- **create-adr**: Estrutura, formatos e qualidade do ADR local
- **skill-architect**: Checklist mínimo ao criar ou revisar uma skill (description, disclosure, composabilidade)
- **cursor-subagent-creator**: Subagents em `.cursor/agents/` (frontmatter, skill vs subagent; referência `laravel-simplifier.md`)
- **the-fool**: Crítica estruturada a planos/decisões (steelman, pré-mortem, red team) antes de comprometer
- **security-best-practices**: Revisão secure-by-default e relatórios por stack (Laravel/PHP + React/Inertia); ver `references/`

## Estrutura de Documentação

**Local (repositório):** documentação **por tipo** — cada documento na sua pasta, nomenclatura `{TASK_ID}` + título da tarefa.

```
.cursor/docs/
├── jira/              # Refinamentos: {TASK_ID}-refinamento.md
├── specs/             # Specs: {TASK_ID}-{titulo-kebab}.md
├── prd/               # PRD-{TASK_ID}.md
├── rfc/               # RFC-{TASK_ID}-{titulo-kebab}.md (ver create-rfc)
├── tdd/               # TDD-{TASK_ID}.md ou {TASK_ID}-{titulo}.md
├── adr/               # ADR-{NNN}-{titulo-kebab}.md (sequencial; ver create-adr)
└── {tipo}/_TEMPLATE.md
```

**Confluence (Atlassian):** criar **uma pasta** com nome `{TASK_ID} - {Título da task}`. **Dentro da pasta** apenas as subpáginas: **PRD**, **TDD**, **ADR** e **Spec** (quando existirem). **Refinamento não vai para o Confluence** — fica apenas na task do Jira (descrição/comentários). Modelo igual ao AKW-221: pasta com PRD, TDD, ADR e Spec dentro.

## Comandos Rápidos

| Comando | Ação |
|---------|------|
| "minhas tasks" | Lista tasks pendentes (R) |
| "criar task" | Inicia fluxo completo (R-P-I) |
| "puxar UAG-XX" | Inicia desenvolvimento (R-P-I) |
| "criar spec PRD para UAG-XX" | Cria PRD + Confluence + Jira |
| "criar RFC para UAG-XX" | Skill `create-rfc` + sync via `spec-generation` |
| "consultar spec UAG-XX" | Busca spec no Confluence |
| "finalizar task" | Cria PR com rastreabilidade (R-P-I) |
| "status" | Mostra estado atual |

## Referências

- Template de Task Jira: `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`
- Refinamento de tasks: Ver skill `task-refinement`
- Templates de documentação: `.cursor/docs/{tipo}/_TEMPLATE.md`
- Operações Confluence: Ver skill `confluence-integration`
- Operações Jira: Ver skill `jira-integration`
- Operações GitHub: Ver skill `github-integration`
- Geração de specs: Ver skill `spec-generation`
- RFC (pré-decisão): Ver skill `create-rfc`
- Arquitetura Laravel: Ver skill `laravel-inertia-react-architecture`
