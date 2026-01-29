# Checklists Rápidos

Tabelas de decisão e checklists para uso rápido.

## Checklist Antes de Criar Código

1. ✅ Esta lógica se encaixa em um Controller, Service, Action, Job, Observer ou Listener?
2. ✅ Já existe algo similar no projeto que posso reutilizar?
3. ✅ Preciso de validação? → Form Request
4. ✅ Preciso de autorização? → Policy ou `authorize()` no Form Request
5. ✅ É lógica de negócio? → Service (NUNCA no Controller)
6. ✅ É query reutilizável? → Scope no Model
7. ✅ É ação após evento? → Event + Listener
8. ✅ É transformação de dados? → Accessor/Mutator
9. ✅ Preciso de testes? → SIM, sempre (TDD quando possível)
10. ✅ Documentei com PHPDoc? → SIM, sempre
11. ✅ Usei type hints explícitos? → SIM, sempre
12. ✅ Usei `declare(strict_types=1);`? → SIM, sempre
13. ✅ Usei Eloquent direto? → SIM (NUNCA Repository)
14. ✅ Mantive Controller thin? → SIM (apenas orquestração)

## Quando Criar Service?

✅ **Crie Service quando:**
- Há lógica de negócio complexa (> 2 regras de negócio)
- Há múltiplas validações de negócio (além da validação de formulário)
- Há integração com APIs externas
- Há processamento de dados complexo
- Há necessidade de reutilização da lógica
- Há transações de banco complexas

❌ **NÃO crie Service quando:**
- É apenas CRUD simples (listar, mostrar, criar básico)
- Apenas validação de formulário (use Form Request)
- Apenas redirecionamento simples
- Apenas renderização de view

## Quando Usar Enum vs Tabela?

✅ **Use Enum quando:**
- Valores são fixos e não mudam frequentemente
- Valores são conhecidos em tempo de compilação
- Precisa de type safety e autocomplete
- Valores têm lógica associada (métodos no Enum)
- Valores são parte da lógica de negócio

❌ **Use Tabela quando:**
- Valores mudam frequentemente ou são gerenciados por usuários
- Valores precisam de metadados adicionais
- Valores são específicos por tenant/cliente
- Precisa de relacionamentos com outras tabelas
- Valores precisam ser traduzidos (i18n)

## Checklist de Logging

1. ✅ Qual nível de log é apropriado? → Use RFC 5424
2. ✅ Incluí contexto suficiente? → IDs, timestamps, dados relevantes
3. ✅ Não estou logando dados sensíveis? → Senhas, cartões, tokens
4. ✅ O log é útil para debug/produção? → Evite logs desnecessários
5. ✅ Usei o canal correto? → security, audit, default
6. ✅ O log tem trace_id? → Para rastreamento em produção

## Checklist de Exceptions

1. ✅ Esta exception já existe no Laravel? → Use a nativa
2. ✅ Precisa de tratamento especial? → Crie customizada
3. ✅ Incluí contexto suficiente? → IDs, dados relevantes
4. ✅ Usei código de erro consistente? → Padronize códigos
5. ✅ Implementei `render()` se necessário? → Para respostas customizadas
6. ✅ Implementei `shouldReport()`? → Controlar logging
7. ✅ Mensagem é amigável ao usuário? → Não exponha detalhes técnicos
8. ✅ É essencial criar exception, um caso exception especial para ser necessário um exception ?

## Checklist de Otimização de Queries

1. ✅ Preciso de todas as colunas? → Use `select()`
2. ✅ Vou acessar relacionamentos? → Use `with()`
3. ✅ São muitos registros? → Use `paginate()` ou `chunk()`
4. ✅ Dados mudam raramente? → Use `Cache::remember()`
5. ✅ Preciso apenas verificar existência? → Use `exists()`
6. ✅ Há índices nas colunas consultadas? → Crie índices
7. ✅ Query é executada frequentemente? → Considere cache

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

## Checklist Object Calisthenics

- ✅ Método tem no máximo um nível de indentação?
- ✅ Fluxo usa early-return ao invés de `else`?
- ✅ Primitivos críticos estão encapsulados?
- ✅ Coleções têm helpers dedicados?
- ✅ Há no máximo uma cadeia de `->`/`.` por linha?
- ✅ Nomes são completos e sem siglas internas?
- ✅ Classe possui ≤ 50 linhas e ≤ 2 propriedades de estado?
- ✅ Invariantes são protegidos por comportamentos, não setters?

## Checklist de Events & Listeners

1. ✅ Listener é "Thin" (delega para Service)?
2. ✅ Evento é disparado após `DB::afterCommit()` em transações?
3. ✅ Queued listener é idempotente (usa Cache::add ou similar)?
4. ✅ Definiu `$tries` e `$backoff` para retries?
5. ✅ Implementou método `failed()` para alertas?
6. ✅ Evento inclui `trace_id` para rastreabilidade?
7. ✅ É Domain Event (interno) ou Integration Event (externo)?
8. ✅ Listener não contém lógica de negócio?
9. ✅ Evento usa `SerializesModels` para Models Eloquent?
