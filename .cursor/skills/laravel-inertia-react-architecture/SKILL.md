---
name: laravel-inertia-react-architecture
description: Decisões arquiteturais obrigatórias para projetos Laravel + Inertia + React. Use quando criar Controllers, Services, Form Requests, Models, tratar exceptions, implementar logging, ou escrever código  React/Inertia. Padrões Service Layer (Fat Services), Eloquent  Direto (NUNCA Repository), Controllers Thin, Form Requests para validação, declare(strict_types=1) obrigatório.
keywords:
  - laravel
  - inertia
  - react
  - service layer
  - eloquent
  - form request
  - controller
  - exception
  - logging
  - typescript
  - php
  - architecture
---

# Laravel Inertia React Architecture

Decisões arquiteturais obrigatórias para projetos Laravel 11+ com Inertia.js e React/TypeScript.

## Princípios Fundamentais

1. **Service Layer (Fat Services)**: Toda lógica de negócio deve estar em Services, nunca em Controllers
2. **Eloquent Direto**: NUNCA use Repository Pattern - use Eloquent diretamente nos Services
3. **Controllers Thin**: Controllers apenas orquestram, delegam para Services
4. **Form Requests**: Validação sempre via Form Requests, nunca inline no Controller
5. **Strict Types**: `declare(strict_types=1);` obrigatório em todos os arquivos PHP
6. **Data Transfer Objects (DTOs)**: Use `spatie/laravel-data` para contratos de dados entre camadas. Evite arrays associativos quando houver mais de 3 campos.
7. **Enums over Strings**: Use Backed Enums (PHP 8.1+) para status, categorias e tipos.

## Navegação por Contexto

| Tarefa | Arquivo de Referência |
|--------|----------------------|
| Criar Controller | [controllers.md](references/controllers.md) |
| Criar Service | [services.md](references/services.md) |
| Criar Form Request | [form-requests.md](references/form-requests.md) |
| Criar Events/Listeners | [events-listeners.md](references/events-listeners.md) |
| Tratar Exceptions | [exceptions.md](references/exceptions.md) |
| Implementar Logging | [logging.md](references/logging.md) |
| Queries Eloquent/Cache | [eloquent-patterns.md](references/eloquent-patterns.md) |
| Enums vs Database | [enums-vs-database.md](references/enums-vs-database.md) |
| DTOs com Laravel Data | [dtos.md](references/dtos.md) |
| DTOs - Referência Técnica | [../../laravel-packages/references/laravel-data.md](../../laravel-packages/references/laravel-data.md) |
| Código React/Inertia | [react-inertia.md](references/react-inertia.md) |
| Revisar Código (SOLID) | [solid-principles.md](references/solid-principles.md) |
| Object Calisthenics | [object-calisthenics.md](references/object-calisthenics.md) |
| Error Handling Full Stack | [error-handling-fullstack.md](references/error-handling-fullstack.md) |
| Checklists Rápidos | [checklists.md](references/checklists.md) |

## Checklist Rápido (Antes de Codificar)

1. ✅ Usar `declare(strict_types=1);` no arquivo?
2. ✅ Controller está Thin (apenas orquestração)?
3. ✅ Service está Fat (lógica de negócio)?
4. ✅ Form Request para validação?
5. ✅ Eloquent direto (sem Repository)?
6. ✅ Type hints explícitos em métodos?
7. ✅ PHPDoc nos métodos públicos?
8. ✅ Transações para operações múltiplas?
9. ✅ Tratamento de exceptions adequado?
10. ✅ Logs estruturados com contexto?
11. ✅ Eventos disparados após `DB::afterCommit()`?
12. ✅ Queued listeners são idempotentes?
13. ✅ Listeners delegam lógica para Services?
14. ✅ Dados complexos usando Laravel Data DTOs (evitando `array $data`)?
15. ✅ Enums utilizados para valores de domínio fixos?

## Stack Tecnológica

- **Backend**: Laravel 11+
- **Frontend**: React 18+ com TypeScript
- **Bridge**: Inertia.js
- **Database**: PostgreSQL (recomendado)
- **Code Style**: PSR-12 (via Laravel Pint)

## Ferramentas de Documentação

**SEMPRE use MCPs para buscar documentação quando necessário:**

- ✅ **Laravel Boost MCP**: Use `search-docs` para buscar documentação específica do Laravel e pacotes do ecossistema
- ✅ **Context7 MCP**: Use para buscar documentação de bibliotecas externas e exemplos de código atualizados

**Regra OBRIGATÓRIA**: Sempre consulte documentação via MCPs antes de implementar features que não estão completamente cobertas neste documento.

## Uso

Este skill segue Progressive Disclosure - apenas o conteúdo relevante para a tarefa atual é carregado. Consulte os arquivos de referência específicos conforme necessário.
