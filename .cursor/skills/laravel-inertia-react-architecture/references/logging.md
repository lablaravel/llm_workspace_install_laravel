# Padrões de Logging

Siga RFC 5424 para níveis de log e sempre inclua contexto estruturado.

## Níveis de Log (RFC 5424)

Use os níveis em ordem de severidade:

1. **`emergency`** - Sistema inutilizável
2. **`alert`** - Ação deve ser tomada imediatamente
3. **`critical`** - Condições críticas
4. **`error`** - Condições de erro
5. **`warning`** - Condições de aviso
6. **`notice`** - Condições normais, mas significativas
7. **`info`** - Mensagens informativas
8. **`debug`** - Mensagens de debug detalhadas

## Quando Usar Cada Nível

### `emergency` - Sistema completamente inoperante

```php
Log::emergency('Banco de dados inacessível - Sistema offline');
```

### `alert` - Ação imediata necessária

```php
Log::alert('Múltiplas tentativas de login falhadas', [
    'ip' => $request->ip(),
    'user' => $username,
    'attempts' => 5
]);
```

### `critical` - Erro crítico que afeta funcionalidade

```php
Log::critical('Falha ao processar webhook externo', [
    'webhook_id' => $webhookId,
    'error' => $exception->getMessage()
]);
```

### `error` - Erro que impede operação específica

```php
try {
    $order = $this->service->create($data);
} catch (\Exception $e) {
    Log::error('Falha ao criar registro', [
        'data' => $data,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    throw $e;
}
```

### `warning` - Situação anormal, mas não crítica

```php
if ($order->processed_at < now()) {
    Log::warning('Registro criado no passado', [
        'order_id' => $order->id,
        'processed_at' => $order->processed_at
    ]);
}
```

### `notice` - Eventos normais, mas importantes

```php
Log::notice('Usuário alterou senha', ['user_id' => $user->id]);
Log::notice('Registro confirmado', ['order_id' => $order->id]);
```

### `info` - Informações gerais sobre operação

```php
Log::info('Registro criado com sucesso', [
    'order_id' => $order->id,
    'resource_id' => $order->resource_id,
    'user_id' => auth()->id()
]);
```

### `debug` - Informações detalhadas para debug

```php
Log::debug('Query executada', [
    'sql' => $query->toSql(),
    'bindings' => $query->getBindings(),
    'time' => $query->getQueryLog()
]);
```

## Contexto Estruturado

**SEMPRE** inclua contexto relevante:

```php
// ❌ ERRADO: Log sem contexto
Log::error('Erro ao criar registro');

// ✅ CORRETO: Log com contexto estruturado
Log::error('Erro ao criar registro', [
    'user_id' => auth()->id(),
    'resource_id' => $data['resource_id'],
    'processed_at' => $data['processed_at'],
    'error' => $exception->getMessage(),
    'trace_id' => Str::uuid()->toString()
]);
```

## Padrão de Contexto Recomendado

```php
Log::info('Operação realizada', [
    // Identificadores
    'user_id' => auth()->id(),
    'request_id' => request()->header('X-Request-ID'),
    'trace_id' => $traceId,
    
    // Dados da operação
    'action' => 'order.created',
    'resource_id' => $order->id,
    'resource_type' => 'Order',
    
    // Metadados
    'ip' => request()->ip(),
    'user_agent' => request()->userAgent(),
    'timestamp' => now()->toIso8601String(),
]);
```

## Logging em Diferentes Contextos

### Services

```php
class OrderService
{
    public function create(array $data): Order
    {
        Log::info('Iniciando criação de registro', [
            'resource_id' => $data['resource_id'],
            'user_id' => auth()->id()
        ]);
        
        try {
            $order = Order::create($data);
            
            Log::info('Registro criado com sucesso', [
                'order_id' => $order->id
            ]);
            
            return $order;
        } catch (\Exception $e) {
            Log::error('Falha ao criar registro', [
                'data' => $data,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
}
```

### Exception Handlers

```php
public function report(\Throwable $e): void
{
    if ($this->shouldReport($e)) {
        Log::error('Exception não tratada', [
            'exception' => get_class($e),
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
            'request_id' => request()->header('X-Request-ID'),
            'user_id' => auth()->id(),
        ]);
    }
}
```

## Canais de Log

Use canais diferentes para diferentes tipos:

```php
// config/logging.php
'channels' => [
    'security' => [
        'driver' => 'daily',
        'path' => storage_path('logs/security.log'),
        'level' => 'warning',
    ],
    
    'audit' => [
        'driver' => 'daily',
        'path' => storage_path('logs/audit.log'),
        'level' => 'info',
    ],
];

// Uso
Log::channel('security')->warning('Tentativa de acesso não autorizado', [
    'ip' => $request->ip(),
    'user' => $username
]);
```

## Boas Práticas

1. **NUNCA logue dados sensíveis** (senhas, cartões, tokens)
2. **Use trace_id** para rastreamento de operações
3. **Logue em pontos estratégicos** (entrada/saída de métodos importantes)
4. **Use formatação consistente** para facilitar parsing
5. **Configure níveis por ambiente** (debug em dev, info em prod)

## Checklist

Antes de adicionar um log:
1. ✅ Qual nível de log é apropriado? → Use RFC 5424
2. ✅ Incluí contexto suficiente? → IDs, timestamps, dados relevantes
3. ✅ Não estou logando dados sensíveis? → Senhas, cartões, tokens
4. ✅ O log é útil para debug/produção? → Evite logs desnecessários
5. ✅ Usei o canal correto? → security, audit, default
6. ✅ O log tem trace_id? → Para rastreamento em produção
