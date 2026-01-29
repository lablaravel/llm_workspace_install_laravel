# Service Layer - Fat Services

Services devem ser **Fat** (gordos) - contêm toda a lógica de negócio.

## Template Base

```php
<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\Example;
use Illuminate\Support\Facades\DB;

class ExampleService
{
    /**
     * Cria um novo exemplo com validações de negócio
     * 
     * @param array<string, mixed> $data
     * @return Example
     * @throws \Exception
     */
    public function create(array $data): Example
    {
        // Validações de negócio (além da validação de formulário)
        $this->validateBusinessRules($data);
        
        // Processamento de dados
        $processedData = $this->processData($data);
        
        // Transação para garantir integridade
        return DB::transaction(function () use ($processedData) {
            $example = Example::create($processedData);
            
            // Evento APÓS commit para evitar inconsistência
            DB::afterCommit(fn() => event(new ExampleCreated($example)));
            
            return $example;
        });
    }

    /**
     * Valida regras de negócio específicas
     */
    private function validateBusinessRules(array $data): void
    {
        // Lógica de validação de negócio aqui
    }

    /**
     * Processa e transforma dados antes de salvar
     */
    private function processData(array $data): array
    {
        // Transformações necessárias
        return $data;
    }
}
```

## Regras SEMPRE Aplicadas

1. ✅ SEMPRE use Eloquent direto (NUNCA use Repository Pattern)
2. ✅ SEMPRE use type hints explícitos
3. ✅ SEMPRE documente métodos com PHPDoc
4. ✅ SEMPRE injete dependências via construtor quando necessário
5. ✅ SEMPRE retorne tipos específicos (não `mixed`)
6. ✅ SEMPRE use transações para operações que modificam múltiplos registros
7. ✅ SEMPRE centralize lógica de negócio no Service (não no Controller)
8. ✅ Use métodos privados para lógica interna do Service

## Quando Criar um Service?

✅ **Crie Service quando:**
- Há lógica de negócio complexa (> 2 regras de negócio)
- Há múltiplas validações de negócio (além da validação de formulário)
- Há integração com APIs externas
- Há processamento de dados complexo
- Há necessidade de reutilização da lógica
- Há transações de banco complexas

❌ **NÃO crie Service quando:**
- É apenas CRUD simples (listar, mostrar, criar básico)
- Apenas validação de formulário (use Form Request)
- Apenas redirecionamento simples
- Apenas renderização de view

## Eloquent Direto (NUNCA Repository)

```php
// ✅ CORRETO: Eloquent direto no Service
class UserService
{
    public function getActiveUsers(): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return User::query()
            ->where('active', true)
            ->with('profile')
            ->paginate(15);
    }
}

// ✅ CORRETO: Usar Scopes para queries reutilizáveis
// No Model User:
public function scopeActive($query)
{
    return $query->where('active', true);
}

// No Service:
public function getActiveUsers(): \Illuminate\Contracts\Pagination\LengthAwarePaginator
{
    return User::active()
        ->with('profile')
        ->paginate(15);
}
```

## Transações

```php
// ✅ CORRETO: Transação para múltiplas operações
public function createOrder(array $data): Order
{
    return DB::transaction(function () use ($data) {
        $order = Order::create($data);
        $order->items()->createMany($data['items']);
        
        // Evento APÓS commit para evitar inconsistência
        DB::afterCommit(fn() => event(new OrderCreated($order)));
        
        return $order;
    });
}
```

## Injeção de Dependências

```php
class OrderService
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly PaymentService $paymentService
    ) {}
    
    public function create(array $data): Order
    {
        $order = Order::create($data);
        $this->notificationService->send($order);
        return $order;
    }
}
```
