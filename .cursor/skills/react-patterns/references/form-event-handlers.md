# Tipagem de event handlers de formulário (React + TypeScript)

> **Problema:** `FormEventHandler` e `FormEvent` estão **depreciados** no React (e em regras como SonarQube). Este documento define a forma correta de tipar handlers de submit e evita o uso dos tipos obsoletos.

---

## ❌ Como NÃO usar

### Evitar: `FormEventHandler`

```tsx
import { FormEventHandler } from 'react';

// Depreciado — gera aviso de depreciação
const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('app.password.store'));
};
```

### Evitar: `FormEvent` importado

```tsx
import { FormEvent } from 'react';

// Também pode ser sinalizado como depreciado (ex.: SonarQube)
const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('app.password.store'));
};
```

**Por que evitar:** O ecossistema React/TypeScript está depreciando esses tipos em favor de tipagem mais explícita ou mínima. Linters (ex.: SonarQube) podem marcar tanto `FormEventHandler` quanto `FormEvent` como obsoletos.

---

## ✅ Como usar (solução recomendada)

### Opção 1: Tipo mínimo (recomendado para apenas `preventDefault`)

Use quando o handler **só** precisar de `e.preventDefault()` (caso comum em `onSubmit`):

```tsx
// Sem import de tipos de evento do React
const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    post(route('app.password.store'), {
        onFinish: () => reset('password', 'password_confirmation'),
    });
};

return <form onSubmit={submit}>...</form>;
```

**Vantagens:** Nenhum tipo depreciado; tipagem suficiente para o que é usado; menos acoplamento aos tipos do React.

---

### Opção 2: Acesso a `currentTarget` (form completo)

Use quando precisar do **elemento do form** (ex.: `e.currentTarget`, `new FormData(e.currentTarget)`):

```tsx
const submit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // ...
};

return <form onSubmit={submit}>...</form>;
```

**Vantagens:** Tipo mínimo e explícito; sem tipos depreciados; acesso tipado ao `HTMLFormElement`.

---

### Opção 3: Namespace `React` (se a equipe preferir)

Se quiser manter o tipo do React sem importar o tipo depreciado:

```tsx
import React from 'react';

// Usar React.FormEvent apenas se NÃO for sinalizado como depreciado no seu ambiente
const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('app.password.store'));
};
```

**Atenção:** Em projetos com SonarQube (ou regras que marcam `FormEvent` como depreciado), prefira a **Opção 1** ou **Opção 2**.

---

## Resumo

| Situação                         | Recomendação                                      |
|----------------------------------|---------------------------------------------------|
| Só usa `e.preventDefault()`      | Opção 1: `(e: { preventDefault: () => void })`   |
| Precisa de `e.currentTarget`     | Opção 2: adicionar `currentTarget: HTMLFormElement` |
| Projeto sem aviso sobre FormEvent| Opção 3: `React.FormEvent<HTMLFormElement>` (opcional) |

---

## Referência rápida

```tsx
// ✅ Submit simples (apenas preventDefault)
const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // ...
};

// ✅ Submit com acesso ao form
const submit = (e: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
    e.preventDefault();
    const form = e.currentTarget;
    // ...
};
```

**Não usar:** `FormEventHandler`, `import { FormEvent } from 'react'` em novos códigos quando houver depreciação no ambiente.
