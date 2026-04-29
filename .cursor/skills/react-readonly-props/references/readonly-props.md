# Props read-only em componentes React (TypeScript)

> **Problema:** O lint exige *"Mark the props of the component as read-only"*. Em React, props são imutáveis por contrato; o tipo deve refletir isso com `Readonly<T>`.

---

## ❌ Como NÃO usar

### Evitar: props como objeto mutável

```tsx
// Lint: "Mark the props of the component as read-only"
export default function ForgotPassword({ status }: { status?: string }) {
    // ...
}
```

```tsx
// Mesmo problema com interface sem Readonly
interface Props {
    status?: string;
}
export default function ForgotPassword({ status }: Props) {
    // ...
}
```

**Por que evitar:** O tipo permite, em tempo de compilação, atribuições como `status = 'x'` dentro do componente. Isso viola o contrato de imutabilidade das props e pode ser sinalizado por react-compiler, SonarQube ou regras de imutabilidade.

---

## ✅ Como usar

### Opção 1: Props inline com `Readonly<>`

Use quando as props forem poucas e definidas inline:

```tsx
export default function ForgotPassword({ status }: Readonly<{ status?: string }>) {
    // status é tratado como readonly
}
```

### Opção 2: Interface + `Readonly<>`

Use quando houver várias props ou quando a interface for reutilizada:

```tsx
interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: Readonly<ForgotPasswordProps>) {
    // ...
}
```

### Opção 3: Parâmetro `props` completo

```tsx
interface AdminTenantsShowProps extends PageProps {
    tenant: { id: string; name: string };
}

export default function AdminTenantsShow(props: Readonly<AdminTenantsShowProps>) {
    const { tenant } = props;
    // ...
}
```

### Opção 4: Tipo inline com várias chaves

```tsx
export default function ResetPassword({
    email,
    token,
}: Readonly<{ email: string; token: string }>) {
    // ...
}
```

---

## Sobre `Readonly<T>` (TypeScript)

- **O que faz:** Cria um tipo em que todas as propriedades de `T` são `readonly`. Atribuições como `props.status = 'x'` passam a ser erro de tipo.
- **Fonte (TypeScript):** O utility type `Readonly<T>` está na lib padrão do TypeScript; aplica um mapped type que torna cada chave readonly.

Exemplo conceitual (fonte: repositório TypeScript):

```typescript
// Readonly<T> torna todas as propriedades readonly
declare let x4: Readonly<Bar>;
x4.a = 1;  // Error - Cannot assign to readonly property
x4.b = 1;  // Error - Cannot assign to readonly property
```

- **Fonte (React + TypeScript):** O TypeScript Cheatsheets React recomenda tipar props com interfaces ou types; usar `Readonly<>` para props segue a convenção de que props são imutáveis em React.

---

## Referências (fontes)

| Tópico | Fonte |
|--------|--------|
| Utility type `Readonly<T>` | TypeScript — [microsoft/typescript](https://github.com/microsoft/typescript) (mapped types, readonly) |
| Tipagem de props em React | TypeScript Cheatsheets React — [typescript-cheatsheets/react](https://github.com/typescript-cheatsheets/react) (basic type examples, ComponentProps) |
| Context7 | Consultas: `React component props TypeScript readonly immutability`, `Readonly utility type shallow readonly` |

Documentação consultada via **Context7** (TypeScript, TypeScript Cheatsheets React) para exemplos e boas práticas atualizadas.
