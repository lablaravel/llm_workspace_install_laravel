# Object Calisthenics

Regras para elevar legibilidade e coesão do código PHP/TypeScript.

## Propósito

Elevar a legibilidade e a coesão do código impondo restrições deliberadas que evitam "atalhos" perigosos. As regras complementam KISS, YAGNI, DRY e SOLID.

**Quando aplicar:** Durante revisões de código, criação de novas features e refactors estruturais. Use como checklist obrigatório para módulos críticos (pedidos, pagamentos, integrações externas).

## Regras Fundamentais

| # | Regra | Aplicação prática | Benefício |
|---|-------|-------------------|-----------|
| 1 | **Apenas um nível de indentação por método** | Quebre loops condicionais em métodos privados no `OrderService`, Jobs e Policies. | Funções pequenas, leitura linear. |
| 2 | **Evite `else`** | Retorne cedo em Controllers/Services (early return) ao detectar erros de validação/negócio. | Fluxo explícito, facilidade de teste. |
| 3 | **Encapsule primitivos e strings** | Use DTOs (Spatie Data) ou Value Objects para `Money`, `Phone`, `Slot`. | Mais validação e autocompletar seguro. |
| 4 | **Coleções de primeira classe** | Prefira classes que herdam de `Collection` ou métodos helpers que encapsulam filtros complexos. | Reuso de operações sobre listas. |
| 5 | **Uma chamada de ponto (`.`) por linha** | No PHP, evite cadeias longas (`$order->customer->address`). Use eager loading + métodos dedicados. | Reduz acoplamento e N+1. |
| 6 | **Sem abreviações** | Nomeie claramente (`$orderScheduleValidator` ao invés de `$asv`). | Autodocumentação e busca mais fácil. |
| 7 | **Classes pequenas** | Limite controllers a orquestração, services a regras e components React a responsabilidades únicas. | Facilita testes focados. |
| 8 | **Máximo de duas variáveis de instância** | Services devem guardar apenas dependências essenciais (ex.: outro service + cache). | Menos acoplamento e menor superfície de bugs. |
| 9 | **Sem getters/setters públicos desnecessários** | Exponha comportamentos (`$order->confirm()`) em vez de `setStatus('confirmed')`. | Mantém invariantes de negócio. |

## Exemplos Práticos

### Regra 1 + 2 – Uma indentação e sem `else`

```php
// ❌ Antes: múltiplas indentações e else encadeado
public function create(array $payload): Order
{
    if ($this->slotIsTaken($payload)) {
        if ($this->userExceededLimit($payload['customer_id'])) {
            throw new BusinessException('Limite estourado');
        } else {
            return $this->save($payload);
        }
    }

    throw new BusinessException('Recurso indisponível');
}

// ✅ Depois: early return e métodos privados curtos
public function create(array $payload): Order
{
    if ($this->slotIsTaken($payload)) {
        throw new BusinessException('Recurso indisponível');
    }

    $this->assertUserQuota($payload['customer_id']);

    return $this->persistOrder($payload);
}
```

### Regra 3 – Encapsular primitivos

```php
// ❌ Antes
public function schedule(array $data): Order
{
    if (!preg_match('/^\+\d{13}$/', $data['customer_phone'])) {
        throw new BusinessException('Telefone inválido');
    }
    // ...
}

// ✅ Depois (Value Object + DTO)
public function schedule(OrderData $data): Order
{
    $phone = CustomerPhone::fromString($data->customerPhone);

    return Order::query()->create([
        ...$data->toArray(),
        'customer_phone' => $phone->value(),
    ]);
}
```

### Regra 5 – Uma chamada por linha em React

```tsx
// ❌ Antes
const city = order?.customer?.address?.city?.name ?? '--';

// ✅ Depois
const city = getCustomerCity(order);

function getCustomerCity(order?: Order) {
    if (!order?.customer?.address) {
        return '--';
    }

    return order.customer.address.city?.name ?? '--';
}
```

## Checklist Object Calisthenics

- ✅ Método tem no máximo um nível de indentação?
- ✅ Fluxo usa early-return ao invés de `else`?
- ✅ Primitivos críticos (cpf, telefone, status) estão encapsulados?
- ✅ Coleções têm helpers dedicados?
- ✅ Há no máximo uma cadeia de `->`/`.` por linha?
- ✅ Nomes são completos e sem siglas internas?
- ✅ Classe possui ≤ 50 linhas e ≤ 2 propriedades de estado?
- ✅ Invariantes são protegidos por comportamentos, não setters?
- ✅ Há testes cobrindo os novos objetos/coleções?

Aplicar o checklist em code reviews ajuda a manter o padrão arquitetural consistente e reduz riscos de regressão em módulos sensíveis.
