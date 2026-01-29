# PRD: [Nome da Feature/Produto]

> **Copie este arquivo para PRD-{TASK-ID}.md antes de editar**
> Product Requirements Document - Documento de Requisitos de Produto otimizado para consumo por IA

## Metadata de Integração

```yaml
---
task_id: UAG-XX
task_url: https://site.atlassian.net/browse/UAG-XX
confluence_page_id: null
confluence_url: null
github_repo: owner/repo
github_branch: feature/UAG-XX-descricao
last_sync: null
status: draft
---
```

> **Task:** [UAG-XX](task_url) | **Confluence:** [Ver no Confluence](confluence_url)

---

## 1. Visão Geral

### O Problema

[Descreva claramente o problema que este produto/feature resolve. Seja específico sobre a dor do usuário ou necessidade de negócio.]

**Exemplo:**
- Usuários não conseguem recuperar senhas esquecidas sem contatar suporte
- Processo manual consome tempo da equipe e frustra usuários

### A Solução

[Descreva como este produto/feature resolve o problema. Seja objetivo e direto.]

**Exemplo:**
- Sistema de recuperação de senha via email com token seguro
- Processo automatizado que reduz carga de suporte em 80%

### Objetivo Principal

[Defina o que caracteriza o sucesso desta entrega. Seja mensurável quando possível.]

**Exemplo:**
- 90% dos usuários conseguem recuperar senha sem contatar suporte
- Tempo médio de recuperação reduzido de 2 horas para 5 minutos

---

## 2. Escopo e Requisitos

### 2.1 Requisitos Funcionais (In-Scope)

#### Feature 1: [Nome da Feature]

**Descrição:** [Descrição breve da funcionalidade]

**Critérios de Aceite:**
- [ ] Ao realizar [ação A], o sistema faz [comportamento B]
- [ ] Validação rigorosa de [campo X] antes de salvar
- [ ] Sistema exibe mensagem de erro clara quando [condição Y]

**User Story:**
> Como um [tipo de usuário], eu quero [ação], para que [benefício].

**Exemplo:**
> Como um usuário que esqueceu a senha, eu quero receber um link de recuperação por email, para que eu possa redefinir minha senha sem contatar suporte.

#### Feature 2: [Nome da Feature]

[Repetir estrutura acima para cada feature]

---

### 2.2 Não-Objetivos (Fora de Escopo)

> **Importante:** Esta seção é crítica para evitar que a IA gere funcionalidades não solicitadas.

- [ ] **Não será implementado:** [Funcionalidade X]
  - **Razão:** [Por que está fora de escopo]
- [ ] **Não será implementado:** [Integração com serviço Y]
  - **Razão:** Planejado para versão 2.0
- [ ] **Não será implementado:** [Suporte a dispositivo Z]
  - **Razão:** Foco inicial apenas em desktop

---

## 3. User Stories

### Personas

**Persona Principal:** [Nome/Descrição]
- **Necessidades:** [Lista de necessidades]
- **Frustrações:** [Lista de frustrações]
- **Objetivos:** [Lista de objetivos]

### Histórias de Usuário

| # | Como... | Eu quero... | Para que... | Prioridade |
|---|---------|-------------|-------------|------------|
| 1 | [usuário] | [ação] | [benefício] | Alta |
| 2 | [usuário] | [ação] | [benefício] | Média |
| 3 | [usuário] | [ação] | [benefício] | Baixa |

---

## 4. Métricas de Sucesso

### Métricas de Valor ao Cliente

| Métrica | Baseline | Target | Como Medir |
|---------|----------|--------|------------|
| [Métrica 1] | [valor atual] | [valor desejado] | [método de medição] |
| [Métrica 2] | [valor atual] | [valor desejado] | [método de medição] |

**Exemplo:**
| Métrica | Baseline | Target | Como Medir |
|---------|----------|--------|------------|
| Taxa de recuperação de senha sem suporte | 0% | 90% | Analytics de eventos |
| Tempo médio de recuperação | 120 min | 5 min | Timestamp de eventos |

### Métricas de Valor ao Negócio

| Métrica | Baseline | Target | Como Medir |
|---------|----------|--------|------------|
| Redução de tickets de suporte | [valor] | [valor] | Sistema de tickets |
| Taxa de adoção | [valor] | [valor] | Analytics |

---

## 5. Considerações Técnicas

### Stack Tecnológico

- **Backend:** [Framework/Linguagem e versão]
- **Frontend:** [Framework/Linguagem e versão]
- **Banco de Dados:** [SGBD e versão]
- **APIs Externas:** [Lista de APIs, se houver]

### Requisitos de Segurança

- [ ] [Requisito de segurança 1]
- [ ] [Requisito de segurança 2]

**Exemplo:**
- [ ] Tokens de recuperação devem expirar em 1 hora
- [ ] Tokens devem ser únicos e não reutilizáveis
- [ ] Rate limiting: máximo 3 tentativas por hora por email

### Requisitos de Performance

- [ ] [Requisito de performance 1]
- [ ] [Requisito de performance 2]

**Exemplo:**
- [ ] Email de recuperação enviado em menos de 30 segundos
- [ ] Página de redefinição carrega em menos de 2 segundos

### Dependências

- [ ] [Dependência 1] - [Status: Disponível/Pendente]
- [ ] [Dependência 2] - [Status: Disponível/Pendente]

---

## 6. Fases de Implementação

> **Filosofia:** Implementação incremental que deixa o código em estado executável a cada fase.

### Fase 1: Fundação

**Objetivo:** Schema de dados e configuração básica

- [ ] Criar migration para [tabela/campo]
- [ ] Configurar [serviço/configuração]
- [ ] Criar modelos básicos

**Entregável:** Base de dados estruturada e ambiente configurado

### Fase 2: Núcleo

**Objetivo:** Lógica de negócio e APIs fundamentais

- [ ] Implementar [Service/Classe principal]
- [ ] Criar endpoints de API
- [ ] Implementar validações

**Entregável:** Funcionalidade core funcionando via API

### Fase 3: Interface

**Objetivo:** Componentes de UI e integração de fluxos

- [ ] Criar componentes React/Vue
- [ ] Integrar com APIs
- [ ] Implementar feedback visual

**Entregável:** Interface funcional para usuário final

### Fase 4: Refinamento

**Objetivo:** Polimento de UX e tratamento de erros

- [ ] Melhorar mensagens de erro
- [ ] Adicionar loading states
- [ ] Implementar logs estruturados

**Entregável:** Experiência de usuário polida

### Fase 5: Validação

**Objetivo:** Testes e critérios de aceite finais

- [ ] Testes unitários (coverage ≥ 80%)
- [ ] Testes de integração
- [ ] Validação de critérios de aceite

**Entregável:** Feature testada e pronta para produção

---

## 7. Riscos e Assumptions

### Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|--------|-----------|
| [Risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [Estratégia] |
| [Risco 2] | Alta/Média/Baixa | Alto/Médio/Baixo | [Estratégia] |

### Assumptions

- [ ] Assumimos que [assumption 1]
- [ ] Assumimos que [assumption 2]

**Exemplo:**
- [ ] Assumimos que o serviço de email está disponível e confiável
- [ ] Assumimos que usuários têm acesso ao email cadastrado

---

## 8. Questões em Aberto

> **Use esta seção para documentar decisões pendentes que precisam ser resolvidas antes ou durante a implementação.**

- [ ] **Questão 1:** [Descrição da questão]
  - **Opções:** [Opção A] vs [Opção B]
  - **Decisão necessária até:** [Data]
  - **Responsável:** [Nome]

- [ ] **Questão 2:** [Descrição da questão]
  - **Opções:** [Opção A] vs [Opção B]
  - **Decisão necessária até:** [Data]
  - **Responsável:** [Nome]

---

## 9. Referências e Links

- **BDD Relacionado:** [BDD-{TASK-ID}](link-bdd)
- **TDD Relacionado:** [TDD-{TASK-ID}](link-tdd)
- **ADR Relacionado:** [ADR-{NUMERO}](link-adr)
- **Documentação Externa:** [Link]
- **Design/Protótipo:** [Link]

---

## Checklist de Validação

### Antes de Aprovar

- [ ] Problema claramente definido
- [ ] Solução objetiva e mensurável
- [ ] User stories completas e priorizadas
- [ ] Critérios de aceite específicos e testáveis
- [ ] Não-objetivos explícitos
- [ ] Métricas de sucesso definidas
- [ ] Requisitos técnicos claros
- [ ] Fases de implementação definidas
- [ ] Riscos identificados e mitigados
- [ ] Questões em aberto documentadas

### Para Uso com IA

- [ ] Documento é conciso (preferencialmente ≤ 2 páginas)
- [ ] Linguagem clara e sem ambiguidade
- [ ] Cada requisito é específico e verificável
- [ ] Não-objetivos estão explícitos para evitar escopo creep
- [ ] Fases permitem implementação incremental

---

## Notas de Implementação

### Decisões Técnicas Durante Desenvolvimento

- [Decisão 1 e razão]
- [Decisão 2 e razão]

### Mudanças de Escopo

- [Mudança 1 e razão]
- [Mudança 2 e razão]

---

**Última atualização:** YYYY-MM-DD  
**Versão:** 1.0  
**Status:** Draft | Review | Approved
