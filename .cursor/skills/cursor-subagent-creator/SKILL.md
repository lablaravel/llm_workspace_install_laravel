---
name: cursor-subagent-creator
description: Guia para criar subagents Cursor em `.cursor/agents/`. Use quando o usuário pedir "criar subagent", "novo agente Cursor", "agente especializado", delegação com contexto isolado ou padrões verifier/debugger. Não use para tarefas únicas sem isolamento (prefira skill em `.cursor/skills/`) nem para regras estáticas (prefira `.cursor/rules/`).
---

# Cursor Subagent Creator (playbook local)

Baseado no [cursor-subagent-creator — tech-leads-club](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(creation)/cursor-subagent-creator/SKILL.md). **Referência viva no repo:** `.cursor/agents/laravel-simplifier.md`.

## Skill vs subagent (decisão rápida)

| Use **subagent** | Use **skill** |
|------------------|---------------|
| Vários passos + benefício de **contexto isolado** | Um fluxo reutilizável **no mesmo** contexto do agente principal |
| Verificação independente (“ser cético”) após trabalho grande | Formato de saída, convenções, checklists por domínio |
| Exploração longa (debug profundo, auditoria) | “Sempre que editar X, faça Y” sem delegar outro agente |

Tarefa simples e pontual → normalmente **não** merece subagent.

## Onde e como nomear

- **Projeto:** `.cursor/agents/{nome-kebab}.md` (versionar no Git com o time).
- **Nome:** kebab-case, uma responsabilidade clara (`security-review`, não `helper`).

## Frontmatter (Cursor)

```yaml
---
name: nome-kebab
description: Especialista em X. Use quando [contexto concreto]. Use proativamente após [gatilho].
model: inherit   # opcional: inherit | fast | id específico
readonly: false  # opcional: true se só ler/analisar
is_background: false  # opcional: true para tarefas longas em background
---
```

- **`description`:** como no `laravel-simplifier`: quem é + **quando** delegar (frases que o orquestrador usa).
- **`model: fast`:** checagens curtas (estilo verifier leve).
- **`readonly: true`:** auditorias / revisão sem escrita.
- **`is_background:`** só quando o fluxo Cursor em uso suportar e fizer sentido.

## Corpo do arquivo

1. Papel (“Você é…”).  
2. **Quando invocado:** passos numerados e testáveis.  
3. Restrições (o que não fazer).  
4. **Formato de saída** esperado (listas, severidades, etc.).

Manter **enxuto**; prompt enorme não melhora resultado proporcionalmente.

## Anti-padrões (do guia original, adaptados)

- Dezenas de subagents genéricos; começar com **poucos** e bem definidos.  
- `description` vaga (“ajuda geral”).  
- Duplicar o que já é uma **skill** (mesmo gatilho, sem necessidade de isolamento).  
- Copiar exemplos longos (code-reviewer completo, orchestrator) sem necessidade — use como inspiração, não como padrão de tamanho.

## Checklist antes de commitar

- [ ] `description` diz **quando** delegar (e opcionalmente “use proativamente quando…”)  
- [ ] Um objetivo por arquivo  
- [ ] Passos e saída definidos  
- [ ] `model` / `readonly` / `is_background` coerentes com o risco e o tipo de tarefa  

## O que **não** precisamos importar do pacote completo

- Texto integral dos 6 templates de exemplo (verifier, debugger, etc.) — estão no repositório tech-leads se precisar copiar um trecho.  
- Detalhes de **resume agent ID** / caminhos `~/.cursor/subagents/` — dependem da versão do Cursor; consulte a documentação atual do produto quando for usar background/resume.
