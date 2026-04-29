# Connection Gate - Validação de Conexão Jira

> **Gate Bloqueante (quando Opção A for escolhida):** execute esta validação **somente** quando o fluxo for **“Conectar com Jira/Confluence agora”**.
>
> Se o usuário escolher **R‑P‑I sem Jira (modo local)** ou **Ir direto para implementação**, **não executar** este gate.

## Por que é obrigatório?

O identificador da task Jira (ex: `UAG-45`) é o **elo central** que conecta:
- Nome da branch: `feature/UAG-45-login-social`
- Arquivos de spec: `PRD-UAG-45.md`, `TDD-UAG-45.md`
- Páginas no Confluence: `PRD-UAG-45 - Título`
- Links no PR: `Closes UAG-45`

**Sem o identificador da task, NÃO é possível:**
- ❌ Criar branch com nomenclatura correta
- ❌ Criar arquivos de documentação (PRD, TDD, ADR)
- ❌ Sincronizar com Confluence
- ❌ Vincular PR à task
- ❌ Manter rastreabilidade do desenvolvimento

> **Nota:** BDD (Behavior-Driven Development) não é mais um documento separado. Os critérios de aceite em formato Gherkin ficam integrados na descrição da task do Jira.

---

## Fluxo de Validação (EXECUTAR PRIMEIRO)

```
┌─────────────────────────────────────────────────────────────┐
│                  VALIDATION GATE (BLOQUEANTE)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. TESTAR CONEXÃO                                         │
│     └─► Usar: user-atlassian-atlassianUserInfo             │
│         OU: user-atlassian-getAccessibleAtlassianResources │
│                                                             │
│  2. SE FALHAR CONEXÃO:                                     │
│     ├─► Informar usuário com mensagem padrão               │
│     ├─► PARAR EXECUÇÃO (não prosseguir para R-P-I)         │
│     └─► Aguardar confirmação para retry                    │
│                                                             │
│  3. SE CONEXÃO OK:                                         │
│     └─► Obter ou criar task (ver cenários abaixo)          │
│                                                             │
│  4. SE NÃO CONSEGUIR OBTER/CRIAR TASK:                     │
│     ├─► Informar usuário com mensagem padrão               │
│     ├─► PARAR EXECUÇÃO                                     │
│     └─► Aguardar confirmação para retry                    │
│                                                             │
│  5. SE TASK OBTIDA/CRIADA COM SUCESSO:                     │
│     ├─► Armazenar: TASK_ID (ex: UAG-45)                    │
│     ├─► Armazenar: TASK_TITLE                              │
│     ├─► Armazenar: TASK_DESCRIPTION                        │
│     └─► ✅ LIBERAR fluxo RPI                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cenários de Obtenção de Task

### Cenário A: Usuário fornece ID da task

**Triggers:** "puxar UAG-45", "trabalhar na task UAG-45", "iniciar UAG-45"

**Ação:** 
```
user-atlassian-getJiraIssue com o ID fornecido
```

**Se falhar:** PARAR e informar erro

---

### Cenário B: Usuário quer criar nova task

**Triggers:** "criar task", "nova funcionalidade", "tenho uma ideia"

**Ação:**
```
1. Coletar dados necessários (título, descrição, tipo)
2. user-atlassian-createJiraIssue com dados coletados
```

**Se falhar:** PARAR e informar erro
**Se sucesso:** Usar o ID retornado

---

### Cenário C: Usuário quer listar tasks disponíveis

**Triggers:** "minhas tasks", "listar tasks", "tasks pendentes"

**Ação:**
```
user-atlassian-searchJiraIssuesUsingJql
JQL: assignee = currentUser() AND status != Done ORDER BY priority DESC
```

**Próximo passo:**
- Usuário seleciona uma task → Usar ID selecionado
- Nenhuma selecionada → Perguntar se quer criar nova

---

## Mensagens de Erro Padrão

### Erro de Conexão

```
❌ **Falha na conexão com Jira**

Não foi possível conectar ao Jira. Isso pode ocorrer por:
- Credenciais expiradas ou inválidas
- Configuração MCP incorreta
- Problemas de rede

**Ação necessária:** Verifique a configuração do MCP Atlassian e tente novamente.

⏸️ Fluxo RPI pausado. Digite "tentar novamente" para reconectar.
```

### Erro ao Obter Task

```
❌ **Task não encontrada**

Não foi possível obter a task {TASK_ID} do Jira.

**Ação necessária:** Verifique se o ID está correto ou se você tem acesso à task.

⏸️ Fluxo RPI pausado. Forneça um ID válido ou crie uma nova task.
```

### Erro ao Criar Task

```
❌ **Falha ao criar task**

Não foi possível criar a task no Jira: {erro_detalhado}

**Ação necessária:** Verifique os campos obrigatórios e permissões.

⏸️ Fluxo RPI pausado. Corrija os dados e tente novamente.
```

---

## Nomenclatura Baseada no TASK_ID

Após validação bem-sucedida, o TASK_ID é usado em todos os artefatos:

| Artefato | Formato | Exemplo |
|----------|---------|---------|
| Branch | `{tipo}/{TASK_ID}-{descricao-kebab}` | `feature/UAG-45-login-social` |
| PRD | `PRD-{TASK_ID}.md` | `PRD-UAG-45.md` |
| TDD | `TDD-{TASK_ID}.md` | `TDD-UAG-45.md` |
| ADR | `ADR-{TASK_ID}-{titulo}.md` | `ADR-UAG-45-escolha-oauth.md` |
| Confluence | `{TIPO}-{TASK_ID} - {Título}` | `PRD-UAG-45 - Login Social` |
| PR Title | `[{TASK_ID}] {Título}` | `[UAG-45] Implementa login social` |
| PR Body | `Closes {TASK_ID}` | `Closes UAG-45` |

> **Nota:** BDD não é mais um documento separado. Os critérios de aceite em formato Gherkin ficam na descrição da task do Jira.

---

## Retry Logic

Quando uma falha ocorre:

1. **Informar claramente** o erro ao usuário
2. **PARAR** toda execução do fluxo RPI
3. **Aguardar** confirmação explícita para retry:
   - "tentar novamente"
   - "retry"
   - "reconectar"
4. **Executar** novamente a validação
5. **Só prosseguir** se validação passar

---

## Checklist de Validação

Antes de liberar o fluxo RPI, confirmar:

- [ ] Conexão com Jira estabelecida
- [ ] TASK_ID obtido e válido (formato: `PROJETO-NUMERO`)
- [ ] TASK_TITLE disponível
- [ ] Acesso à task confirmado

**Se qualquer item falhar → NÃO prosseguir**
