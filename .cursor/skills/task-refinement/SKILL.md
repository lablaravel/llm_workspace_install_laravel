---
name: task-refinement
description: Refinamento de tasks para Jira usando Injeção de Funcionalidades, YAGNI e KISS. Garante que toda task tenha valor de negócio claro, escopo MVP bem definido e critérios de aceite em formato Gherkin.
allowed-tools: user-atlassian-createJiraIssue, user-atlassian-editJiraIssue, Read, Write
---

# Task Refinement - Refinamento Agile de Tasks

> Refinamento disciplinado de tasks usando Injeção de Funcionalidades, YAGNI e KISS para garantir valor de negócio claro e escopo MVP bem definido

## Quando Usar

Use esta skill quando precisar:
- Refinar uma ideia ou requisito antes de criar a task no Jira
- Garantir que uma task tenha valor de negócio explícito
- Aplicar princípios YAGNI para definir escopo MVP
- Criar histórias de usuário no formato invertido (Feature Injection)
- Gerar critérios de aceite em formato BDD/Gherkin
- Validar que uma task está pronta para desenvolvimento

## Princípios Agile Aplicados

### 1. Injeção de Funcionalidades (Feature Injection)

**Conceito:** Processo de Análise de Negócios criado por Chris Matts baseado na teoria das opções reais.

**Aplicação:**
- Foco no **"porquê"** antes do **"como"**
- Valor de negócio deve estar claro antes de definir funcionalidades
- O valor não está nas funcionalidades em si, mas no resultado que o uso delas fornece ao usuário

**Formato de História Invertido:**
```
PARA QUE [valor de negócio],
COMO [papel do usuário],
EU QUERO [funcionalidade].
```

### 2. YAGNI (You Aren't Gonna Need It)

**Conceito:** Não implemente funcionalidades que você não precisa agora.

**Aplicação:**
- Definir escopo MVP (Minimum Viable Product)
- Explicitar o que **NÃO** será implementado nesta iteração
- Evitar "gold plating" - construir o mais simples que funcione

### 3. KISS (Keep It Simple)

**Conceito:** Mantenha simples e direto.

**Aplicação:**
- Escopo mínimo necessário para entregar valor
- Evitar complexidade desnecessária
- Foco em funcionalidades essenciais

### 4. Valor de Negócio e Prazo

**Conceito:** Entregar valor cedo e de forma previsível é tão importante quanto a qualidade.

**Aplicação:**
- Valor de negócio deve ser explícito e mensurável quando possível
- Prazo e valor são essenciais para priorização

### 5. Técnica Importa

**Conceito:** Práticas técnicas são pré-requisitos para que Agile funcione.

**Aplicação:**
- Testes automatizados
- CI/CD
- Controle de versão
- Ambientes de teste

## Estrutura de uma Task Refinada

Uma task refinada deve conter as seguintes seções obrigatórias:

### 1. História de Usuário (Formato Invertido)

```
PARA QUE [descrever o valor de negócio que será entregue],
COMO [papel do usuário no sistema],
EU QUERO [funcionalidade desejada].
```

**Exemplo:**
```
PARA QUE a clínica consiga organizar e controlar seus atendimentos de forma confiável e rastreável,
COMO usuário do sistema (recepcionista, administrador ou agente automatizado),
EU QUERO criar um agendamento vinculando médico, paciente, data e horário.
```

### 2. Valor de Negócio

Lista de benefícios que justificam a implementação:
- Benefício 1 mensurável
- Benefício 2 que impacta outras áreas
- Benefício 3 que reduz custos/tempo

### 3. Escopo MVP (YAGNI)

**Tabela de Campos:**
| Campo | Descrição | Tipo |
|-------|-----------|------|
| campo1 | descrição | tipo |

**Funcionalidades Incluídas:**
- Funcionalidade essencial 1
- Funcionalidade essencial 2

### 4. Fora de Escopo (YAGNI Explícito)

Lista explícita do que **NÃO** será implementado:
- ❌ Funcionalidade futura 1 - Razão: baixo valor agora
- ❌ Funcionalidade futura 2 - Razão: planejado para versão X

### 5. Requisitos de Aceitação (Checklist)

Lista verificável de requisitos:
- [ ] Requisito específico e verificável 1
- [ ] Requisito específico e verificável 2
- [ ] Requisito de validação/erro

### 6. Critérios de Aceite - BDD (Gherkin)

Formato Gherkin para especificação de comportamento:

```gherkin
Funcionalidade: [Nome da Feature]

  Como [papel]
  Quero [ação]
  Para [benefício]

  Cenário: [Nome do cenário de sucesso]
    Dado que [condição inicial]
    E [condição adicional]
    Quando [ação do usuário]
    Então [resultado esperado]
    E [resultado adicional]

  Cenário: [Nome do cenário de erro]
    Dado que [condição]
    Quando [ação incorreta]
    Então [comportamento de erro]
    E [feedback ao usuário]
```

### 7. Observações para o Time Técnico

- **Linguagem Ubíqua:** Termos de domínio importantes
- **Dependências:** Services/APIs/tabelas existentes
- **Decisões Arquiteturais:** Se aplicável, mencionar ADR
- **Considerações de Performance:** Se aplicável

## Processo de Refinamento

### Passo 1: Entender o Valor de Negócio

**Perguntas a responder:**
- Por que esta funcionalidade é necessária?
- Qual problema resolve?
- Qual o impacto se não implementarmos?
- Como medimos o sucesso?

### Passo 2: Definir Escopo MVP

**Perguntas a responder:**
- Qual é a versão mais simples que funciona?
- Quais campos são realmente obrigatórios?
- O que pode ser deixado para depois?

### Passo 3: Explicitar Fora de Escopo

**Perguntas a responder:**
- O que está sendo solicitado mas não será implementado?
- Por que não será implementado agora?
- Quando pode ser implementado?

### Passo 4: Criar História no Formato Correto

Usar o formato invertido:
```
PARA QUE [valor] → COMO [papel] → EU QUERO [funcionalidade]
```

### Passo 5: Gerar Critérios de Aceite BDD

Transformar a história em cenários Gherkin:
- Cenário de sucesso
- Cenários de erro/validação
- Edge cases importantes

## Checklist de Validação

Antes de considerar uma task refinada, verificar:

- [ ] História está no formato invertido (PARA QUE → COMO → EU QUERO)
- [ ] Valor de negócio está explícito e claro
- [ ] Escopo MVP está definido (tabela de campos)
- [ ] Fora de escopo está explícito (YAGNI aplicado)
- [ ] Requisitos de aceitação são verificáveis (checklist)
- [ ] Critérios de aceite estão em formato Gherkin
- [ ] Observações técnicas estão documentadas
- [ ] Task está pronta para ser criada no Jira

## Integração com Task Workflow

Esta skill é utilizada na etapa **REFINE** do fluxo R-P-I:

```
R - RESEARCH → REFINE → P - PLAN → I - IMPLEMENT
```

**Na etapa REFINE:**
1. Aplicar template de refinamento
2. Definir valor de negócio
3. Explicitar YAGNI (fora de escopo)
4. Criar história no formato correto
5. Gerar BDD preliminar (Gherkin) - **Nota:** BDD fica integrado na descrição da task do Jira, não como documento separado em `.cursor/docs/bdd/`

**Saída:** Task refinada pronta para ser criada no Jira usando o template `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`

**⚠️ IMPORTANTE - Antes de criar no Jira (etapa PLAN):**
- Verificar se issue já existe no Jira (buscar por título/descrição)
- Perguntar tipo de issue: História (Story), Task ou Subtask
- Se Subtask → Listar histórias disponíveis e perguntar ao usuário
- Se Story ou Task → Listar Epics disponíveis e perguntar ao usuário
- Sempre perguntar confirmação antes de criar
- Relacionar issue ao Epic escolhido (se Story/Task) ou à história pai (se Subtask)

## Template de Task Jira

Use o template em `docs/jira/_TEMPLATE-JIRA-TASK.md` ao criar a task no Jira após o refinamento.

## Referências

- **Princípios Agile detalhados:** `.cursor/skills/task-refinement/references/agile-principles.md`
- **Template de Task Jira:** `.cursor/docs/jira/_TEMPLATE-JIRA-TASK.md`
- **Task Workflow:** `.cursor/skills/task-workflow/SKILL.md`
- **Jira Integration:** `.cursor/skills/jira-integration/SKILL.md`

## Exemplo Completo

Ver exemplo completo em `refinador_task.md` na raiz do projeto.
