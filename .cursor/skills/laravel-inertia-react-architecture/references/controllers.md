# Estrutura de Controllers

Controllers devem ser **Thin** (finos) - apenas orquestram e delegam para Services.

## Template Base

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Traits\ApiResponse; // Se for API
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExampleController extends Controller
{
    // Se for API, usar trait
    use ApiResponse;

    // Injetar Services via construtor
    public function __construct(
        private readonly ExampleService $service
    ) {}

    /**
     * Descrição do método
     */
    public function index(): Response
    {
        $data = $this->service->getAll();
        return Inertia::render('Example/Index', ['data' => $data]);
    }
}
```

## Regras SEMPRE Aplicadas

1. ✅ SEMPRE use `declare(strict_types=1);`
2. ✅ SEMPRE documente métodos com PHPDoc
3. ✅ SEMPRE use Form Requests para validação (nunca validação inline)
4. ✅ SEMPRE retorne `Inertia::render()` para views
5. ✅ SEMPRE use `ApiResponse` trait para endpoints de API
6. ✅ SEMPRE injete Services via construtor (não via método)
7. ✅ SEMPRE use type hints explícitos em métodos

## Controller Thin vs Service Fat

**❌ ERRADO: Controller com lógica de negócio**

```php
public function store(Request $request)
{
    // Validação inline (ERRADO)
    $request->validate(['name' => 'required']);
    
    // Lógica de negócio no Controller (ERRADO)
    if (Order::where('resource_id', $request->resource_id)->exists()) {
        throw new \Exception('Resource already has an order');
    }
    
    $order = Order::create($request->all());
    return redirect()->route('orders.index');
}
```

**✅ CORRETO: Controller Thin + Service Fat**

```php
public function store(CreateOrderRequest $request): Response
{
    $order = $this->orderService->create($request->validated());
    return redirect()->route('orders.index');
}
```

## Tratamento de Exceptions

```php
try {
    $order = $this->orderService->create($request->validated());
    return redirect()->route('orders.index');
} catch (ValidationException $e) {
    return $this->validationError($e->errors());
} catch (BusinessException $e) {
    return $this->businessError(
        $e->getMessage(), 
        $e->getCode(), 
        $e->getMeta()
    );
} catch (\Exception $e) {
    return $this->serverError($e);
}
```

## Retornos

- **Inertia Views**: `Inertia::render('Component/Name', ['data' => $data])`
- **API Success**: `$this->success($data, 'Message')`
- **API Error**: `$this->error('Message', 400)`
- **Redirects**: `redirect()->route('name')`
