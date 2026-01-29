# Exception Handling

Padrões obrigatórios para tratamento de exceptions no Laravel.

## Tipos de Exceptions no Laravel

**Exceptions Nativas:**
- `ValidationException` - Erros de validação
- `ModelNotFoundException` - Model não encontrado
- `HttpException` - Exceções HTTP (404, 403, 500, etc.)
- `AuthenticationException` - Falha de autenticação
- `AuthorizationException` - Falha de autorização
- `QueryException` - Erros de banco de dados

## Quando Criar Exception Customizada

✅ **Crie quando:**
- Há erro específico de negócio que precisa tratamento especial
- Precisa de mensagens de erro personalizadas
- Precisa de código de erro específico
- Precisa de metadados adicionais
- Precisa de lógica de renderização customizada

❌ **NÃO crie quando:**
- Pode usar exception nativa do Laravel
- Erro é genérico e não precisa tratamento especial

## BusinessException - Template

```php
<?php
declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessException extends Exception
{
    protected string $errorCode;
    protected array $meta;

    public function __construct(
        string $message = '',
        string $errorCode = 'business_error',
        array $meta = [],
        int $code = 400,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errorCode = $errorCode;
        $this->meta = $meta;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    public function getMeta(): array
    {
        return $this->meta;
    }

    public function context(): array
    {
        return [
            'error_code' => $this->errorCode,
            'meta' => $this->meta,
            'user_id' => auth()->id(),
        ];
    }

    public function render(Request $request): JsonResponse|Response
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => $this->getMessage(),
                'code' => $this->errorCode,
                'meta' => $this->meta,
            ], $this->getCode());
        }

        return redirect()->back()
            ->withErrors(['error' => $this->getMessage()]);
    }

    public function shouldReport(): bool
    {
        return false; // Business exceptions geralmente não precisam ser reportadas
    }
}
```

## Uso no Service

```php
throw new BusinessException(
    'Recurso indisponível para este provedor',
    'unavailable_slot',
    ['resource_id' => $resourceId, 'slot' => $slot],
    409
);
```

## Tratamento no Controller

```php
try {
    $order = $this->service->create($request->validated());
    return redirect()->route('orders.index');
} catch (ValidationException $e) {
    return $this->validationError($e->errors());
} catch (BusinessException $e) {
    return $this->businessError(
        $e->getMessage(),
        $e->getErrorCode(),
        $e->getMeta(),
        $e->getCode()
    );
} catch (\Exception $e) {
    return $this->serverError($e);
}
```

## Exception Handler (Laravel 11+)

```php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (BusinessException $e) {
        Log::warning('Business exception', [
            'error_code' => $e->getErrorCode(),
            'meta' => $e->getMeta(),
        ]);
    });

    $exceptions->dontReport([
        ValidationException::class,
        BusinessException::class,
    ]);

    $exceptions->level(PDOException::class, LogLevel::CRITICAL);
});
```

## HTTP Exceptions

```php
// 404
abort(404, 'Recurso não encontrado');

// 403
abort(403, 'Acesso negado');

// 409 Custom
throw new HttpException(409, 'Conflito: recurso já existe');
```

## Boas Práticas

1. **Use exceptions específicas** ao invés de genéricas
2. **Inclua contexto útil** (IDs, dados relevantes)
3. **Use códigos de erro consistentes** (padronize)
4. **Implemente `render()` e `report()`** quando necessário
5. **Não exponha detalhes técnicos** ao usuário
6. **Use helper `report()`** para reportar sem interromper

## Checklist

1. ✅ Esta exception já existe no Laravel? → Use a nativa
2. ✅ Precisa de tratamento especial? → Crie customizada
3. ✅ Incluí contexto suficiente? → IDs, dados relevantes
4. ✅ Usei código de erro consistente? → Padronize códigos
5. ✅ Implementei `render()` se necessário? → Para respostas customizadas
6. ✅ Implementei `shouldReport()`? → Controlar logging
7. ✅ Mensagem é amigável ao usuário? → Não exponha detalhes técnicos
