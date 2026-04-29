# Princípios Agile para Refinamento de Tasks

> Referência detalhada dos princípios Agile aplicados no refinamento de tasks

## 1. Injeção de Funcionalidades (Feature Injection)

### Conceito

Processo de Análise de Negócios criado por **Chris Matts** com base na teoria das opções reais. O objetivo é garantir que o valor de negócio esteja claro antes de definir funcionalidades.

### Princípios Fundamentais

1. **Foco no "porquê" antes do "como"**
   - Normalmente o PO dá ênfase no "como"
   - Se invertemos e o PO trouxer o **porquê**, junto com o time, podem chegar a um "como" muito melhor

2. **Valor de negócio deve estar claro**
   - Se o valor de negócio não está claro, a funcionalidade pode ser até entregue, porém de forma distorcida e sem o valor esperado

3. **Valor não está nas funcionalidades**
   - É importante lembrar que o valor não está nas funcionalidades em si, mas no resultado que o uso delas fornece ao usuário

### Formato de História Invertido

**Formato tradicional (evitar):**
```
Como [papel], eu quero [funcionalidade], para que [benefício].
```

**Formato recomendado (Feature Injection):**
```
PARA QUE [valor de negócio],
COMO [papel do usuário],
EU QUERO [funcionalidade].
```

**Exemplo:**
```
PARA QUE a clínica consiga organizar e controlar seus atendimentos de forma confiável e rastreável,
COMO usuário do sistema (recepcionista, administrador ou agente automatizado),
EU QUERO criar um agendamento vinculando médico, paciente, data e horário.
```

### Benefícios

- Garante que o valor de negócio seja o ponto de partida
- Facilita a comunicação entre PO e time técnico
- Reduz retrabalho por falta de clareza
- Permite que o time técnico sugira melhores soluções

---

## 2. YAGNI (You Aren't Gonna Need It)

### Conceito

**"Você não vai precisar disto"** - Princípio que orienta a não implementar funcionalidades que não são necessárias agora.

### Aplicação Prática

1. **Definir Escopo MVP**
   - Construir apenas o necessário para entregar valor
   - Evitar funcionalidades "por precaução"

2. **Explicitar Fora de Escopo**
   - Listar claramente o que **NÃO** será implementado
   - Documentar o motivo de não implementar agora
   - Indicar quando pode ser implementado (se aplicável)

3. **Evitar Gold Plating**
   - Construir o mais simples que funcione
   - Evitar gastar tempo em funcionalidade de baixo valor
   - Não adicionar features "nice to have" no MVP

### Exemplo de Aplicação

**Escopo MVP:**
- Criar agendamento simples com campos obrigatórios
- Validação básica de campos
- Registro de quem criou e origem

**Fora de Escopo (YAGNI):**
- ❌ Recorrência de agendamentos - Razão: não há demanda atual
- ❌ Overbooking - Razão: planejado para versão 2.0
- ❌ Encaixe automático - Razão: baixo valor agora
- ❌ Regras inteligentes de sugestão - Razão: complexidade desnecessária no MVP

### Benefícios

- Reduz tempo de desenvolvimento
- Foca em entregar valor rapidamente
- Evita complexidade desnecessária
- Permite validação rápida com usuários

---

## 3. KISS (Keep It Simple, Stupid)

### Conceito

**"Mantenha simples"** - Princípio que orienta a simplicidade no design e implementação.

### Aplicação Prática

1. **Escopo Mínimo**
   - Apenas o necessário para funcionar
   - Evitar complexidade desnecessária

2. **Solução Mais Simples**
   - Escolher a solução mais simples que resolve o problema
   - Não super-engenhar

3. **Comunicação Clara**
   - Usar linguagem simples e direta
   - Evitar jargões desnecessários

### Benefícios

- Facilita manutenção
- Reduz tempo de desenvolvimento
- Melhora compreensão do time
- Facilita testes e validação

---

## 4. Valor de Negócio e Prazo

### Conceito

**Entregar valor cedo e de forma previsível é tão importante quanto a qualidade do produto.**

### Princípios

1. **Valor de Negócio Essencial**
   - Cada task deve ter valor de negócio claro
   - Valor deve ser mensurável quando possível
   - Impacto deve ser documentado

2. **Prazo Importa**
   - Entregas incrementais são preferíveis
   - Time-boxing ajuda a focar no essencial
   - Previsibilidade é importante para stakeholders

3. **Qualidade Não Pode Ser Negligenciada**
   - Práticas técnicas são pré-requisitos
   - Testes automatizados são essenciais
   - CI/CD garante qualidade contínua

### Aplicação

- Definir métricas de sucesso quando possível
- Priorizar tasks por valor de negócio
- Estimar esforço para planejamento
- Entregar em incrementos pequenos e frequentes

---

## 5. Técnica Importa

### Conceito

**Práticas técnicas são pré-requisitos para que Agile funcione de verdade.**

### Práticas Essenciais

1. **Testes Automatizados**
   - Testes unitários
   - Testes de integração
   - Testes BDD (Gherkin)

2. **CI/CD**
   - Integração contínua
   - Deploy contínuo
   - Ambientes de teste

3. **Controle de Versão**
   - Git com branches
   - Code review
   - Histórico de mudanças

4. **Ambientes de Teste**
   - Ambiente de desenvolvimento
   - Ambiente de staging
   - Ambiente de produção

### Benefícios

- Reduz bugs em produção
- Facilita refatoração
- Permite deploy frequente
- Melhora qualidade do código

---

## 6. BDD (Behavior-Driven Development)

### Conceito

Metodologia que combina técnicas de TDD com práticas de análise de negócio, usando linguagem natural para descrever comportamentos.

### Formato Gherkin

```gherkin
Funcionalidade: [Nome da Feature]

  Como [papel]
  Quero [ação]
  Para [benefício]

  Cenário: [Nome do cenário]
    Dado que [condição inicial]
    E [condição adicional]
    Quando [ação do usuário]
    Então [resultado esperado]
    E [resultado adicional]
```

### Benefícios

- Especificação legível por não-técnicos
- Documentação viva (executável)
- Testes automatizados a partir da especificação
- Comunicação clara entre PO e time técnico

### Quando Usar

- Adicionar BDD quando necessário no contexto
- Transformar histórias em critérios de aceite (Gherkin)
- Especificar comportamentos complexos
- Documentar regras de negócio

---

## Resumo dos Princípios

| Princípio | Foco | Aplicação |
|-----------|------|-----------|
| **Feature Injection** | Valor de negócio primeiro | Formato de história invertido |
| **YAGNI** | Não implementar o desnecessário | Escopo MVP + Fora de escopo explícito |
| **KISS** | Simplicidade | Solução mais simples que funciona |
| **Valor e Prazo** | Entregar valor rápido | Métricas + Incrementos pequenos |
| **Técnica Importa** | Qualidade técnica | Testes, CI/CD, Versionamento |
| **BDD** | Especificação clara | Formato Gherkin para critérios |

---

## Referências

- **Feature Injection:** Chris Matts - "Feature Injection: a whack on the side of the head"
- **YAGNI:** Extreme Programming (XP) - Ron Jeffries
- **KISS:** U.S. Navy - "Keep it simple, stupid"
- **BDD:** Dan North - Behavior-Driven Development
- **Agile Manifesto:** https://agilemanifesto.org/
