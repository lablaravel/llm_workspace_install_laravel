---
name: security-best-practices
description: Revisão e código seguro por stack do projeto (Laravel 12, PHP 8.5, Inertia v2, React 19). Use quando o utilizador pedir revisão de segurança, relatório de vulnerabilidades, secure-by-default, OWASP, CSRF/XSS, hardening, auditoria de API ou Sanctum. Carrega referências em references/ conforme a camada (backend PHP/Laravel + frontend JS/React). Não use para code review geral sem foco segurança, debugging neutro, threat modeling exaustivo (use processo dedicado se existir) nem tarefas sem impacto de segurança.
---

# Security Best Practices (stack AkitenWifi)

Baseado no [security-best-practices — tech-leads-club / openai skills](https://github.com/tech-leads-club/agent-skills/tree/main/packages/skills-catalog/skills/(security)/security-best-practices), **adaptado** a este monólito: backend **Laravel + PHP**, front **Inertia + React + TypeScript**, com referências locais em `references/`.

## Interligação (ficheiros — sem espelhar conteúdo)

- **Este skill (canónico):** `.cursor/skills/security-best-practices/SKILL.md`
- **Referências normativas:** `.cursor/skills/security-best-practices/references/` (ex.: `php-laravel-inertia-web-backend-security.md`, `javascript-typescript-react-web-frontend-security.md`, `javascript-general-web-frontend-security.md`)
- **Arquitetura da stack (Services, Form Requests, Inertia):** `.cursor/skills/laravel-inertia-react-architecture/SKILL.md` — complementa esta skill; não duplicar regras de segurança lá nem aqui em modo espelho
- **Relatórios de auditoria (caminho sugerido):** `.cursor/docs/security/security-best-practices-report.md`
- **Ferramentas que só leem `.agents/skills/`:** esta skill **não** está em `.agents`; indicar sempre o caminho em `.cursor/skills/security-best-practices/`. Ver `.agents/skills/README.md`

## Identificar o âmbito

1. Confirmar linguagens e frameworks em causa (evidência: `composer.json`, `package.json`, `resources/js/`, rotas, `app/`).
2. Para alterações **full-stack**, cobrir **backend e frontend** — nunca só uma das camadas.

## Quais referências ler (ordem sugerida)

| Camada | Ficheiro(s) em `references/` |
|--------|------------------------------|
| Backend PHP / Laravel / Inertia server | `php-laravel-inertia-web-backend-security.md` (**local**, complementar ao upstream) |
| React / TS no browser | `javascript-typescript-react-web-frontend-security.md` |
| JS/TS geral no browser (complementa React) | `javascript-general-web-frontend-security.md` |

Ler **todos** os ficheiros aplicáveis ao âmbito da tarefa antes de concluir uma auditoria ou de propor código novo. Os dois primeiros sobre frontend reforçam-se mutuamente (React + práticas gerais de browser).

Detalhes versionados Laravel/ecossistema: usar **`search-docs`** (Laravel Boost) quando a referência local não chegue.

## Modos de operação

1. **Geração:** ao escrever código novo, seguir MUST/SHOULD das referências carregadas sem esperar pedido explícito de “segurança”.
2. **Revisão passiva:** ao editar ficheiros sensíveis (auth, pagamentos, uploads, políticas, integrações ERP, tenant), assinalar apenas achados **críticos** ou **alto impacto**; evitar ruído por micro-issues.
3. **Relatório:** quando o utilizador pedir relatório ou “varrimento”, produzir documento estruturado (formato abaixo).

## Relatório (quando pedido)

- Caminho por defeito: **`.cursor/docs/security/security-best-practices-report.md`** (ou caminho indicado pelo utilizador).
- Incluir: resumo executivo; achados por **severidade**; ID numérico por achado; para críticos, **uma frase de impacto**; citações de código com **ficheiro e linhas** quando possível.
- No chat: resumo curto + localização do ficheiro; oferecer correções **uma a uma** (ver secção Correcções).

## Correcções

- Uma vulnerabilidade ou família relacionada por vez; mensagens de commit e PR alinhadas ao fluxo do projeto (`vendor/bin/sail artisan test` no mínimo nos ficheiros afetados).
- Comentários mínimos no código só quando a correção não for óbvia; não quebrar comportamento sem avisar risco de regressão.
- Respeitar **Overrides**: regras de negócio ou exceções documentadas no projeto prevalecem; pode registar o risco sem bloquear o utilizador.

## Conselhos gerais (do upstream, mantidos)

- **IDs incrementais** expostos publicamente: preferir identificadores opacos/UUID quando o modelo de ameaça o exigir.
- **TLS / cookies Secure / HSTS:** não reportar ausência de TLS em **dev local** como falha crítica; cookies `secure` apenas com HTTPS real; evitar recomendar HSTS leviano (efeitos prolongados se mail configurado).

## O que **não** está no repositório

Referências Python, Go, Express, Next, etc., existem no [upstream](https://github.com/tech-leads-club/agent-skills/tree/main/packages/skills-catalog/skills/(security)/security-best-practices/references) mas **não** foram copiadas — não fazem parte do stack atual. Se o projeto integrar outra stack no futuro, adicionar o ficheiro correspondente a `references/` e atualizar a tabela desta skill.
