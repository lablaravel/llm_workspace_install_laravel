# React, TypeScript e Inertia.js - Boas Práticas

Padrões obrigatórios para frontend com React, TypeScript e Inertia.js.

## Acessibilidade (a11y) - OBRIGATÓRIO

**Regras Críticas:**

1. ✅ **NUNCA use `accessKey`** em elementos HTML
2. ✅ **SEMPRE use `aria-label`** em elementos interativos sem texto visível
3. ✅ **SEMPRE inclua `type`** em elementos button
4. ✅ **SEMPRE acompanhe `onClick`** com `onKeyDown` para acessibilidade
5. ✅ **SEMPRE forneça alt text significativo** para imagens
6. ✅ **NUNCA use `tabIndex`** positivo em elementos não-interativos

**Exemplos:**

```tsx
// ❌ ERRADO: Acessibilidade ruim
<button onClick={handleClick}>Clique aqui</button>
<div onClick={handleClick}>Clique aqui</div>
<img src="photo.jpg" alt="image of photo" />

// ✅ CORRETO: Acessibilidade adequada
<button 
    type="button"
    onClick={handleClick}
    onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    aria-label="Criar novo registro"
>
    Criar Agendamento
</button>
<div 
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    aria-label="Abrir menu"
>
    Menu
</div>
<img src="photo.jpg" alt="Paciente em consulta médica" />
```

## React e JSX - Boas Práticas

**Regras Obrigatórias:**

1. ✅ **SEMPRE especifique todas as dependências** em React hooks
2. ✅ **SEMPRE chame React hooks** apenas no topo de funções
3. ✅ **NUNCA esqueça props `key`** em iteradores
4. ✅ **NUNCA defina componentes** dentro de outros componentes
5. ✅ **NUNCA use índice de Array** em keys

**Exemplos:**

```tsx
// ❌ ERRADO: Violações de React
function UserList({ users }) {
    function UserItem({ user }) { // Componente dentro de componente
        return <div>{user.name}</div>;
    }
    
    return (
        <div>
            {users.map((user, index) => (
                <UserItem key={index} user={user} /> // Index como key
            ))}
        </div>
    );
}

// ✅ CORRETO: Boas práticas React
function UserItem({ user }: { user: User }) {
    return <div>{user.name}</div>;
}

function UserList({ users }: { users: User[] }) {
    return (
        <div>
            {users.map((user) => (
                <UserItem key={user.id} user={user} />
            ))}
        </div>
    );
}
```

**Hooks:**

```tsx
// ❌ ERRADO: Hooks condicionais
function Component({ condition }) {
    if (condition) {
        const [state, setState] = useState(0); // Hook condicional
    }
    return <div>Content</div>;
}

// ✅ CORRETO: Hooks sempre no topo
function Component({ condition }: { condition: boolean }) {
    const [state, setState] = useState(0);
    
    if (condition) {
        // Lógica condicional aqui
    }
    
    return <div>Content</div>;
}

// ❌ ERRADO: Dependências faltando
useEffect(() => {
    fetchData(userId);
}, []); // Falta userId

// ✅ CORRETO: Todas as dependências
useEffect(() => {
    fetchData(userId);
}, [userId]); // Dependências completas
```

## TypeScript - Boas Práticas

**Regras Obrigatórias:**

1. ✅ **NUNCA use o tipo `any`**
2. ✅ **NUNCA use non-null assertions** (`!`)
3. ✅ **NUNCA use TypeScript enums** (prefira union types)
4. ✅ **Use `export type`** para tipos
5. ✅ **Use `import type`** para tipos

**Exemplos:**

```tsx
// ❌ ERRADO: TypeScript ruim
function processData(data: any) { // any type
    return data.value!; // Non-null assertion
}

enum Status { // TypeScript enum
    Pending = 'pending',
    Completed = 'completed'
}

// ✅ CORRETO: TypeScript adequado
type Status = 'pending' | 'completed'; // Union type

interface Data {
    value: string;
}

function processData(data: Data): string {
    if (!data.value) {
        throw new Error('Value is required');
    }
    return data.value;
}

// ✅ CORRETO: Import/Export de tipos
import type { User } from '@/types';
export type { Order, Resource };
```

## Inertia.js - Boas Práticas

**Regras Específicas:**

1. ✅ **SEMPRE use `router.visit()` ou `<Link>`** para navegação
2. ✅ **SEMPRE use `useForm` do Inertia** para formulários
3. ✅ **SEMPRE valide dados** no backend (Form Requests)
4. ✅ **SEMPRE use `form.setErrors()`** para erros de validação (422)
5. ✅ **SEMPRE use `form.processing`** para estados de loading

**Exemplos:**

```tsx
// ❌ ERRADO: Inertia mal usado
function Navigation() {
    return (
        <a href="/orders">Agendamentos</a> // Link tradicional
    );
}

function CreateForm() {
    const [errors, setErrors] = useState({});
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validação no frontend (ERRADO)
        if (!data.name) {
            setErrors({ name: 'Nome obrigatório' });
            return;
        }
    };
}

// ✅ CORRETO: Inertia adequado
import { Link, useForm } from '@inertiajs/react';

function Navigation() {
    return (
        <Link href="/orders">Agendamentos</Link> // Link Inertia
    );
}

function CreateForm() {
    const form = useForm({
        name: '',
        email: '',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/orders', {
            onError: (errors) => {
                // Erros já vêm do backend (Form Request)
                // form.errors é preenchido automaticamente
            },
        });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
            />
            {form.errors.name && (
                <span className="text-red-500">{form.errors.name}</span>
            )}
            <button type="submit" disabled={form.processing}>
                {form.processing ? 'Salvando...' : 'Salvar'}
            </button>
        </form>
    );
}
```

## JavaScript - Qualidade e Segurança

**Regras:**

1. ✅ **NUNCA use `eval()`**
2. ✅ **NUNCA use `var`** (use `const` ou `let`)
3. ✅ **Use `===` e `!==`** ao invés de `==` e `!=`
4. ✅ **NUNCA use `console`** em produção
5. ✅ **NUNCA hardcode dados sensíveis**

**Exemplos:**

```tsx
// ❌ ERRADO: JavaScript ruim
function processItems(items) {
    var result = []; // var
    items.forEach(function(item) { // forEach
        if (item.value == null) { // ==
            result.push(item);
        }
    });
    console.log(result); // console
    return result;
}

// ✅ CORRETO: JavaScript adequado
function processItems(items: Item[]): Item[] {
    const result: Item[] = [];
    for (const item of items) {
        if (item.value === null || item.value === undefined) {
            result.push(item);
        }
    }
    // Logging adequado (ex.: Sentry, LogRocket)
    return result;
}
```

## Checklist de Qualidade Frontend

1. ✅ O código é acessível? → Verifique regras a11y
2. ✅ Hooks estão no topo? → Sempre no nível superior
3. ✅ Dependências dos hooks estão completas? → Todas as dependências
4. ✅ Keys são estáveis? → Não use índice de array
5. ✅ TypeScript está sem `any`? → Use tipos específicos
6. ✅ Erros são tratados? → Use Error Pattern documentado
7. ✅ Inertia está sendo usado corretamente? → Links e forms via Inertia
8. ✅ Não há dados sensíveis hardcoded? → Use variáveis de ambiente
9. ✅ Console.log foi removido? → Use logging adequado
