---
name: skill-architect
description: Guia enxuto para projetar novas skills do zero com qualidade. Use quando o usuário pedir "criar skill", "projetar skill", "arquitetar skill", "transformar isso em skill", "ensinar o agente a fazer X sempre" ou revisar gatilhos/description de uma skill. Não use para implementar features de produto ou specs técnicas (use TDD/Spec); para **subagents** Cursor use `cursor-subagent-creator`; para políticas fixas por arquivo, prefira `.cursor/rules/` em vez de nova skill.
---

# Skill Architect (playbook local)

Metodologia condensada a partir do [skill-architect — tech-leads-club](https://github.com/tech-leads-club/agent-skills/tree/main/packages/skills-catalog/skills/(creation)/skill-architect). Objetivo: **menos skills ruins** (disparo errado, texto gigante, conflito com outras skills).

## Antes de escrever o `SKILL.md`

### Descoberta (obrigatório)

- **Qual fluxo** deve ficar consistente? Um exemplo concreto passo a passo.
- **O que dá errado** sem a skill? (esquecimento, inconsistência, retrabalho.)
- **2–3 casos de uso:** o que o usuário diria → resultado esperado.
- **Ferramentas:** só texto, ou MCP, ou comandos Sail/Artisan?

**Só avance** quando isso estiver claro. Skill genérica piora o projeto.

### Arquitetura

- **Onde salvar:** skills de fluxo do projeto em `.cursor/skills/`; skills de domínio reutilizáveis também em `.agents/skills/` quando fizer sentido para o time. Siga irmãos na mesma pasta (nome da pasta = `name` do frontmatter, kebab-case).
- **Progressive disclosure:** frontmatter + corpo enxuto; material longo (> ~100 linhas) em `references/` e indique **quando** o agente deve abrir esse arquivo.
- **Campo `description` (crítico):** uma linha com **o que faz**, **frases que disparam**, **o que exclui** (evita sobreposição com `create-adr`, `create-rfc`, `spec-generation`, `task-workflow`, `pest-testing`, etc.). Veja modelo em `create-adr` e `create-rfc`.

### Composabilidade

Não assuma que só esta skill está carregada. Evite instruções que **contradigam** `laravel-inertia-react-architecture`, `AGENTS.md` ou o workflow R-P-I.

## Ao redigir

- Instruções em **imperativo**, exemplos concretos (entrada → saída).
- **Anti-padrões:** `README.md` dentro da pasta da skill; nome errado (`skill.md`); pasta com espaço ou maiúsculas; `description` vaga ("ajuda com código").
- Corpo do `SKILL.md`: meta **menos de ~500 linhas**; detalhe vai para `references/`.

## Checklist final

- [ ] `description` cobre gatilhos positivos e negativos em uma linha
- [ ] 2–3 casos de uso alinhados com o texto
- [ ] Sem conflito explícito com skills irmãs listadas acima
- [ ] Conteúdo pesado referenciado, não colado no corpo
- [ ] Idioma alinhado ao restante do projeto (pt-BR nas skills internas, salvo skill importada)

## Aprofundamento

Padrões completos, anti-padrões estendidos e ideia de validação estrutural estão no repositório tech-leads (link acima). **Não** é obrigatório copiar `scripts/`, `references/` extensos ou licença de terceiros para este repo.
