# Data Transfer Objects (DTOs)

Guia sobre quando e como usar DTOs no projeto Laravel + Inertia + React.

## Por Que DTOs vs Arrays?

### Arrays Descrevem Estrutura

Arrays associativos apenas descrevem a **estrutura** dos dados:

```php
// O que é $data? Qual o significado de cada campo?
$data = [
    'name' => 'John',
    'email' => 'john@example.com',
    'status' => 'active',
];

// Erros de digitação só aparecem em runtime
$user = User::create([
    'name' => $data['nmae'], // Typo não detectado!
    'email' => $data['email'],
]);
```

### Objetos Descrevem Significado

DTOs descrevem a **estrutura e significado** dos dados:

```php
// A classe documenta o contrato de dados
class CreateUserData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public UserStatus $status, // Enum tipado
    ) {}
}

// Erros detectados em tempo de desenvolvimento
$data = CreateUserData::from($request);
$user = User::create([
    'name' => $data->name, // Autocomplete funciona
    'email' => $data->email,
    'status' => $data->status, // Type safety
]);
```

## Quando Usar DTOs

### ✅ Use DTOs Quando:

1. **Transferir dados entre camadas** (Controller → Service)
2. **Mais de 3 campos** (arrays são aceitáveis para dados simples)
3. **Dados representam um conceito de domínio** (ex: CreateUserData, UpdateOrderData)
4. **Precisa de type safety e autocomplete**
5. **Dados serão reutilizados** em múltiplos lugares

### ❌ Não Use DTOs Quando:

1. **Dados simples com 1-3 campos** (arrays são aceitáveis)
2. **Dados temporários** dentro de um único método
3. **Overhead não compensa** o benefício
4. **Dados são apenas para logging** ou debug

## Integração com Laravel Data

Este projeto usa `spatie/laravel-data` como implementação padrão de DTOs.

### Instalação

```bash
composer require spatie/laravel-data
```

### Referência Técnica Completa

Consulte a [referência técnica completa](../../laravel-packages/references/laravel-data.md) para:

- Criação de Data Objects
- Conversão de Request para Data
- Validação customizada
- Integração com Enums
- Geração de TypeScript
- Lazy properties
- Padrões avançados

## Exemplos Práticos

### Exemplo 1: Criar Usuário

**Antes (Anti-pattern):**

```php
// Controller
public function store(CreateUserRequest $request): JsonResponse
{
    $user = $this->userService->createUser($request->validated());
    return response()->json($user);
}

// Service
public function createUser(array $data): User
{
    // Sem type safety, sem autocomplete
    return User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'status' => $data['status'],
    ]);
}
```

**Depois (Com Laravel Data):**

```php
// DTO
class CreateUserData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public UserStatus $status,
    ) {}
}

// Controller
public function store(CreateUserRequest $request): JsonResponse
{
    $data = CreateUserData::from($request);
    $user = $this->userService->createUser($data);
    return response()->json($user);
}

// Service
public function createUser(CreateUserData $data): User
{
    // Type safety completo, autocomplete funcionando
    return User::create([
        'name' => $data->name,
        'email' => $data->email,
        'status' => $data->status,
    ]);
}
```

### Exemplo 2: Atualizar Pedido

```php
// DTO
class UpdateOrderData extends Data
{
    public function __construct(
        public int $orderId,
        public OrderStatus $status,
        public ?string $notes = null,
        public ?AddressData $shippingAddress = null,
    ) {}
}

// Controller
public function update(UpdateOrderRequest $request, Order $order): JsonResponse
{
    $data = UpdateOrderData::from($request->merge(['orderId' => $order->id]));
    $order = $this->orderService->updateOrder($data);
    return response()->json($order);
}

// Service
public function updateOrder(UpdateOrderData $data): Order
{
    return DB::transaction(function () use ($data) {
        $order = Order::findOrFail($data->orderId);
        
        $order->update([
            'status' => $data->status,
            'notes' => $data->notes,
        ]);
        
        if ($data->shippingAddress) {
            $order->shippingAddress()->update($data->shippingAddress->toArray());
        }
        
        return $order->fresh();
    });
}
```

## Integração com Form Requests

Form Requests continuam sendo usados para **validação HTTP**. DTOs encapsulam os **dados validados**:

```php
// FormRequest valida a entrada HTTP
class CreateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3'],
            'email' => ['required', 'email'],
            'status' => ['required', new Enum(UserStatus::class)],
        ];
    }
}

// Controller converte Request validado em DTO
$data = CreateUserData::from($request->validated());

// Service recebe DTO tipado
$this->userService->createUser($data);
```

## Integração com Enums

Use Backed Enums para valores de domínio fixos:

```php
enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case SUSPENDED = 'suspended';
}

// No DTO
public function __construct(
    public string $name,
    public string $email,
    public UserStatus $status, // Enum tipado
) {}
```

## Vantagens dos DTOs

1. **Type Safety**: Erros detectados em tempo de desenvolvimento
2. **Autocomplete**: IDE sugere propriedades disponíveis
3. **Documentação**: A classe documenta a estrutura dos dados
4. **Validação**: Validação automática baseada em type hints
5. **TypeScript**: Geração automática de tipos para frontend
6. **Análise Estática**: PHPStan pode analisar o código
7. **Refatoração**: Mudanças propagadas automaticamente

## Checklist

Antes de criar um DTO, verifique:

- [ ] Dados têm mais de 3 campos?
- [ ] Dados são transferidos entre camadas?
- [ ] Dados representam um conceito de domínio?
- [ ] Precisa de type safety e autocomplete?
- [ ] Dados serão reutilizados?

Se todas as respostas forem "sim", crie um DTO. Caso contrário, considere usar um array associativo.

## Referências

- [Laravel Data - Referência Técnica](../../laravel-packages/references/laravel-data.md)
- [Laravel Packages Skill](../../../laravel-packages/SKILL.md)
- [Enums vs Database](enums-vs-database.md)
