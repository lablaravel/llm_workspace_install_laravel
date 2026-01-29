# BDD: [Nome da Feature]

> **Copie este arquivo para BDD-{TASK-ID}.md antes de editar**
> Behavior-Driven Development - Especificação de comportamento usando formato Gherkin

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
> **PRD Relacionado:** [PRD-{TASK-ID}](link-prd)

---

## 1. Visão Geral da Feature

### Descrição

[Breve descrição do comportamento que será especificado. Foque no "o quê" e "porquê", não no "como".]

**Exemplo:**
Sistema de recuperação de senha permite que usuários redefinam suas senhas através de um link seguro enviado por email, sem necessidade de contatar suporte.

### Objetivo

[Qual problema de negócio ou necessidade do usuário esta feature resolve?]

**Exemplo:**
Reduzir carga de suporte e melhorar experiência do usuário ao recuperar acesso à conta.

---

## 2. Especificação Gherkin

### Feature: [Nome da Feature]

```gherkin
Feature: [Nome da Feature]
  Como um [tipo de usuário]
  Eu quero [ação]
  Para que [benefício]

  [Descrição opcional da feature e contexto adicional]
```

**Exemplo:**
```gherkin
Feature: Recuperação de Senha
  Como um usuário que esqueceu a senha
  Eu quero receber um link de recuperação por email
  Para que eu possa redefinir minha senha sem contatar suporte

  Esta feature permite que usuários recuperem acesso às suas contas
  de forma autônoma e segura, reduzindo a carga de trabalho do suporte.
```

---

### Background (Setup Comum)

```gherkin
Background:
  Dado que existe um usuário cadastrado no sistema
    E o email do usuário é "usuario@exemplo.com"
    E a senha atual é "senha123"
```

> **Nota:** Use Background para definir condições comuns a todos os cenários da feature. Isso evita repetição e torna os cenários mais legíveis.

---

### Cenários de Teste

#### Cenário 1: [Nome do Cenário - Caso de Sucesso]

```gherkin
Scenario: [Nome descritivo do cenário]
  Dado [condição inicial]
  Quando [ação realizada]
  Então [resultado esperado]
  E [resultado adicional esperado]
```

**Exemplo:**
```gherkin
Scenario: Usuário solicita recuperação de senha com email válido
  Dado que existe um usuário com email "usuario@exemplo.com"
  Quando o usuário acessa a página de recuperação de senha
    E informa o email "usuario@exemplo.com"
    E clica em "Enviar link de recuperação"
  Então o sistema deve enviar um email para "usuario@exemplo.com"
    E o email deve conter um link de recuperação válido
    E o link deve expirar em 1 hora
    E o sistema deve exibir mensagem "Email de recuperação enviado"
```

#### Cenário 2: [Nome do Cenário - Caso de Erro]

```gherkin
Scenario: [Nome descritivo do cenário de erro]
  Dado [condição inicial]
  Quando [ação realizada]
  Então [resultado de erro esperado]
  E [mensagem de erro esperada]
```

**Exemplo:**
```gherkin
Scenario: Usuário tenta recuperar senha com email não cadastrado
  Dado que não existe usuário com email "naoexiste@exemplo.com"
  Quando o usuário acessa a página de recuperação de senha
    E informa o email "naoexiste@exemplo.com"
    E clica em "Enviar link de recuperação"
  Então o sistema deve exibir mensagem "Se o email estiver cadastrado, você receberá um link de recuperação"
    E nenhum email deve ser enviado
    E o sistema não deve revelar se o email existe ou não (segurança)
```

#### Cenário 3: [Nome do Cenário - Edge Case]

```gherkin
Scenario: [Nome descritivo do edge case]
  Dado [condição especial]
  Quando [ação realizada]
  Então [comportamento esperado em caso limite]
```

**Exemplo:**
```gherkin
Scenario: Usuário tenta usar link de recuperação expirado
  Dado que existe um token de recuperação expirado há 2 horas
  Quando o usuário acessa o link de recuperação expirado
  Então o sistema deve exibir mensagem "Link expirado. Solicite um novo link."
    E o usuário deve ser redirecionado para página de solicitação
```

---

### Cenários com Tabelas de Exemplos

```gherkin
Scenario Outline: [Nome do cenário parametrizado]
  Dado [condição com <parâmetro>]
  Quando [ação]
  Então [resultado esperado]

  Exemplos:
    | parâmetro | resultado |
    | valor1    | esperado1 |
    | valor2    | esperado2 |
```

**Exemplo:**
```gherkin
Scenario Outline: Validação de formato de email
  Dado que o usuário está na página de recuperação de senha
  Quando o usuário informa o email "<email>"
    E clica em "Enviar link de recuperação"
  Então o sistema deve exibir "<mensagem>"

  Exemplos:
    | email                    | mensagem                                    |
    | usuario@exemplo.com      | Email de recuperação enviado                |
    | email.invalido          | Por favor, informe um email válido          |
    | usuario@                 | Por favor, informe um email válido          |
    | @exemplo.com            | Por favor, informe um email válido          |
    | usuario@exemplo         | Por favor, informe um email válido          |
```

---

## 3. Critérios de Aceite

### Critérios Funcionais

| # | Critério | Prioridade | Status |
|---|----------|------------|--------|
| 1 | [Critério específico e testável] | Alta/Média/Baixa | ⏳ |
| 2 | [Critério específico e testável] | Alta/Média/Baixa | ⏳ |
| 3 | [Critério específico e testável] | Alta/Média/Baixa | ⏳ |

**Exemplo:**
| # | Critério | Prioridade | Status |
|---|----------|------------|--------|
| 1 | Sistema deve enviar email de recuperação em até 30 segundos | Alta | ⏳ |
| 2 | Link de recuperação deve ser único e não reutilizável | Alta | ⏳ |
| 3 | Link deve expirar após 1 hora | Alta | ⏳ |
| 4 | Sistema não deve revelar se email existe ou não | Média | ⏳ |
| 5 | Usuário deve poder solicitar novo link após expiração | Baixa | ⏳ |

### Critérios Não-Funcionais

| # | Critério | Prioridade | Status |
|---|----------|------------|--------|
| 1 | [Critério de performance/segurança] | Alta/Média/Baixa | ⏳ |
| 2 | [Critério de performance/segurança] | Alta/Média/Baixa | ⏳ |

**Exemplo:**
| # | Critério | Prioridade | Status |
|---|----------|------------|--------|
| 1 | Email deve ser enviado de forma assíncrona (não bloquear request) | Alta | ⏳ |
| 2 | Rate limiting: máximo 3 tentativas por hora por email | Alta | ⏳ |
| 3 | Tokens devem ser criptograficamente seguros | Alta | ⏳ |

---

## 4. Dados de Teste Necessários

### Fixtures/Seeds

```php
// Exemplo para Laravel/PHP
User::factory()->create([
    'email' => 'usuario@exemplo.com',
    'password' => Hash::make('senha123'),
]);

// Token de recuperação expirado
PasswordResetToken::create([
    'email' => 'usuario@exemplo.com',
    'token' => 'token-expirado',
    'created_at' => now()->subHours(2),
    'expires_at' => now()->subHour(),
]);
```

### Dados de Teste por Cenário

| Cenário | Dados Necessários | Setup Requerido |
|---------|-------------------|-----------------|
| [Cenário 1] | [Lista de dados] | [Como preparar] |
| [Cenário 2] | [Lista de dados] | [Como preparar] |

**Exemplo:**
| Cenário | Dados Necessários | Setup Requerido |
|---------|-------------------|-----------------|
| Recuperação bem-sucedida | Usuário com email válido | Criar usuário via factory |
| Email não cadastrado | Nenhum usuário | Não criar usuário |
| Link expirado | Token expirado | Criar token com created_at antigo |

---

## 5. Mapeamento de Steps para Código

### Step Definitions Necessárias

| Step Gherkin | Arquivo de Step Definition | Implementação |
|--------------|---------------------------|----------------|
| `Dado que existe um usuário...` | `tests/Feature/Steps/UserSteps.php` | `User::factory()->create(...)` |
| `Quando o usuário acessa...` | `tests/Feature/Steps/NavigationSteps.php` | `$this->visit('/recover-password')` |
| `Então o sistema deve enviar...` | `tests/Feature/Steps/EmailSteps.php` | `Mail::assertSent(...)` |

**Exemplo para Laravel/Pest:**

```php
// tests/Feature/Steps/PasswordRecoverySteps.php

use function Pest\Laravel\{post, assertDatabaseHas, Mail};

Given('que existe um usuário com email {string}', function (string $email) {
    User::factory()->create(['email' => $email]);
});

When('o usuário informa o email {string} e clica em "Enviar link de recuperação"', function (string $email) {
    Mail::fake();
    post('/password/recover', ['email' => $email]);
});

Then('o sistema deve enviar um email para {string}', function (string $email) {
    Mail::assertSent(PasswordRecoveryMail::class, function ($mail) use ($email) {
        return $mail->hasTo($email);
    });
});
```

---

## 6. Fluxo de Usuário (User Flow)

### Diagrama de Fluxo

```
[Início]
  ↓
[Usuário acessa página de recuperação]
  ↓
[Usuário informa email]
  ↓
[Usuário clica em "Enviar"]
  ↓
{Sistema valida email}
  ↓
  ├─ Email inválido → [Exibe erro] → [Volta ao início]
  └─ Email válido → [Envia email] → [Exibe mensagem de sucesso]
                      ↓
                  [Usuário recebe email]
                      ↓
                  [Usuário clica no link]
                      ↓
                  {Link válido?}
                      ↓
                      ├─ Expirado → [Exibe erro] → [Solicita novo link]
                      └─ Válido → [Página de redefinição]
                                  ↓
                              [Usuário define nova senha]
                                  ↓
                              [Senha atualizada com sucesso]
```

---

## 7. Regras de Negócio

### Regras Principais

1. **Regra 1:** [Descrição clara da regra]
   - **Quando:** [Condição]
   - **Então:** [Ação/Comportamento]

2. **Regra 2:** [Descrição clara da regra]
   - **Quando:** [Condição]
   - **Então:** [Ação/Comportamento]

**Exemplo:**
1. **Regra de Expiração:** Tokens de recuperação expiram em 1 hora
   - **Quando:** Token foi criado há mais de 1 hora
   - **Então:** Link não funciona e usuário deve solicitar novo

2. **Regra de Rate Limiting:** Máximo 3 tentativas por hora
   - **Quando:** Usuário tenta solicitar recuperação pela 4ª vez em 1 hora
   - **Então:** Sistema bloqueia novas tentativas e informa "Aguarde X minutos"

---

## 8. Integração com TDD

### Testes Relacionados

- **TDD Relacionado:** [TDD-{TASK-ID}](link-tdd)
- **Testes Unitários:** [Lista de testes unitários necessários]
- **Testes de Integração:** [Lista de testes de integração necessários]

### Mapeamento BDD → TDD

| Cenário BDD | Teste TDD Correspondente | Arquivo |
|-------------|-------------------------|---------|
| [Cenário 1] | [Nome do teste] | `tests/Feature/...` |
| [Cenário 2] | [Nome do teste] | `tests/Feature/...` |

---

## 9. Checklist de Validação

### Antes de Aprovar BDD

- [ ] Todos os cenários estão em formato Gherkin válido
- [ ] Cenários cobrem casos de sucesso, erro e edge cases
- [ ] Background está definido quando há setup comum
- [ ] Tabelas de exemplos são usadas quando apropriado
- [ ] Critérios de aceite são específicos e testáveis
- [ ] Dados de teste estão definidos
- [ ] Step definitions estão mapeadas
- [ ] Regras de negócio estão documentadas
- [ ] Fluxo de usuário está claro

### Para Uso com IA

- [ ] Linguagem Given/When/Then é clara e sem ambiguidade
- [ ] Cada cenário testa um comportamento específico
- [ ] Cenários são independentes e podem rodar em qualquer ordem
- [ ] Dados de teste são realistas e representativos

---

## 10. Referências

- **PRD Relacionado:** [PRD-{TASK-ID}](link-prd)
- **TDD Relacionado:** [TDD-{TASK-ID}](link-tdd)
- **Documentação Gherkin:** https://cucumber.io/docs/gherkin/
- **Cucumber Reference:** https://cucumber.io/docs/gherkin/reference/

---

**Última atualização:** YYYY-MM-DD  
**Versão:** 1.0  
**Status:** Draft | Review | Approved
