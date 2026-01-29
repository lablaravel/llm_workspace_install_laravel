# Events & Listeners - Event-Driven Architecture

Padrões para implementar eventos e listeners em Laravel seguindo a arquitetura da skill.

## Princípios Fundamentais

1. **Listeners são "Thin"** (assim como Controllers) - apenas orquestram
2. **Lógica de negócio fica no Service** - Listener delega para Service
3. **Sempre usar `DB::afterCommit()`** para disparar eventos após transações
4. **Queued listeners DEVEM ser idempotentes** - podem ser executados múltiplas vezes

## Quando Usar Eventos

✅ **Use eventos para:**
- Notificações (email, SMS, push)
- Integrações externas (webhooks, APIs)
- Analytics e auditoria
- Broadcasting para frontend (real-time)
- Ações assíncronas que não bloqueiam o fluxo principal

❌ **NÃO use eventos para:**
- Lógica de negócio crítica que precisa de resposta síncrona
- Validações que afetam o resultado da operação
- Operações que precisam de rollback em caso de falha

## Padrão DB::afterCommit()

```php
<?php
declare(strict_types=1);

DB::transaction(function () use ($payload) {
    $order = Order::create($payload);
    
    // Evento disparado SOMENTE após commit bem-sucedido
    DB::afterCommit(function () use ($order) {
        event(new OrderPlaced($order, Str::uuid()->toString()));
    });
    
    return $order;
});
```

**Por que usar `afterCommit`:**
- Evita notificar sistemas externos sobre dados que podem não existir (rollback)
- Garante consistência entre banco de dados e eventos disparados
- Previne race conditions em listeners que consultam o banco

## Idempotência em Queued Listeners

```php
<?php
declare(strict_types=1);

public function handle(OrderPlaced $event): void
{
    $key = "inventory:reserved:{$event->order->id}";
    
    // Cache::add() retorna false se chave já existe
    if (Cache::add($key, true, now()->addHour())) {
        $this->inventoryService->reserve($event->order);
    }
}
```

**Estratégias de idempotência:**
- `Cache::add()` para operações únicas
- Verificar estado atual antes de executar
- Usar `trace_id` para deduplicação
- Armazenar hash do payload processado

## Estrutura Padrão de Queued Listener

```php
<?php
declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Services\InventoryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class ReserveInventory implements ShouldQueue
{
    public int $tries = 5;
    public array $backoff = [30, 60, 120];

    public function __construct(
        private readonly InventoryService $inventoryService
    ) {}

    /**
     * Handle the event.
     * Listener é THIN - delega lógica para Service
     */
    public function handle(OrderPlaced $event): void
    {
        $this->inventoryService->reserveForOrder($event->order);
    }

    /**
     * Handle a job failure.
     */
    public function failed(OrderPlaced $event, Throwable $e): void
    {
        Log::critical('Falha ao reservar inventário', [
            'order_id' => $event->order->id,
            'error' => $e->getMessage(),
            'trace_id' => $event->traceId ?? Str::uuid()->toString(),
        ]);
        
        // Notificar equipe de suporte se necessário
    }
}
```

## Estrutura Padrão de Event

```php
<?php
declare(strict_types=1);

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Order $order,
        public readonly string $traceId
    ) {}
}
```

## Domain Events vs Integration Events

| Tipo              | Scope                     | Payload                | Exemplo               |
|-------------------|---------------------------|------------------------|-----------------------|
| Domain Event      | Interno (bounded context) | Objetos ricos (Models) | `OrderPlaced($order)` |
| Integration Event | Externo (microservices)   | JSON versionado        | `order.placed.v1`     |

**Domain Events:**
- Usados dentro da aplicação Laravel
- Payload pode conter Models Eloquent
- Serialização automática via `SerializesModels`

**Integration Events:**
- Usados para comunicação entre sistemas
- Payload deve ser JSON versionado e documentado
- Considere usar message brokers (RabbitMQ, AWS SQS)

## Anti-Patterns (PROIBIDO)

| Anti-Pattern | Problema | Solução |
|--------------|----------|---------|
| Disparar eventos em Model constructors | Eventos antes de persistência | Usar Services para disparar eventos |
| Listeners com lógica de negócio | Viola princípio "Thin Listener" | Delegar para Services |
| Eventos antes de DB commit | Race conditions, dados inconsistentes | Usar `DB::afterCommit()` |
| Listeners que chamam serviço de origem | Recria acoplamento circular | Criar Service dedicado |
| Depender de ordem entre listeners | Eventos não são pipeline | Usar Sagas/Orchestration se precisar ordem |
| Listeners síncronos pesados | Bloqueiam resposta ao usuário | Usar `ShouldQueue` |

## Registro de Events e Listeners

```php
<?php
declare(strict_types=1);

// app/Providers/EventServiceProvider.php
namespace App\Providers;

use App\Events\OrderPlaced;
use App\Listeners\ReserveInventory;
use App\Listeners\SendOrderConfirmation;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        OrderPlaced::class => [
            ReserveInventory::class,
            SendOrderConfirmation::class,
        ],
    ];
}
```

## Testando Events e Listeners

```php
<?php
declare(strict_types=1);

use App\Events\OrderPlaced;
use App\Listeners\ReserveInventory;
use Illuminate\Support\Facades\Event;

// Fake para verificar se evento foi disparado
Event::fake([OrderPlaced::class]);

// ... código que dispara evento ...

Event::assertDispatched(OrderPlaced::class, function ($event) use ($order) {
    return $event->order->id === $order->id;
});

// Testar listener diretamente
$listener = app(ReserveInventory::class);
$listener->handle(new OrderPlaced($order, 'test-trace-id'));
```
