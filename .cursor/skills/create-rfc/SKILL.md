---
name: create-rfc
description: Cria Request for Comments (RFC) estruturados para propor mudanças significativas e alinhar stakeholders antes de decidir. Use quando o usuário pedir "criar RFC", "escrever RFC", "propor mudança", "alinhar decisão técnica", ou antes de comprometer direção (arquitetura, processo, fornecedor). Não use após a decisão já fechada (use create-adr + TDD); não use para especificação de implementação detalhada (use TDD/Spec).
---

# Create RFC (Request for Comments)

Propõe uma mudança, compara opções com critérios explícitos e separa **quem decide** de **quem contribui** (modelo RACI). O RFC é **iterável** até a aprovação; depois da decisão, o repositório usa **ADR** para registro durável e **TDD/Spec** para como construir.

## RFC vs ADR vs TDD vs PRD

| Documento | Momento | Pergunta principal |
|-----------|---------|-------------------|
| **RFC** | Antes de decidir | Devemos fazer? Qual opção? Quem aprova? |
| **ADR** | Depois de decidir | O que foi escolhido e por quê? (registro imutável) |
| **TDD** | Direção definida | Como implementar e testar? |
| **PRD** | Produto/escopo | O que o usuário/negócio precisa? |

Inspiração de estrutura e anti-padrões: [create-rfc no agent-skills (tech-leads-club)](https://github.com/tech-leads-club/agent-skills/tree/main/packages/skills-catalog/skills/(creation)/create-rfc).

## Quando usar / quando não usar

**Use** quando houver incerteza ou necessidade de alinhamento (várias opções, aprovação de liderança, impacto multi-time, escolha de fornecedor).

**Não use** para: bugfix pequeno; decisão já tomada e só falta documentar (**ADR**); plano de código e testes (**TDD**); refinamento de história (**Jira** / PRD de feature).

## Idioma

- Texto em **português**; termos técnicos comuns em inglês quando for o padrão (RFC, rollback, stakeholder).

## Onde salvar e nome do arquivo

- **Diretório:** `.cursor/docs/rfc/`
- **Arquivo:** `RFC-{TASK_ID}-{titulo-kebab}.md` (ex.: `RFC-AKW-300-migracao-postgresql.md`)
- **Task:** quase sempre há uma task Jira motora; vincule `task_id` / `task_url` na metadata do template.
- **Publicação:** após criar o markdown local, seguir **spec-generation** / **confluence-integration** para subpágina na pasta `{TASK_ID} - {Título}` no Confluence e comentário/link no Jira.

## Campos obrigatórios (antes de dar o RFC como pronto)

1. Título claro e orientado a ação  
2. **Impacto** (ALTO / MÉDIO / BAIXO) com justificativa curta  
3. **Driver** e **Approver(s)** (quem conduz vs quem decide)  
4. **Contexto**: estado atual, problema, por que agora, custo de não decidir  
5. **Pelo menos uma suposição** com confiança (Alta/Média/Baixa) e gatilho de invalidação  
6. **Critérios de decisão** (com pesos) **antes** das opções — evita “critério retrospectivo” para favorecer a opção preferida  
7. **No mínimo duas opções**, incluindo **manter status quo** (“não fazer nada”) quando a mudança for relevante  
8. **Itens de ação** pós-decisão (PoC, comunicação, criação de TDD)  
9. **Resultado (Outcome)** como placeholder até aprovação; preencher com data, decisão e racional após aprovação  

## Tipos de RFC (ajustar ênfase)

| Tipo | Foco extra |
|------|------------|
| Técnico / Arquitetura | Impacto em sistemas, migração, riscos técnicos |
| Processo | Adoção, rollback do processo, impacto em times |
| Produto / Feature | Usuários, métricas, critérios go/no-go |
| Fornecedor / Ferramenta | Custo, lock-in, critérios de avaliação |
| Política / Compliance | Auditoria, requisitos normativos |

## Qualidade e anti-padrões

- **Critérios antes das opções** (obrigatório).  
- **Opções honestas**, não “cartaz” para uma única escolha.  
- **Suposições explícitas** — senão viram risco invisível.  
- Após **Outcome** fechado: se a decisão for arquitetural duradoura, criar **ADR**; se for implementação, criar/atualizar **TDD**.

## Template

Copiar e preencher: `.cursor/docs/rfc/_TEMPLATE.md`

## Integração com o restante do projeto

| Skill / artefato | Papel |
|------------------|--------|
| `spec-generation` | Sync Confluence, metadata, Jira |
| `confluence-integration` | Hierarquia da pasta da task (subpágina **RFC**) |
| `create-adr` | Registrar decisão arquitetural após aprovação do RFC |
| `task-workflow` | Fase Plan: RFC quando ainda há decisão em aberto |
