# PHP / Laravel / Inertia — segurança no backend e na camada híbrida (guia do projeto)

Documento **complementar** ao pacote upstream (que não inclui PHP/Laravel). Foco: **Laravel 12**, **PHP 8.5**, **Inertia v2**, aplicação com **multi-tenant** e integrações típicas (Sanctum, APIs externas). Use junto com `javascript-general-web-frontend-security.md` e `javascript-typescript-react-web-frontend-security.md` para cobrir **todo** o stack.

Para pormenores versionados, usar **`search-docs`** (Laravel Boost) sobre autenticação, Sanctum, validação, filesystem e sessão.

---

## 0) Regras duras (MUST)

- MUST validar entrada com **Form Request** ou equivalente; nunca confiar em dados do cliente (incl. campos hidden, headers, JSON Inertia).
- MUST aplicar **autorização** (Policy, Gate ou middleware) em ações que leem ou alteram dados; “autenticado” não implica “autorizado”.
- MUST usar **Eloquent/bindings** ou Query Builder parametrizado; evitar SQL concatenado com input do utilizador.
- MUST respeitar **isolamento por tenant** onde existir (`tenant_id`, pacote tenancy): qualquer query que aceda a dados de cliente MUST filtrar pelo contexto de tenant correto; nunca expor dados de outro tenant por `find($id)` sem scope.
- MUST **não** colocar segredos, tokens ou chaves em código, props Inertia ou respostas JSON enviadas ao browser; usar `config()` alimentado por env e apenas expor o mínimo ao front.
- MUST **não** desativar proteções globais (CSRF para rotas web, throttling, verificação de email quando exigida pelo produto) “temporariamente” sem decisão documentada (ver secção Overrides na skill principal).
- MUST tratar uploads: validar tipo/tamanho, armazenar fora da web root quando aplicável, nomes não previsíveis, e autorização sobre “quem pode enviar o quê”.

---

## 1) Mass assignment e modelos

- MUST definir `$fillable` ou `$guarded` de forma explícita; evitar `Model::create($request->all())` sem lista restrita.
- SHOULD usar DTOs/`Data` tipados para serviços quando reduzir superfície de campos aceites.

---

## 2) Inertia e dados partilhados

- MUST auditar `HandleInertiaRequests` (e merges): nunca partilhar objetos com relações inteiras sensíveis, tokens, ou listas de permissões que revelem estrutura interna desnecessária.
- SHOULD preferir dados mínimos para a página; carregar o resto via endpoints com autorização explícita quando fizer sentido.

---

## 3) APIs, Sanctum e CORS

- MUST separar mentalmente rotas **web** (sessão + CSRF + Inertia) de **API** token-based; rever `bootstrap/app.php` / middleware por grupo.
- MUST validar abilities/tokens Sanctum onde aplicável; não assumir que “API interna” não será chamada por terceiros se a URL vazar.
- Se existir CORS personalizado: SHOULD restringir origins; MUST evitar `*` com credenciais.

---

## 4) Criptografia e dados sensíveis

- MUST usar mecanismos Laravel/CipherSweet (ou equivalente do projeto) para dados pessoais sensíveis em repouso, conforme padrão já adotado no codebase.
- MUST **não** logar passwords, tokens completos, refresh tokens ou cabeçalhos `Authorization`.

---

## 5) Ficheiros, queues e jobs

- MUST serializar apenas IDs ou dados mínimos em jobs; não passar modelos completos com dados sensíveis sem necessidade.
- SHOULD usar `ShouldBeUnique` / idempotência onde jobs possam ser duplicados por retry.

---

## 6) Cabeçalhos e cookies (Laravel)

- Headers de segurança (CSP, HSTS, etc.) podem estar no servidor web ou middleware; se não visíveis no repo, reportar “verificar em produção/proxy” (alinhado ao guia geral da skill).
- Cookies `secure` e `same_site`: alinhar com ambiente (dev sem TLS vs produção); não reportar “falta TLS em local” como crítica.

---

## 7) IDs expostos

- SHOULD evitar expor sequências pequenas como único identificador público de recursos sensíveis; preferir UUIDs ou identificadores opacos **quando** o requisito de negócio o justificar (ver também “General Security Advice” na skill principal).

---

## 8) Modo auditoria (checklist rápido)

Ao rever código PHP/Laravel neste projeto, procurar ativamente:

1. Controllers finos sem validação/autorização delegada incorretamente ao Service sem checagem.
2. `DB::raw`, `whereRaw` com concatenação.
3. `eval`, `unserialize` com input externo.
4. Rotas `debug` ou dumps em produção.
5. Exceções que vazam stack traces ou queries ao cliente em produção.
6. Mass assignment em `update`/`create` a partir de arrays não filtrados.

---

*Este ficheiro é específico do repositório akitenwifi; não faz parte do pacote original security-best-practices do tech-leads-club.*
