# Eloquent Patterns - Queries, Cache e Performance

NUNCA use Repository Pattern. Use Eloquent direto com Scopes, Eager Loading e Cache.

## Eloquent Direto (SEMPRE)

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

## Eager Loading (Evitar N+1)

```php
// ❌ ERRADO: N+1 Problem
$orders = Order::all();
foreach ($orders as $order) {
    echo $order->customer->name; // Query adicional para cada order
}

// ✅ CORRETO: Eager Loading
$orders = Order::with('customer')->get();
foreach ($orders as $order) {
    echo $order->customer->name; // Sem queries adicionais
}

// ✅ Múltiplos relacionamentos
$orders = Order::with(['customer', 'resource', 'service'])->get();

// ✅ Eager Loading aninhado
$orders = Order::with('customer.address')->get();

// ✅ Eager Loading condicional
$orders = Order::with(['customer' => function ($query) {
    $query->where('active', true);
}])->get();
```

## Cache

```php
// ✅ CORRETO: Cache simples
public function getCategories(): Collection
{
    return Cache::remember('categories', now()->addHours(24), function () {
        return Category::where('active', true)->orderBy('name')->get();
    });
}

// ✅ CORRETO: Cache com tags (Redis)
public function getUserResources(User $user): Collection
{
    $cacheKey = "user_resources_{$user->id}";
    
    return Cache::tags(['users', "user_{$user->id}"])
        ->remember($cacheKey, now()->addHours(24), function () use ($user) {
            return $user->resources()->get();
        });
}

// ✅ CORRETO: Invalidar cache quando necessário
public function updateCategory(Category $category, array $data): Category
{
    $category->update($data);
    Cache::forget('categories');
    Cache::tags(['categories'])->flush();
    return $category->fresh();
}
```

## Otimização de Queries

### 1. Use select() para buscar apenas colunas necessárias

```php
// ❌ ERRADO: Busca todas as colunas
$users = User::all(); // SELECT * FROM users

// ✅ CORRETO: Busca apenas colunas necessárias
$users = User::select('id', 'name', 'email')->get();
```

### 2. Use índices no banco de dados

```php
// Migration: Criar índices
Schema::table('orders', function (Blueprint $table) {
    $table->index('resource_id');
    $table->index('processed_at');
    $table->index(['resource_id', 'processed_at']); // Índice composto
});
```

### 3. Use paginação para grandes conjuntos

```php
// ❌ ERRADO: Buscar todos os registros
$orders = Order::all(); // Pode ser milhares

// ✅ CORRETO: Paginação
$orders = Order::paginate(15);
$orders = Order::simplePaginate(15); // Mais rápido, sem count
```

### 4. Use chunk() para processar grandes volumes

```php
// ✅ CORRETO: Processar em lotes
Order::where('status', 'pending')
    ->chunk(100, function ($orders) {
        foreach ($orders as $order) {
            // Processar
        }
    });
```

### 5. Use exists() ao invés de count()

```php
// ❌ ERRADO: Conta todos os registros
if (Order::where('resource_id', $id)->count() > 0) {
    // ...
}

// ✅ CORRETO: Verifica apenas existência
if (Order::where('resource_id', $id)->exists()) {
    // ...
}
```

## Checklist de Otimização

1. ✅ Preciso de todas as colunas? → Use `select()`
2. ✅ Vou acessar relacionamentos? → Use `with()`
3. ✅ São muitos registros? → Use `paginate()` ou `chunk()`
4. ✅ Dados mudam raramente? → Use `Cache::remember()`
5. ✅ Preciso apenas verificar existência? → Use `exists()`
6. ✅ Há índices nas colunas consultadas? → Crie índices
7. ✅ Query é executada frequentemente? → Considere cache
