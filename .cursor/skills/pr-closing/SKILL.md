---
name: pr-closing
description: Workflow para finalização segura de Pull Requests, incluindo validação de DoD (Definition of Done), Merge, atualização do Jira e limpeza local.
---

# PR Closing Workflow

> Protocolo de encerramento de tarefa. Executar quando o Code Review for aprovado e o usuário quiser realizar merge e finalizar a task no Jira.

## Quando Usar

Use este skill quando:

- O PR recebeu aprovação no GitHub.
- Os testes de CI passaram.
- O usuário deseja realizar o merge e finalizar a task no Jira.

**Ferramentas:** MCP GitHub (leitura e merge de PR); MCP Atlassian (get issue, transition, add comment).

## 1. Validation Gate (Pré-Merge)

Antes de prosseguir com o merge, execute as validações abaixo.

### Verificação de Status do PR

Usar MCP GitHub para verificar o PR:

1. **Mergeable:** O PR pode ser mergeado sem conflitos?
2. **Review:** Existe pelo menos 1 aprovação (`APPROVED`)?
3. **CI Status:** Os checks (testes/lint) estão verdes?

### Verificação de Documentação (DoD)

Verificar se a documentação exigida no `workflow.mdc` foi entregue:

- [ ] Arquivos locais em `.cursor/docs/` (specs, jira, prd, tdd, adr) foram commitados?
- [ ] Links para Confluence estão no corpo do PR?
- [ ] Se houve mudança de arquitetura, o ADR foi criado?

## 2. Processo de Merge

**Nota:** Se não houver ferramenta de merge automática configurada (ex.: MCP), orientar merge manual ou via CLI e prosseguir com o pós-merge após confirmação.

1. **Squash and Merge:** Preferencial para manter histórico linear na branch base (`main` ou `develop`).
2. **Mensagem de Commit:** Deve incluir o TASK_ID.

Exemplo:

```text
Merge pull request #123 from feature/UAG-45-login-social

UAG-45: Implementa login social e atualiza specs
```

## 3. Automação Pós-Merge (Jira)

Após confirmar que o PR foi mergeado (status merged):

### 3.1 Transição de Status

1. Extrair TASK_ID da branch ou do título do PR.
2. Obter status atual da task (MCP Atlassian).
3. Transicionar para **"Done"**, **"Closed"** ou **"Ready for QA"** (conforme o workflow do time).

### 3.2 Comentário de Encerramento

Adicionar um comentário final na task para fechar o ciclo de rastreabilidade:

```markdown
✅ **Task Finalizada via PR #{PR_NUMBER}**

| Recurso | Status | Detalhes |
|---------|--------|----------|
| **Código** | Merged | Branch `{BRANCH_NAME}` removida |
| **Doc** | Sincronizada | [Ver Docs no Repo](github_link_docs) |
| **Testes** | Aprovados | CI Passed |

---
*Merge realizado em YYYY-MM-DD por {USER}*
```

## 4. Limpeza Local (Instruções)

Como passo final, instruir o usuário a limpar o ambiente local:

```bash
git checkout <branch-base>   # ex.: main ou develop
git pull origin <branch-base>
git branch -d feature/{TASK_ID}-{descricao}
# Se a branch remota ainda existir:
git push origin --delete feature/{TASK_ID}-{descricao}
```

## Exemplo de Uso

**Usuário:** "Quero fechar o PR da task UAG-45."

**Fluxo:**

1. Ler PR vinculado à UAG-45 (MCP GitHub).
2. Verificar se está aprovado e CI OK.
3. Se OK → Solicitar/confirmar merge (ou executar merge se a ferramenta estiver disponível).
4. Após merge → Obter task UAG-45, transicionar para "Done" no Jira (MCP Atlassian).
5. Postar comentário de encerramento na task.
6. Fornecer comandos de limpeza git ao usuário.

## Integração com Outros Skills

- **workflow.mdc:** A seção "4. C - Close (Encerramento e Merge)" delega a este skill.
- **github-integration:** Criação de PRs e branches; pr-closing cuida do fechamento.
- **jira-integration:** Transição e comentários usam as mesmas operações do Jira.

## Referências

- Workflow principal: `.cursor/rules/workflow.mdc` (seção 4. C - Close)
- **Workflow (seção 4):** `.cursor/rules/workflow.mdc`
