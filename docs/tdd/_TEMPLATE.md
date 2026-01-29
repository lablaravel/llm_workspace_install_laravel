# TDD: [Nome da Feature/Funcionalidade]

> **Copie este arquivo para TDD-{TASK-ID}.md antes de editar**
> Test-Driven Development - Especificação de testes antes da implementação

## Metadata
- **Task:** [UAG-XX](link-jira)
- **PRD Relacionado:** [PRD-UAG-XX](link-prd)
- **BDD Relacionado:** [BDD-UAG-XX](link-bdd)
- **Data:** YYYY-MM-DD
- **Autor:** [Nome]

---

## Visão Geral

[Breve descrição da funcionalidade que será desenvolvida com TDD]

**Objetivo:** Garantir que a implementação atenda aos requisitos através de testes escritos antes do código.

---

## Estratégia de Testes

### Tipo de Testes

- [ ] **Unit Tests** - Testes de unidades isoladas (classes, métodos)
- [ ] **Feature Tests** - Testes de funcionalidades completas (endpoints, fluxos)
- [ ] **Integration Tests** - Testes de integração com serviços externos
- [ ] **Contract Tests** - Testes de contrato com APIs externas (ex: Stripe)

### Ferramentas

| Ferramenta | Uso |
|------------|-----|
| PestPHP | Framework de testes |
| Mockery | Mocks e stubs |
| Laravel Factories | Dados de teste |
| Pest Parallel | Execução paralela |

---

## Ciclo TDD: Red → Green → Refactor

### Fase 1: RED - Escrever Teste que Falha

> **Regra:** Escrever o teste ANTES da implementação

### Fase 2: GREEN - Fazer o Teste Passar

> **Regra:** Implementar o mínimo necessário para o teste passar

### Fase 3: REFACTOR - Melhorar o Código

> **Regra:** Melhorar a qualidade sem quebrar os testes

---

## Especificação de Testes

### 1. Testes Unitários

#### 1.1 [Nome da Classe/Método]

**Arquivo:** `tests/Unit/[Namespace]/[ClassName]Test.php`

```php
<?php

use Tests\TestCase;
use App\[Namespace]\[ClassName];

describe('[ClassName]', function () {
    
    it('deve [comportamento esperado] quando [condição]', function () {
        // Arrange
        $input = [dados de entrada];
        
        // Act
        $result = [ClassName]::method($input);
        
        // Assert
        expect($result)->toBe([resultado esperado]);
    });
    
    it('deve lançar exceção quando [condição inválida]', function () {
        // Arrange
        $invalidInput = [dados inválidos];
        
        // Act & Assert
        expect(fn() => [ClassName]::method($invalidInput))
            ->toThrow([ExceptionClass]::class);
    });
    
    it('deve [comportamento] com [dados de borda]', function () {
        // Teste de edge case
    });
});
```

**Cenários de Teste:**

| # | Cenário | Entrada | Saída Esperada | Status |
|---|---------|---------|----------------|--------|
| 1 | [Cenário de sucesso] | [dados] | [resultado] | ⏳ |
| 2 | [Cenário de erro] | [dados inválidos] | [exceção] | ⏳ |
| 3 | [Edge case] | [dados limite] | [resultado] | ⏳ |

---

### 2. Testes de Feature (Funcionalidade Completa)

#### 2.1 [Nome da Feature]

**Arquivo:** `tests/Feature/[Feature]/[FeatureName]Test.php`

```php
<?php

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('[Nome da Feature]', function () {
    
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    });
    
    it('deve [comportamento] quando [ação do usuário]', function () {
        // Arrange
        $payload = [
            'campo1' => 'valor1',
            'campo2' => 'valor2',
        ];
        
        // Act
        $response = $this->postJson('/api/endpoint', $payload);
        
        // Assert
        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'campo1',
                    'campo2',
                    'created_at',
                ],
            ]);
    });
    
    it('deve validar campos obrigatórios', function () {
        // Arrange
        $invalidPayload = [];
        
        // Act
        $response = $this->postJson('/api/endpoint', $invalidPayload);
        
        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['campo1', 'campo2']);
    });
    
    it('deve [comportamento] quando não autenticado', function () {
        // Arrange
        auth()->logout();
        
        // Act
        $response = $this->postJson('/api/endpoint', []);
        
        // Assert
        $response->assertStatus(401);
    });
});
```

**Cenários de Teste:**

| # | Cenário | Método | Endpoint | Status Esperado | Status |
|---|---------|--------|----------|-----------------|--------|
| 1 | Criar com sucesso | POST | `/api/resource` | 201 | ⏳ |
| 2 | Validação de campos | POST | `/api/resource` | 422 | ⏳ |
| 3 | Não autenticado | POST | `/api/resource` | 401 | ⏳ |
| 4 | Listar recursos | GET | `/api/resource` | 200 | ⏳ |
| 5 | Atualizar recurso | PUT | `/api/resource/{id}` | 200 | ⏳ |
| 6 | Deletar recurso | DELETE | `/api/resource/{id}` | 204 | ⏳ |

---

### 3. Testes de Integração (Serviços Externos)

#### 3.1 Integração com [Nome do Serviço] (ex: Stripe)

**Arquivo:** `tests/Integration/[Service]/[ServiceName]IntegrationTest.php`

```php
<?php

use Tests\TestCase;
use App\Services\[ServiceName]Service;
use Illuminate\Support\Facades\Http;

describe('[ServiceName] Integration', function () {
    
    it('deve criar [recurso] no [serviço externo] com sucesso', function () {
        // Arrange
        Http::fake([
            'api.external-service.com/*' => Http::response([
                'id' => 'ext_123',
                'status' => 'success',
            ], 201),
        ]);
        
        $service = app([ServiceName]Service::class);
        $data = ['campo' => 'valor'];
        
        // Act
        $result = $service->create($data);
        
        // Assert
        expect($result)->toHaveKey('id')
            ->and($result['status'])->toBe('success');
        
        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.external-service.com/resource'
                && $request->method() === 'POST';
        });
    });
    
    it('deve tratar erro de API externa', function () {
        // Arrange
        Http::fake([
            'api.external-service.com/*' => Http::response([
                'error' => 'Invalid request',
            ], 400),
        ]);
        
        $service = app([ServiceName]Service::class);
        
        // Act & Assert
        expect(fn() => $service->create([]))
            ->toThrow([ExceptionClass]::class);
    });
    
    it('deve fazer retry em caso de timeout', function () {
        // Teste de resiliência
    });
});
```

**Cenários de Integração:**

| # | Cenário | Serviço | Ação | Resultado Esperado | Status |
|---|---------|---------|------|-------------------|--------|
| 1 | Criar recurso | Stripe | POST /customers | Customer criado | ⏳ |
| 2 | Erro de API | Stripe | POST /customers | Exception tratada | ⏳ |
| 3 | Timeout | Stripe | POST /customers | Retry executado | ⏳ |
| 4 | Webhook recebido | Stripe | POST /webhook | Evento processado | ⏳ |

---

### 4. Testes de Contrato (Contract Tests)

#### 4.1 Contrato com [API Externa]

**Arquivo:** `tests/Contract/[Service]/[ServiceName]ContractTest.php`

> **Objetivo:** Garantir que o contrato com a API externa não quebre

```php
<?php

use Tests\TestCase;
use App\Services\[ServiceName]Service;

describe('[ServiceName] Contract', function () {
    
    it('deve respeitar o contrato de criação', function () {
        // Valida que a estrutura de dados enviada está correta
        // Valida que a resposta esperada está sendo tratada corretamente
    });
    
    it('deve validar schema de resposta', function () {
        // Valida que o schema da resposta não mudou
    });
});
```

---

## Mocks e Stubs

### Mocks Necessários

| Mock | Classe | Uso |
|------|--------|-----|
| `[ServiceName]Client` | `App\Clients\[ServiceName]Client` | Simular chamadas externas |
| `EventDispatcher` | `Illuminate\Events\Dispatcher` | Simular eventos |
| `Queue` | `Illuminate\Queue\QueueManager` | Simular jobs |

### Exemplo de Mock

```php
use Mockery;
use App\Services\ExternalService;

$mockService = Mockery::mock(ExternalService::class);
$mockService->shouldReceive('method')
    ->once()
    ->with($expectedArgs)
    ->andReturn($expectedResult);

app()->instance(ExternalService::class, $mockService);
```

---

## Dados de Teste (Factories)

### Factories Necessárias

| Factory | Model | Campos Principais |
|---------|-------|-------------------|
| `UserFactory` | `User` | name, email, password |
| `[Model]Factory` | `[Model]` | [campos] |

### Seeds de Teste

```php
// database/seeders/TestSeeder.php
public function run()
{
    User::factory()->count(10)->create();
    [Model]::factory()->count(5)->create();
}
```

---

## Ordem de Implementação (TDD)

### Sprint 1: Testes Básicos

- [ ] **RED:** Teste de criação básica (falha)
- [ ] **GREEN:** Implementação mínima (passa)
- [ ] **REFACTOR:** Melhorar código

### Sprint 2: Validações

- [ ] **RED:** Teste de validação (falha)
- [ ] **GREEN:** Implementar validação (passa)
- [ ] **REFACTOR:** Extrair regras de validação

### Sprint 3: Integração Externa

- [ ] **RED:** Teste de integração (falha)
- [ ] **GREEN:** Implementar integração (passa)
- [ ] **REFACTOR:** Extrair cliente HTTP

### Sprint 4: Edge Cases

- [ ] **RED:** Testes de borda (falham)
- [ ] **GREEN:** Implementar tratamento (passam)
- [ ] **REFACTOR:** Melhorar tratamento de erros

---

## Checklist de Implementação

### Antes de Começar

- [ ] PRD revisado e aprovado
- [ ] BDD especificado (se aplicável)
- [ ] Ambiente de testes configurado
- [ ] Factories criadas
- [ ] Mocks definidos

### Durante o Desenvolvimento

- [ ] Teste escrito ANTES da implementação (RED)
- [ ] Implementação mínima para passar (GREEN)
- [ ] Refatoração após testes passando (REFACTOR)
- [ ] Coverage mínimo de 80%

### Antes de Finalizar

- [ ] Todos os testes passando
- [ ] Coverage report gerado
- [ ] Testes de integração validados
- [ ] Documentação atualizada

---

## Métricas de Qualidade

| Métrica | Target | Atual |
|---------|--------|-------|
| Coverage | ≥ 80% | ⏳ |
| Testes Unitários | ≥ 10 | ⏳ |
| Testes de Feature | ≥ 5 | ⏳ |
| Testes de Integração | ≥ 3 | ⏳ |

---

## Comandos Úteis

```bash
# Executar todos os testes
php artisan test

# Executar testes específicos
php artisan test --filter=[NomeDoTeste]

# Executar com coverage
php artisan test --coverage

# Executar testes em paralelo
php artisan test --parallel

# Executar apenas testes unitários
php artisan test tests/Unit

# Executar apenas testes de feature
php artisan test tests/Feature
```

---

## Notas de Implementação

### Decisões Técnicas

- [Decisão 1 e razão]
- [Decisão 2 e razão]

### Dependências de Teste

- [Dependência 1]
- [Dependência 2]

### Configurações Necessárias

```env
# .env.testing
EXTERNAL_API_URL=https://api.test.example.com
EXTERNAL_API_KEY=test_key
```

---

## Referências

- PRD: [Link para PRD]
- BDD: [Link para BDD]
- Documentação da API Externa: [Link]
- PestPHP Docs: https://pestphp.com/docs
