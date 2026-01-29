---
name: laravel-packages
description: Documentação de pacotes Laravel utilizados no projeto. Referências técnicas, padrões de uso e integração com a arquitetura do projeto.
keywords:
  - laravel
  - packages
  - spatie
  - laravel-data
  - dto
  - composer
---

# Laravel Packages

Documentação centralizada dos pacotes Laravel utilizados no projeto, incluindo padrões de uso, exemplos e integração com a arquitetura definida em `laravel-inertia-react-architecture`.

## Pacotes Documentados

| Pacote | Versão | Propósito | Referência |
|--------|--------|-----------|------------|
| `spatie/laravel-data` | ^4.0 | Data Transfer Objects (DTOs) tipados | [laravel-data.md](references/laravel-data.md) |

## Quando Usar Cada Pacote

### spatie/laravel-data

Use `spatie/laravel-data` quando:

- ✅ Transferir dados entre camadas (Controller → Service) com mais de 3 campos
- ✅ Precisar de validação automática baseada em type hints
- ✅ Quiser gerar tipos TypeScript para o frontend React/Inertia
- ✅ Precisar de autocomplete completo na IDE
- ✅ Quiser análise estática com PHPStan

**Não use** quando:

- ❌ Dados simples com 1-3 campos (arrays associativos são aceitáveis)
- ❌ Dados temporários dentro de um único método
- ❌ Quando o overhead de criar uma classe não compensa

## Integração com Arquitetura

Este skill complementa a skill `laravel-inertia-react-architecture`:

- **DTOs** são usados para contratos de dados entre Controller e Service
- **Enums** são usados para valores de domínio fixos (status, tipos, categorias)
- **Form Requests** continuam sendo usados para validação de entrada HTTP
- **Services** recebem DTOs tipados ao invés de arrays associativos

## Adicionando Novos Pacotes

Ao adicionar um novo pacote Laravel ao projeto:

1. Instale via Composer: `composer require vendor/package`
2. Crie um arquivo de referência em `references/{package-name}.md`
3. Adicione entrada na tabela "Pacotes Documentados" acima
4. Documente padrões de uso e integração com a arquitetura
5. Atualize este arquivo com instruções de quando usar o pacote

## Referências Externas

- [Laravel Data Documentation](https://spatie.be/docs/laravel-data)
- [Composer Package Manager](https://getcomposer.org/)
