# Laravel Data - Data Transfer Objects (DTOs)

Referência completa para uso do pacote `spatie/laravel-data` no projeto.

## Instalação

```bash
composer require spatie/laravel-data
```

## Conceito

Laravel Data permite criar **Data Transfer Objects (DTOs)** tipados que:

- Descrevem a **estrutura e significado** dos dados (não apenas a estrutura como arrays)
- Fornecem **validação automática** baseada em type hints
- Geram **tipos TypeScript** automaticamente para o frontend
- Oferecem **autocomplete completo** na IDE
- Permitem **análise estática** com PHPStan

## Criando Data Objects

### Estrutura Básica

```php
<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

class CreateUserData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public UserStatus $status, // Backed Enum
    ) {}
}
```

### Com Validação Customizada

```php
<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Email;
use Spatie\LaravelData\Attributes\Validation\Min;

class CreateUserData extends Data
{
    public function __construct(
        #[Min(3)]
        public string $name,
        
        #[Email]
        public string $email,
        
        public UserStatus $status,
    ) {}
}
```

## Conversão de Request para Data

### No Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Data\CreateUserData;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function store(CreateUserRequest $request): JsonResponse
    {
        $data = CreateUserData::from($request);
        
        $user = $this->userService->createUser($data);
        
        return response()->json($user);
    }
}
```

### Com Form Request

O `FormRequest` continua sendo usado para validação HTTP. O DTO encapsula os dados validados:

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

## Uso em Services

### Service Recebendo DTO

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Data\CreateUserData;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function createUser(CreateUserData $data): User
    {
        return DB::transaction(function () use ($data) {
            Log::info('Creating user', [
                'email' => $data->email,
                'status' => $data->status->value,
            ]);

            return User::create([
                'name' => $data->name,
                'email' => $data->email,
                'status' => $data->status,
            ]);
        });
    }
}
```

## Integração com Enums

Use Backed Enums (PHP 8.1+) para valores de domínio fixos:

```php
<?php

declare(strict_types=1);

namespace App\Enums;

enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case SUSPENDED = 'suspended';
}
```

```php
// No DTO
public function __construct(
    public string $name,
    public string $email,
    public UserStatus $status, // Enum tipado
) {}
```

## Geração de TypeScript

Laravel Data pode gerar tipos TypeScript automaticamente para uso no frontend React/Inertia:

```bash
php artisan data:typescript
```

Isso gera tipos TypeScript baseados nos Data Objects, permitindo type-safety completo no frontend.

## Lazy Properties

Para otimização de performance, use lazy properties quando o cálculo for custoso:

```php
<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public Lazy|string $fullProfile, // Calculado sob demanda
    ) {}
}
```

## Conversão de Models para Data

```php
// Converter Model para Data
$userData = UserData::from($user);

// Converter Collection para array de Data
$usersData = UserData::collection($users);
```

## Padrões de Uso

### Antes (Anti-pattern)

```php
// Controller
$service->createUser($request->validated());

// Service
public function createUser(array $data): User {
    // Sem type safety, sem autocomplete
    return User::create([
        'name' => $data['name'], // Erro de digitação só aparece em runtime
        'email' => $data['email'],
        'status' => $data['status'],
    ]);
}
```

### Depois (Com Laravel Data)

```php
// Controller
$data = CreateUserData::from($request);
$service->createUser($data);

// Service
public function createUser(CreateUserData $data): User {
    // Type safety completo, autocomplete funcionando
    return User::create([
        'name' => $data->name, // IDE detecta erros
        'email' => $data->email,
        'status' => $data->status,
    ]);
}
```

## Vantagens

1. **Type Safety**: Erros detectados em tempo de desenvolvimento
2. **Autocomplete**: IDE sugere propriedades disponíveis
3. **Documentação**: A classe documenta a estrutura dos dados
4. **Validação**: Validação automática baseada em type hints
5. **TypeScript**: Geração automática de tipos para frontend
6. **Análise Estática**: PHPStan pode analisar o código
7. **Refatoração**: Mudanças propagadas automaticamente

## Quando Usar

✅ **Use DTOs quando:**
- Transferir dados entre camadas (Controller → Service)
- Mais de 3 campos
- Dados que representam um conceito de domínio
- Precisa de type safety e autocomplete

❌ **Não use DTOs quando:**
- Dados simples com 1-3 campos (arrays são aceitáveis)
- Dados temporários dentro de um único método
- Overhead não compensa o benefício

## Referências

- [Documentação Oficial](https://spatie.be/docs/laravel-data)
- [GitHub Repository](https://github.com/spatie/laravel-data)
