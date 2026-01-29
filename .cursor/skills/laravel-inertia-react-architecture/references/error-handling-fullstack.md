# Error Pattern: Laravel + Inertia + React

Padrão completo de tratamento de erros alinhado com a arquitetura.

## Contrato de Erros

**Backend (Laravel):**
- `422`: Validação - `{ errors: Record<string, string[]>, message, code: 'validation_error' }`
- `400/409`: Negócio - `{ message, code, meta: any }` - Via BusinessException
- `401`: Autenticação - `{ message, code: 'unauthenticated' }`
- `500`: Servidor - `{ message: 'Internal server error', code: 'server_error', trace_id }`

## Backend - Form Request

```php
<?php
declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ou lógica de autorização via Policy
    }

    public function rules(): array
    {
        return [
            'resource_id' => 'required|integer|exists:resources,id',
            'slot' => 'required|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'resource_id.required' => __('validation.resource_id.required'),
            'slot.required' => __('validation.slot.required'),
        ];
    }
}
```

## Backend - Service

```php
<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Exceptions\BusinessException;

class OrderService
{
    public function create(array $data): Order
    {
        $this->slotAvailable($data['resource_id'], $data['slot']);

        return DB::transaction(function () use ($data) {
            $order = Order::create($data);
            event(new OrderCreated($order));
            return $order;
        });
    }

    private function slotAvailable(int $resourceId, string $slot): bool
    {
        $conflicts = Order::where('resource_id', $resourceId)
            ->where('slot', $slot)
            ->exists();

        if ($conflicts) {
            throw new BusinessException(
                'Recurso indisponível para este provedor',
                'unavailable_slot',
                ['resource_id' => $resourceId, 'slot' => $slot],
                409
            );
        }

        return true;
    }
}
```

## Backend - Controller

```php
<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreateOrderRequest;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly OrderService $service) {}

    public function store(CreateOrderRequest $request): JsonResponse|RedirectResponse
    {
        try {
            $order = $this->service->create($request->validated());

            if ($request->wantsJson()) {
                return $this->success(['order' => $order], 201);
            }

            return redirect()->route('orders.index')
                ->with('success', 'Registro criado com sucesso');
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
    }
}
```

## Frontend - Error Handler

```ts
import { router } from '@inertiajs/react';

type ServerError = {
    message?: string;
    code?: string;
    meta?: Record<string, any>;
    errors?: Record<string, string[]>;
    trace_id?: string;
};

export function handleServerError(e: unknown, form?: any): void {
    const res = (e as any)?.response;
    if (!res) {
        showToast('Erro de rede. Verifique sua conexão.');
        return;
    }

    const status = res.status;
    const data: ServerError = res.data || {};

    switch (status) {
        case 422: // Validação
            if (form && data.errors) {
                form.setErrors(data.errors);
            } else {
                showBanner(data.message || 'Falha na validação', data.errors);
            }
            break;
        case 401: // Não autenticado
            showToast(data.message || 'Faça login para continuar');
            router.visit('/login');
            break;
        case 400:
        case 409: // Erro de negócio
            showBanner(data.message || 'Erro nos dados informados', data.meta);
            break;
        case 500: // Erro de servidor
            const trace = data.trace_id ? ` (ref: ${data.trace_id})` : '';
            showBanner(`Erro interno. Tente novamente ou contate suporte.${trace}`);
            logToAnalytics({ trace_id: data.trace_id, code: data.code });
            break;
        default:
            showBanner(data.message || 'Erro inesperado');
    }
}
```

## Frontend - Hook Inertia Seguro

```ts
import { useForm as useInertiaForm } from '@inertiajs/react';
import { handleServerError } from '../utils/errorHandler';

export function useInertiaForm<T = Record<string, any>>(initial: T = {} as T) {
    const form = useInertiaForm<T>(initial);

    const safePost = async (url: string, options: any = {}): Promise<void> => {
        try {
            await form.post(url, options);
        } catch (e) {
            handleServerError(e, form);
        }
    };

    return { ...form, safePost };
}
```

## Frontend - ErrorBoundary

```tsx
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    message?: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Erro não capturado:', error, errorInfo);
        // Opcional: dispatch event para backend logging
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded">
                    <h2>Algo deu errado.</h2>
                    <p>Recarregue a página ou contate o suporte.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
```

## Boas Práticas

- **Backend**: Sempre use Form Requests (sem validação inline), injete Services via construtor, retorne Inertia::render() para views. Use ApiResponse trait para consistência (trace_id em 500, meta em business errors).
- **Tratamento de Erros**: 422 para validação (com `errors` por campo), 400/409 para negócio (com `meta`), 401 para auth, 500 com `trace_id` (log sem stack trace exposta).
- **Frontend**: Centralize em `handleServerError`, use `form.setErrors()` para 422, redirecione 401 para login, mostre banners com `meta` para negócio, logue 500 com `trace_id` para suporte.
- **UX/Segurança**: Mensagens amigáveis (i18n via Laravel), trace_id para suporte (sem expor detalhes técnicos).
