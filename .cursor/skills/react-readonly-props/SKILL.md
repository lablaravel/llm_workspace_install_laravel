---
name: react-readonly-props
description: Marca as props de componentes React como read-only em TypeScript. Resolve o aviso de lint "Mark the props of the component as read-only". Use ao tipar props de componentes funcionais ou quando o linter/React Compiler exigir props imutáveis.
---

# React — Props read-only em TypeScript

## Problema

Linters (ex.: react-compiler, SonarQube) e boas práticas React exigem que as **props** sejam tratadas como **imutáveis**. Tipar props como objeto mutável (`{ status?: string }`) não reflete esse contrato e pode gerar:

- Aviso: *"Mark the props of the component as read-only"*
- Risco de mutação acidental (`props.status = 'x'`) dentro do componente

## Solução

Tipar as props com **`Readonly<T>`** (utility type do TypeScript). Assim o tipo fica alinhado ao contrato imutável das props e o aviso some.

## Regra rápida

| Situação | Fazer |
|----------|--------|
| Props inline no parâmetro | `({ status }: Readonly<{ status?: string }>)` |
| Interface/type de props | `(props: Readonly<MyProps>)` ou `({ a, b }: Readonly<MyProps>)` |
| Props com muitas chaves | Preferir interface + `Readonly<MyProps>` |

## Exemplos no SKILL

- **Como usar:** props tipadas com `Readonly<...>` (inline ou interface).
- **Como não usar:** props tipadas só como objeto/interface sem `Readonly`.

Referência completa com exemplos e fontes: [references/readonly-props.md](references/readonly-props.md).

## Quando aplicar

- Ao criar ou editar componentes funcionais que recebem props.
- Quando o IDE ou CI exibir *"Mark the props of the component as read-only"*.
- Para manter padrão do projeto (ex.: outras páginas já usam `Readonly<PageProps>`).
