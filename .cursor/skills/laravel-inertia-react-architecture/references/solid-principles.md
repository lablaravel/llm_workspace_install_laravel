# Princípios SOLID, DRY, KISS, YAGNI

Princípios fundamentais de arquitetura aplicados em todas as decisões.

## KISS (Keep It Simple, Stupid)

- ✅ Prefira soluções simples sobre complexas
- ✅ Evite over-engineering
- ✅ Use a solução mais direta que resolve o problema
- ❌ NÃO crie abstrações desnecessárias
- ❌ NÃO adicione complexidade "para o futuro"

**Exemplo:**

```php
// ✅ CORRETO: Solução simples
public function getActiveUsers(): Collection
{
    return User::where('active', true)->get();
}

// ❌ ERRADO: Over-engineering
class UserRepository implements UserRepositoryInterface
{
    public function findActiveUsers(): Collection
    {
        return $this->queryBuilder->where('active', true)->get();
    }
}
// Desnecessário - use Eloquent direto
```

## YAGNI (You Aren't Gonna Need It)

- ✅ Implemente apenas o que é necessário AGORA
- ✅ Não adicione funcionalidades "por precaução"
- ✅ Refatore quando a necessidade surgir
- ❌ NÃO crie código para casos que podem nunca acontecer
- ❌ NÃO adicione "flexibilidade" que não será usada

**Exemplo:**

```php
// ✅ CORRETO: Implementar apenas o necessário
public function create(array $data): Order
{
    return Order::create($data);
}

// ❌ ERRADO: Adicionar "flexibilidade" desnecessária
public function create(array $data, ?string $source = null, ?array $metadata = null): Order
{
    // Parâmetros que podem nunca ser usados
}
```

## DRY (Don't Repeat Yourself)

- ✅ Extraia código duplicado para métodos/funções
- ✅ Use Traits para funcionalidades compartilhadas
- ✅ Use Scopes para queries reutilizáveis
- ✅ Centralize lógica comum em Services
- ❌ NÃO copie e cole código
- ❌ NÃO duplique lógica de negócio

**Exemplo:**

```php
// ❌ ERRADO: Código duplicado
public function getPendingOrders(): Collection
{
    return Order::where('status', 'pending')
        ->where('processed_at', '>', now())
        ->get();
}

public function getPendingForResource(int $resourceId): Collection
{
    return Order::where('status', 'pending')
        ->where('processed_at', '>', now())
        ->where('resource_id', $resourceId)
        ->get();
}

// ✅ CORRETO: Usar Scope (DRY)
// No Model:
public function scopePending($query)
{
    return $query->where('status', 'pending')
        ->where('processed_at', '>', now());
}

// Uso:
Order::pending()->get();
Order::pending()->where('resource_id', $resourceId)->get();
```

## SOLID

### S - Single Responsibility Principle

- ✅ Cada classe deve ter apenas uma razão para mudar
- ✅ Controller: apenas orquestração
- ✅ Service: apenas lógica de negócio
- ✅ Model: apenas representação de dados
- ❌ NÃO misture responsabilidades

### O - Open/Closed Principle

- ✅ Classes devem estar abertas para extensão, fechadas para modificação
- ✅ Use Interfaces e Traits para extensão
- ✅ Use Events para adicionar comportamento sem modificar código existente
- ❌ NÃO modifique classes existentes para adicionar funcionalidades

### L - Liskov Substitution Principle

- ✅ Classes derivadas devem ser substituíveis por suas classes base
- ✅ Mantenha contratos de interfaces
- ❌ NÃO quebre contratos ao herdar

### I - Interface Segregation Principle

- ✅ Interfaces devem ser específicas, não genéricas
- ✅ Prefira interfaces pequenas e focadas
- ❌ NÃO force classes a implementar métodos que não usam

### D - Dependency Inversion Principle

- ✅ Dependa de abstrações, não de implementações concretas
- ✅ Use injeção de dependências via construtor
- ✅ Use Service Container do Laravel
- ❌ NÃO instancie dependências diretamente

**Exemplo SOLID:**

```php
// ✅ CORRETO: Seguindo SOLID
class OrderService
{
    public function __construct(
        private readonly NotificationServiceInterface $notificationService
    ) {}
    
    public function create(array $data): Order
    {
        // Single Responsibility: apenas criar order
        // Dependency Inversion: depende de interface
        $order = Order::create($data);
        
        // Open/Closed: pode adicionar notificações via Events sem modificar
        event(new OrderCreated($order));
        
        return $order;
    }
}
```

## Clean Code

- ✅ Código legível e auto-explicativo
- ✅ Nomes descritivos e significativos
- ✅ Funções pequenas e focadas
- ✅ Comentários apenas quando necessário
- ✅ Use PHPDoc para documentação
- ❌ NÃO use nomes genéricos (`$data`, `$temp`, `$x`)
- ❌ NÃO crie funções muito longas (> 20 linhas)
- ❌ NÃO use números mágicos (use constantes)

**Exemplo:**

```php
// ❌ ERRADO: Código não limpo
function proc($d) {
    $x = [];
    foreach($d as $i) {
        if($i['s'] == 'a' && $i['v'] > 100) {
            $x[] = $i;
        }
    }
    return $x;
}

// ✅ CORRETO: Clean Code
/**
 * Filtra usuários ativos com mais de 100 pontos
 */
public function getActiveUsersWithHighScore(array $users): array
{
    const MIN_SCORE = 100;
    const ACTIVE_STATUS = 'active';
    
    return array_filter($users, function (array $user) {
        return $user['status'] === ACTIVE_STATUS 
            && $user['score'] > MIN_SCORE;
    });
}
```

## Resumo dos Princípios

| Princípio | Foco | Aplicação |
|-----------|------|-----------|
| **KISS** | Simplicidade | Use a solução mais simples que funciona |
| **YAGNI** | Necessidade | Implemente apenas o que é necessário agora |
| **DRY** | Reutilização | Não repita código, extraia para métodos/traits |
| **SOLID** | Design | Separe responsabilidades, use abstrações |
| **Clean Code** | Legibilidade | Código claro, nomes descritivos, funções pequenas |
