---
name: confluence-integration
description: Integração com Confluence para sincronização de documentação técnica. Use quando precisar criar, atualizar, buscar ou consultar páginas no Confluence. Sincroniza automaticamente PRD, RFC, BDD, TDD e ADR com o Confluence, mantendo links entre task Jira, documentação e código.
allowed-tools: user-atlassian-createConfluencePage, user-atlassian-updateConfluencePage, user-atlassian-getConfluencePage, user-atlassian-getConfluenceSpaces, user-atlassian-searchConfluenceUsingCql, user-atlassian-getPagesInConfluenceSpace, user-atlassian-getConfluencePageDescendants, user-atlassian-getAccessibleAtlassianResources
---

# Confluence Integration

> Sincronização de documentação técnica entre repositório local e Confluence

## Quando Usar

Use este skill quando precisar:
- Criar páginas de documentação no Confluence
- Sincronizar PRD/RFC/BDD/TDD/ADR locais com Confluence
- Buscar documentação existente
- Vincular documentação a tasks do Jira
- Consultar especificações via LLM

## Estrutura: Local vs Confluence

### Local (repositório) — por tipo

Cada documento fica na **sua pasta por tipo**, com nomenclatura **número da task + título da tarefa**. Não se cria pasta com nome da task no repositório.

```
.cursor/docs/
├── jira/          → {TASK_ID}-refinamento.md
├── specs/         → {TASK_ID}-{titulo-kebab}.md
├── prd/           → PRD-{TASK_ID}.md
├── rfc/           → RFC-{TASK_ID}-{titulo-kebab}.md
├── tdd/           → TDD-{TASK_ID}.md ou {TASK_ID}-{titulo}.md
└── adr/           → ADR-{numero}-{titulo}.md
```

### Confluence (Atlassian) — pasta por task

No Confluence **criar uma pasta** com nome `{TASK_ID} - {Título da task}` (ex.: `AKW-221 - Arquitetura Multi-tenant com ACL Spatie Permission`). **Dentro da pasta** ficam as subpáginas: **PRD**, **RFC** (quando existir), **TDD**, **ADR** e **Spec**. **Refinamento não é publicado no Confluence** — fica apenas na task do Jira (descrição/comentários).

**Hierarquia no Confluence (obrigatória):**
```
📁 {TASK_ID} - {Título da task}
├── PRD-{TASK_ID} - {Título}   (quando criado)
├── RFC-{TASK_ID} - {Título}   (quando criado)
├── TDD-{TASK_ID} - {Título}   (quando criado)
├── ADR-{numero} - {Título}    (quando criado)
└── Spec-{TASK_ID} - {Título}  (spec técnica)
```

### Nomenclatura de Páginas (dentro da pasta da task)

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Spec | `Spec-{TASK_ID} - {Título}` | `Spec-AKW-203 - Autenticação Usuário e Verificar ERP ou Não` |
| PRD | `PRD-{TASK_ID} - {Título}` | `PRD-AKW-221 - Arquitetura Multi-tenant com ACL Spatie Permission` |
| RFC | `RFC-{TASK_ID} - {Título}` | `RFC-AKW-300 - Migração de banco de dados` |
| TDD | `TDD-{TASK_ID} - {Título}` | `TDD-AKW-221 - Arquitetura Multi-tenant...` |
| ADR | `ADR-{NUM} - {Título}` | `ADR-001 - Arquitetura Multi-tenant com ACL Spatie Permission` |

## Operações Disponíveis

### 1. Criar Página no Confluence

**Parâmetros necessários:**
- `cloudId`: ID da instância Atlassian (ou URL do site)
- `spaceId`: ID numérico do space
- `title`: Título da página
- `body`: Conteúdo em Markdown
- `parentId`: ID da página pai (para hierarquia)

**Exemplo de uso:**
```
Criar página PRD-UAG-45 no space "Documentação"
- Parent: Pasta PRD
- Conteúdo: [conteúdo do arquivo local]
```

### 2. Atualizar Página Existente

**Parâmetros necessários:**
- `cloudId`: ID da instância
- `pageId`: ID da página a atualizar
- `body`: Novo conteúdo
- `versionMessage`: Descrição da alteração

### 3. Buscar Documentação (CQL)

**Queries úteis:**
```cql
# Buscar PRD de uma task
title ~ "PRD-UAG-45" AND type = page

# Buscar todas specs de um tipo
title ~ "BDD-*" AND space = "DOC"

# Buscar por label
label = "spec" AND type = page

# Buscar recentes
type = page AND lastModified > now("-7d")
```

### 4. Consultar Página para LLM

**Workflow:**
1. Buscar página por título ou ID
2. Obter conteúdo em formato Markdown
3. Disponibilizar contexto para LLM

## Fluxo de Sincronização

### Ao Criar Spec Local → Confluence

```
┌─────────────────────────────────────────┐
│ 1. CRIAR SPEC LOCAL                      │
├─────────────────────────────────────────┤
│ • Garantir pasta .cursor/.cursor/docs/{TASK_ID}/         │
│ • Gerar arquivo em .cursor/.cursor/docs/{TASK_ID}/      │
│ • Adicionar metadata (task, data, autor) │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. SINCRONIZAR COM CONFLUENCE            │
├─────────────────────────────────────────┤
│ • Verificar se página existe (CQL)       │
│ • Se não existe → Criar página           │
│ • Se existe → Atualizar página           │
│ • Adicionar labels apropriados           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 3. VINCULAR À TASK JIRA                  │
├─────────────────────────────────────────┤
│ • Adicionar link no campo description    │
│ • Ou adicionar como comentário           │
│ • Usar formato: [Doc no Confluence](url) │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 4. ATUALIZAR ARQUIVO LOCAL               │
├─────────────────────────────────────────┤
│ • Adicionar link do Confluence na meta   │
│ • Registrar pageId para futuras updates  │
└─────────────────────────────────────────┘
```

### Metadata para Sincronização

Adicione ao início de cada spec local:

```markdown
---
task: UAG-45
title: Login Social no Portal Cativo
type: PRD
confluence_page_id: 123456789
confluence_url: https://site.atlassian.net/wiki/spaces/DOC/pages/123456789
last_sync: 2026-01-28T19:00:00
---
```

## Integração com Outros Skills

### Com spec-generation

Após criar spec local, automaticamente:
1. Sincronizar com Confluence
2. Obter URL da página
3. Registrar no arquivo local

### Com jira-integration

Ao sincronizar spec:
1. Atualizar descrição da task com link
2. Ou adicionar comentário com link
3. Formato: `📄 Documentação: [PRD-UAG-45](url)`

### Com github-integration

Ao criar PR:
1. Incluir links da documentação na descrição
2. Formato:
```markdown
## Documentação
- [PRD-UAG-45](confluence-url)
- [BDD-UAG-45](confluence-url)
- [ADR-001](confluence-url)
```

## Template de Sincronização

### Cabeçalho Padrão para Confluence

```markdown
| Campo | Valor |
|-------|-------|
| **Task** | [UAG-45](jira-url) |
| **Repositório** | [.cursor/docs/UAG-45/PRD-UAG-45.md](github-url) |
| **Status** | Draft / Review / Approved |
| **Última Atualização** | YYYY-MM-DD HH:MM |

---

[Conteúdo da spec...]
```

## Comandos Rápidos

| Comando | Ação |
|---------|------|
| "sincronizar spec" | Sync spec local → Confluence |
| "buscar PRD UAG-XX" | Busca PRD no Confluence |
| "consultar documentação" | Lista specs disponíveis |
| "atualizar confluence" | Atualiza página existente |

## Configuração Necessária

### Obter IDs

1. **CloudId**: Use `getAccessibleAtlassianResources`
2. **SpaceId**: Use `getConfluenceSpaces` com a key do space
3. **ParentId**: Use `getPagesInConfluenceSpace` ou `searchConfluenceUsingCql`

### Estrutura no Confluence

1. Para cada task: **criar uma pasta** (página pai) com nome `{TASK_ID} - {Título da tarefa}`.
2. **Dentro dessa pasta:** criar as subpáginas Spec, PRD, RFC, TDD, ADR (conforme existirem). **Refinamento não é subpágina** no Confluence.
3. **Refinamento não é publicado no Confluence** — história, escopo e critérios de aceite ficam apenas na task do Jira (descrição e comentários). No Confluence a pasta da task contém PRD, RFC (se houver), TDD, ADR e Spec.

## Referências

- Skill principal: `task-workflow`
- Geração de specs: `spec-generation`
- Integração Jira: `jira-integration`
- Integração GitHub: `github-integration`
