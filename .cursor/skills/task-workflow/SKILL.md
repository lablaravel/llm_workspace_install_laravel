---
name: task-workflow
description: Orquestrador do fluxo completo de desenvolvimento seguindo metodologia R-P-I (Research, Plan, Implement). Integra Jira, GitHub, Confluence e documentação para gerenciar o ciclo completo de desenvolvimento de features. Sincroniza automaticamente specs com Confluence e vincula tudo à task.
allowed-tools: user-atlassian-searchJiraIssuesUsingJql, user-atlassian-getJiraIssue, user-atlassian-createJiraIssue, user-atlassian-editJiraIssue, user-atlassian-transitionJiraIssue, user-atlassian-addCommentToJiraIssue, user-atlassian-atlassianUserInfo, user-atlassian-getAccessibleAtlassianResources, user-atlassian-createConfluencePage, user-atlassian-updateConfluencePage, user-atlassian-getConfluencePage, user-atlassian-searchConfluenceUsingCql, user-atlassian-getConfluenceSpaces, user-github-list_branches, user-github-create_branch, user-github-list_commits, user-github-create_pull_request, user-github-pull_request_read, Shell, Read, Write, Grep, Glob
---

# Task Workflow - Orquestrador R-P-I Integrado

> Fluxo disciplinado de desenvolvimento com integração completa: Jira ↔ Confluence ↔ GitHub

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
│              │  docs/{prd,bdd,tdd,adr}│                     │
│              └────────────────────────┘                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Todos os artefatos são vinculados bidirecionalmente:**
- Task Jira → Links para Confluence, Branch, PR
- Página Confluence → Links para Jira, Arquivo Local
- PR GitHub → Links para Jira, Confluence
- Arquivo Local → Links para Jira, Confluence

## Metodologia R-P-I

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

### P - Plan (Planejamento + Documentação)

**Objetivo:** Criar especificações detalhadas antes de escrever o código e sincronizar com Confluence.

**Ações:**
1. Criar spec local (PRD/BDD/TDD/ADR)
2. Sincronizar com Confluence (automático)
3. Vincular à task Jira (automático)
4. Definir arquitetura proposta

**Regra Crítica:** Aguardar aprovação do usuário antes de implementar.

**Saída:** Documentos em `docs/` + Páginas no Confluence + Links no Jira.

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
│ P - PLAN                                │
├─────────────────────────────────────────┤
│ 1. Refinar ideia usando template        │
│ 2. Criar task no Jira                   │
│ 3. Criar spec local (PRD/BDD)           │
│ 4. Sincronizar spec → Confluence        │
│ 5. Vincular Confluence → Jira           │
│ 6. Aguardar aprovação                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ I - IMPLEMENT                           │
├─────────────────────────────────────────┤
│ • Criar branch: feature/UAG-XX-desc     │
│ • Atualizar Jira (Em Progresso)         │
│ • Comentário Jira: "🌿 Branch criada"   │
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
│ • Atualizar Jira (Em Progresso)         │
│ • Comentário: links de documentação     │
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
│ 1. Criar ADR se decisão arquitetural    │
│    - Criar arquivo local                │
│    - Sincronizar → Confluence           │
│ 2. Preparar descrição do PR com links   │
│ 3. Definir checklist de review          │
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
│ • Atualizar Jira (Code Review)          │
│ • Comentário Jira: link do PR           │
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
| PRD | [docs/prd/PRD-UAG-XX.md](link) | [Ver no Confluence](confluence-link) |
| BDD | [docs/bdd/BDD-UAG-XX.md](link) | [Ver no Confluence](confluence-link) |
| TDD | [docs/tdd/TDD-UAG-XX.md](link) | [Ver no Confluence](confluence-link) |
| ADR | [docs/adr/ADR-XXX.md](link) | [Ver no Confluence](confluence-link) |

## ✅ Checklist
- [ ] Código segue arquitetura definida na spec
- [ ] Testes implementados conforme TDD (se aplicável)
- [ ] Cenários BDD cobertos (se aplicável)
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
- Arquivo local: docs/prd/PRD-UAG-XX.md
```

### Ao Criar Branch → Jira

**Comentário automático:**
```
🌿 Branch criada: feature/UAG-XX-descricao
Repositório: owner/repo
```

### Ao Criar PR → Jira

**Comentário automático:**
```
🔀 Pull Request criado: #123
[PR Title](pr-url)
Status: Open | Reviewers: @user
```

## Skills Relacionados

Esta skill orquestra e utiliza:

- **confluence-integration**: Sincronização de specs com Confluence
- **jira-integration**: Operações específicas do Jira
- **github-integration**: Operações específicas do GitHub
- **spec-generation**: Criação de PRD/BDD/TDD/ADR

## Estrutura de Documentação

```
docs/
├── prd/          # Product Requirements Documents
│   ├── _TEMPLATE.md
│   └── PRD-UAG-XX.md
├── bdd/          # Behavior-Driven Development specs
│   ├── _TEMPLATE.md
│   └── BDD-UAG-XX.md
├── tdd/          # Test-Driven Development specs
│   ├── _TEMPLATE.md
│   └── TDD-UAG-XX.md
├── adr/          # Architecture Decision Records
│   ├── _TEMPLATE.md
│   └── ADR-XXX-titulo.md
└── specs/        # Especificações técnicas (Laravel)
```

## Comandos Rápidos

| Comando | Ação |
|---------|------|
| "minhas tasks" | Lista tasks pendentes (R) |
| "criar task" | Inicia fluxo completo (R-P-I) |
| "puxar UAG-XX" | Inicia desenvolvimento (R-P-I) |
| "criar spec PRD para UAG-XX" | Cria PRD + Confluence + Jira |
| "consultar spec UAG-XX" | Busca spec no Confluence |
| "finalizar task" | Cria PR com rastreabilidade (R-P-I) |
| "status" | Mostra estado atual |

## Referências

- Templates de documentação: `docs/{tipo}/_TEMPLATE.md`
- Operações Confluence: Ver skill `confluence-integration`
- Operações Jira: Ver skill `jira-integration`
- Operações GitHub: Ver skill `github-integration`
- Geração de specs: Ver skill `spec-generation`
- Arquitetura Laravel: Ver skill `laravel-inertia-react-architecture`
