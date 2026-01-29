# Enums vs Tabelas de Banco de Dados

Decisão crítica: quando usar Enums PHP vs tabelas de referência.

## Quando Usar Enum

✅ **Use Enum quando:**
- Valores são fixos e não mudam frequentemente (ex: status, tipos, estados)
- Valores são conhecidos em tempo de compilação
- Precisa de type safety e autocomplete no IDE
- Valores são usados em múltiplos lugares do código
- Precisa de validação automática de valores
- Valores têm lógica associada (métodos no Enum)
- Precisa de casting automático no Eloquent
- Valores são parte da lógica de negócio (não dados de referência)

## Quando Usar Tabela de Banco

❌ **Use Tabela quando:**
- Valores mudam frequentemente ou são gerenciados por usuários
- Valores precisam de metadados adicionais (descrição, ordem, ativo/inativo)
- Valores são específicos por tenant/cliente
- Precisa de histórico de mudanças
- Valores são referências externas (ex: códigos de países, categorias)
- Precisa de relacionamentos com outras tabelas
- Valores precisam ser traduzidos (i18n)
- Valores são configuráveis pelo administrador

## Exemplo: Enum para Status

```php
// ✅ CORRETO: Enum para status fixo
namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    
    public function label(): string
    {
        return match($this) {
            self::Pending => 'Pendente',
            self::Processing => 'Processando',
            self::Completed => 'Completo',
            self::Cancelled => 'Cancelado',
        };
    }
    
    public function color(): string
    {
        return match($this) {
            self::Pending => 'yellow',
            self::Processing => 'blue',
            self::Completed => 'green',
            self::Cancelled => 'red',
        };
    }
}

// No Model:
class Order extends Model
{
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
        ];
    }
}

// Uso:
$order->status = OrderStatus::Processing;
$order->save();

if ($order->status === OrderStatus::Pending) {
    // Lógica
}
```

## Exemplo: Tabela para Categorias

```php
// ✅ CORRETO: Tabela para categorias dinâmicas
// Migration:
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->integer('order')->default(0);
    $table->boolean('active')->default(true);
    $table->timestamps();
});

// Model:
class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'order', 'active'];
    
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}

// Uso:
$categories = Category::where('active', true)
    ->orderBy('order')
    ->get();
```

## Comparação Direta

| Critério | Enum | Tabela |
|----------|------|--------|
| Mudança de valores | Raramente | Frequentemente |
| Type safety | ✅ Sim | ❌ Não |
| Autocomplete IDE | ✅ Sim | ❌ Não |
| Metadados | ❌ Não | ✅ Sim |
| Multi-tenant | ❌ Não | ✅ Sim |
| Tradução (i18n) | ⚠️ Limitado | ✅ Sim |
| Performance | ✅ Melhor | ⚠️ Query adicional |
| Validação | ✅ Automática | ⚠️ Manual |
| Relacionamentos | ❌ Não | ✅ Sim |

## Regras de Ouro

1. **Status, Estados, Tipos fixos** → Use Enum
   - `OrderStatus`, `PaymentStatus`, `UserRole` (se fixo)

2. **Categorias, Tags, Referências** → Use Tabela
   - `Category`, `Tag`, `Country`, `City`

3. **Se precisa de CRUD para os valores** → Use Tabela

4. **Se valores são parte da lógica de negócio** → Use Enum

5. **Se valores mudam por cliente/tenant** → Use Tabela

## Exemplo Híbrido

```php
// Enum para status fixo
enum OrderStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
}

// Tabela para categorias dinâmicas
class Category extends Model { /* ... */ }

// Model usa ambos:
class Order extends Model
{
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class, // Enum
        ];
    }
    
    public function category(): BelongsTo // Tabela
    {
        return $this->belongsTo(Category::class);
    }
}
```
