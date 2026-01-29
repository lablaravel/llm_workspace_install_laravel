---
name: confluence-integration
description: Integração com Confluence para sincronização de documentação técnica. Use quando precisar criar, atualizar, buscar ou consultar páginas no Confluence. Sincroniza automaticamente PRD, BDD, TDD e ADR com o Confluence, mantendo links entre task Jira, documentação e código.
allowed-tools: user-atlassian-createConfluencePage, user-atlassian-updateConfluencePage, user-atlassian-getConfluencePage, user-atlassian-getConfluenceSpaces, user-atlassian-searchConfluenceUsingCql, user-atlassian-getPagesInConfluenceSpace, user-atlassian-getConfluencePageDescendants, user-atlassian-getAccessibleAtlassianResources
---

# Confluence Integration

> Sincronização de documentação técnica entre repositório local e Confluence

## Quando Usar

Use este skill quando precisar:
- Criar páginas de documentação no Confluence
- Sincronizar PRD/BDD/TDD/ADR locais com Confluence
- Buscar documentação existente
- Vincular documentação a tasks do Jira
- Consultar especificações via LLM

## Estrutura no Confluence

### Hierarquia de Páginas

```
📁 [Projeto] - Documentação Técnica
├── 📁 PRD (Product Requirements)
│   ├── PRD-UAG-45 - Login Social
│   └── PRD-UAG-46 - Dashboard Admin
├── 📁 BDD (Behavior Specs)
│   ├── BDD-UAG-45 - Login Social
│   └── BDD-UAG-46 - Dashboard Admin
├── 📁 TDD (Test Specs)
│   ├── TDD-UAG-45 - Login Social
│   └── TDD-UAG-46 - Dashboard Admin
└── 📁 ADR (Architecture Decisions)
    ├── ADR-001 - Escolha Framework Auth
    └── ADR-002 - Estratégia de Cache
```

### Nomenclatura de Páginas

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| PRD | `PRD-{TASK-ID} - {Título}` | `PRD-UAG-45 - Login Social` |
| BDD | `BDD-{TASK-ID} - {Título}` | `BDD-UAG-45 - Login Social` |
| TDD | `TDD-{TASK-ID} - {Título}` | `TDD-UAG-45 - Login Social` |
| ADR | `ADR-{NUM} - {Título Kebab}` | `ADR-001 - Escolha Framework Auth` |

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
│ • Gerar arquivo em docs/{tipo}/          │
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
| **Repositório** | [docs/prd/PRD-UAG-45.md](github-url) |
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

### Estrutura Inicial

Criar hierarquia de pastas no Confluence:
1. Página raiz: "Documentação Técnica"
2. Subpáginas: PRD, BDD, TDD, ADR

## Referências

- Skill principal: `task-workflow`
- Geração de specs: `spec-generation`
- Integração Jira: `jira-integration`
- Integração GitHub: `github-integration`
