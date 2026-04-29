# Especificação de segurança web React (JavaScript/TypeScript) (React 19.x, TypeScript 5.x)

Este documento é uma **especificação de segurança** que suporta:

1. **Geração de código secure-by-default** para novo código React.
2. **Revisão de segurança / caça a vulnerabilidades** em código React existente (modo passivo “reparar em problemas enquanto se trabalha” e modo ativo “varrer o repositório e reportar achados”).

Está escrito de propósito como **requisitos normativos** (“MUST/SHOULD/MAY”) mais **regras de auditoria** (como maus padrões se manifestam, como detetar e como corrigir/atenuar).

---

## 0) Segurança, limites e restrições anti-abuso (MUST FOLLOW)

- MUST NOT pedir, mostrar, registar em log ou commitar segredos (chaves API, segredos OAuth, chaves privadas, cookies de sessão, JWTs, chaves de assinatura).
  - Nota frontend: tudo o que vai para o browser é observável por utilizadores e atacantes (view-source, devtools, proxies); nunca tratar código cliente ou “variáveis de ambiente no bundle” como segredo. ([create-react-app.dev][1])

- MUST NOT “corrigir” segurança desativando proteções (ex.: desligar CSP para “funcionar”, adicionar `unsafe-inline`/`unsafe-eval` sem plano documentado e limitado, desativar proteções CSRF com cookies, alargar CORS, saltar sanitização, ou bypasses “temporários” que vão para produção). ([OWASP Cheat Sheet Series][2])
- MUST fornecer **achados baseados em evidência** nas auditorias: citar caminhos de ficheiro, excertos de código e valores de configuração que sustentem a conclusão.
- MUST tratar a incerteza com honestidade: se uma proteção puder existir na infra (CDN/WAF/reverse proxy), reportar como “não visível no código da app; verificar cabeçalhos em runtime / config no edge”.
- MUST assumir que qualquer dado que cruza um limite de confiança (URL, storage, rede, postMessage, scripts de terceiros) pode ser influenciado pelo atacante salvo prova em contrário (ver §2.1).

---

## 1) Modos de operação

### 1.1 Modo geração (predefinido)

Quando for pedido para escrever novo código React ou alterar o existente:

- MUST cumprir todos os requisitos **MUST** desta especificação.
- SHOULD cumprir todos os **SHOULD** salvo indicação explícita em contrário do utilizador.
- MUST preferir APIs seguras por defeito e bibliotecas comprovadas em vez de segurança artesanal.
- MUST evitar introduzir novos sinks de risco (inserção de HTML cru, sinks DOM diretos como `innerHTML`, execução dinâmica de código, redirecionamentos/navegação não confiáveis, injeção de scripts de terceiros, armazenamento inseguro de tokens, etc.). ([MDN Web Docs][3])

### 1.2 Modo revisão passiva (sempre ativo enquanto se edita)

Enquanto se trabalha em qualquer parte de um repositório React (mesmo sem pedido explícito de varrimento de segurança):

- MUST “reparar” em violações desta especificação no código tocado ou próximo.
- SHOULD mencionar problemas à medida que surgem, com explicação breve + correção segura.

### 1.3 Modo auditoria ativa (pedido explícito de varrimento)

Quando o utilizador pedir para “varrer”, “auditar” ou “procurar vulnerabilidades”:

- MUST procurar sistematicamente no código violações desta especificação.
- MUST apresentar achados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada da app, tooling de build (Vite/Webpack/CRA/Next), configs de deployment, CDN/alojamento estático.
2. Exposição de segredos e configuração (env vars, injeção de config em runtime, source maps).
3. Renderização de dados não confiáveis (XSS/DOM XSS), especialmente `dangerouslySetInnerHTML`, renderizadores markdown/HTML, atributos de URL.
4. Uso direto do DOM e execução JS perigosa (`innerHTML`, `eval`, `new Function`, `document.write`, etc.).
5. Padrões de auth e sessão (armazenamento de tokens, cookies, CSRF, fluxos OAuth).
6. Camada de rede (wrappers axios/fetch, URLs base dinâmicas, pedidos com credenciais, riscos de exfiltração).
7. Navegação e redirecionamentos (open redirects, `window.location`, `target=_blank`, `window.open`).
8. Scripts/tags/analytics de terceiros e controlos de integridade (CSP, SRI).
9. Comportamento de service worker/PWA (HTTPS, regras de cache, estratégia de atualização).
10. Postura de cabeçalhos de segurança (CSP, clickjacking, nosniff, referrer policy) na app ou no edge. ([OWASP Cheat Sheet Series][2])

---

## 2) Definições e orientação de revisão

### 2.1 Entrada não confiável (tratar como controlada pelo atacante salvo prova em contrário)

Exemplos:

- Dados derivados da URL: `window.location`, query params, fragmentos hash, parâmetros de rota.
- Qualquer dado de storage do browser: `localStorage`, `sessionStorage`, `IndexedDB` (incluindo dados escritos antes pela app—XSS ou extensões podem adulterar). ([OWASP Cheat Sheet Series][4])
- Dados de mensagens entre janelas: payloads de `window.postMessage`. ([OWASP Cheat Sheet Series][4])
- Dados de APIs remotas, webhooks proxificados para o cliente, respostas GraphQL, conteúdo CMS, feature flags.
- Conteúdo de utilizador persistido (perfis, comentários, rich text, markdown) renderizado na UI.
- Dados produzidos por scripts de terceiros ou tag managers (tratar como não confiáveis salvo controlo forte). ([OWASP Cheat Sheet Series][5])

### 2.2 Pedido que altera estado (perspetiva frontend)

Um pedido altera estado se pode criar/atualizar/apagar dados, mudar auth/sessão, despoletar efeitos laterais (compra, envio de email, webhook) ou iniciar ações privilegiadas.

Nota específica de frontend:

- Alterações de estado são muitas vezes acionadas por `fetch/axios` ou submissões de formulário. Se a autenticação for por cookie, estes pedidos podem ser relevantes para CSRF (§4 REACT-CSRF-001). ([OWASP Cheat Sheet Series][6])

### 2.3 Formato obrigatório de achado de auditoria

Para cada problema encontrado, produzir:

- Rule ID:
- Severity: Critical / High / Medium / Low
- Location: caminho do ficheiro + componente/função + linha(s)
- Evidence: excerto exato de código/config
- Impact: o que pode correr mal, quem pode explorar
- Fix: alteração segura (preferir diff mínimo)
- Mitigation: defesa em profundidade se a correção imediata for difícil
- False positive notes: o que verificar em caso de dúvida

---

## 3) Linha de base segura: configuração mínima em produção (MUST em produção)

É a menor “linha de base de produção” que evita erros de configuração comuns em frontends React.

### 3.1 Build de produção e higiene de configuração (MUST)

- MUST publicar um build de produção (minificado, sem overlays/ferramentas só de dev, flags de modo corretas).
- MUST garantir que a configuração em build não embute segredos no JS/HTML/CSS enviado. “Variáveis de ambiente” em build não são secretas; tratá-las como públicas. ([create-react-app.dev][1])
- SHOULD tratar source maps como artefactos operacionais sensíveis:
  - Não os publicar abertamente, ou publicá-los só onde for intencional (ex.: atrás de auth ou para fornecedor de relatório de erros), pois revelam estrutura de código e URLs internas.

### 3.2 Proteções impostas pelo browser (SHOULD, mas expectativa de linha de base em apps modernas)

- SHOULD implementar CSP como defesa em profundidade contra XSS, compatível com o build React (evitar `unsafe-inline` e `unsafe-eval` salvo estritamente necessário e documentado). ([OWASP Cheat Sheet Series][2])
- SHOULD usar Subresource Integrity (SRI) para qualquer script/estilo de terceiros carregado de CDN (ou self-host). ([MDN Web Docs][7])
- SHOULD ativar defesas contra clickjacking via `frame-ancestors` (CSP) e/ou `X-Frame-Options`, salvo incorporação ser requisito explícito do produto. ([MDN Web Docs][8])

### 3.3 Linha de base para funcionalidades de alto risco (MUST se usadas)

- Se renderizar HTML/markdown/rich text fornecido por utilizadores:
  - MUST sanitizar antes da inserção e evitar sinks DOM crus. ([OWASP Cheat Sheet Series][9])

- Se usar service workers / PWA:
  - MUST servir sobre HTTPS e implementar estratégia segura de cache/atualização (service workers são proxies poderosos de pedidos/respostas). ([MDN Web Docs][10])

---

## 4) Regras (geração + auditoria)

Cada regra contém: prática exigida, padrões inseguros, pistas de deteção e remediação.

### REACT-CONFIG-001: Nunca embutir segredos no bundle cliente (env vars são públicas)

Severity: Critical (se segredos expostos)

Obrigatório:

- MUST NOT colocar segredos em código React, em assets `public/`, ou em variáveis de ambiente de build destinadas ao cliente.
- MUST assumir que qualquer valor acessível à app React em runtime pode ser extraído por um atacante.

Padrões inseguros:

- Usar env vars de build para segredos:
  - `process.env.REACT_APP_*` com chaves privadas ou credenciais.
  - `import.meta.env.VITE_*` com segredos.

- Segredos hardcoded em JS/TS, `.env` commitado, ou segredos em `public/config.json` servido a todos.

Pistas de deteção:

- Procurar:
  - `REACT_APP_`, `VITE_`, `NEXT_PUBLIC_`, `process.env.`, `import.meta.env.`
  - `apiKey`, `secret`, `token`, `private`, `password`, `client_secret`

- Inspecionar `public/` por JSON de config em runtime.

Correção:

- Mover segredos para o servidor (API, BFF, função serverless).
- Usar backend para emitir tokens de curta duração e âmbito limitado se o browser precisar de chamar APIs de terceiros.

Notas:

- O CRA avisa explicitamente para não guardar segredos e que env vars são embutidas no build e visíveis a quem inspeciona ficheiros. ([create-react-app.dev][1])
- O Vite nota que variáveis expostas ao cliente acabam no bundle e não devem conter informação sensível. ([vitejs][11])

---

### REACT-XSS-001: Não usar `dangerouslySetInnerHTML` com conteúdo não confiável (sanitizar ou evitar)

Severity: High (só se for possível provar que HTML controlado pelo atacante chega aqui)

Obrigatório:

- MUST evitar `dangerouslySetInnerHTML` salvo ser absolutamente necessário.
- Se tiver de ser usado:
  - MUST sanitizar HTML não confiável com sanitizador comprovado (ex.: DOMPurify) e configuração orientada a lista de permissões.
  - MUST manter a lógica de sanitização centralizada e muito revista.
  - SHOULD adicionar CSP e considerar Trusted Types (ver REACT-TT-001).

Padrões inseguros:

- `<div dangerouslySetInnerHTML={{ __html: userHtml }} />` com `userHtml` de API/URL/storage.
- “Sanitização” com regexes, remoções ad hoc ou listas de permissões incompletas.

Pistas de deteção:

- Grep: `dangerouslySetInnerHTML`, `__html:`
- Rastrear a origem da string HTML (API/CMS/URL/localStorage).

Correção:

- Substituir por renderização segura:
  - Renderizar dados estruturados como elementos/componentes React em vez de strings HTML.
  - Se rich text for necessário, sanitizar com DOMPurify (ou equivalente) e renderizar a saída sanitizada.

- Adicionar CSP; remover sinks perigosos onde possível.

Notas:

- O React avisa que `dangerouslySetInnerHTML` é perigoso e pode introduzir XSS se mal usado. ([React][12])
- A OWASP aponta `dangerouslySetInnerHTML` do React sem sanitização como armadilha comum de “escape hatch” de frameworks. ([OWASP Cheat Sheet Series][9])
- O DOMPurify descreve-se como sanitizador XSS para HTML/SVG/MathML. ([GitHub][13])

---

### REACT-XSS-002: Confiar no escape por defeito do React; não contornar

Severity: High (quando contornado)

Obrigatório:

- MUST renderizar strings não confiáveis via interpolação JSX normal (`{value}`) e props React, que são escapadas por defeito.
- MUST NOT construir strings HTML a partir de dados não confiáveis e depois injetá-las no DOM por qualquer meio.
- SHOULD tratar qualquer “escape hatch” como alto risco e exigir revisão.

Padrões inseguros:

- Converter texto não confiável em HTML e injetar:
  - `element.innerHTML = userValue`
  - `document.write(userValue)`
  - `insertAdjacentHTML(..., userValue)`

Pistas de deteção:

- Grep por sinks DOM: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser`, `createContextualFragment`.

Correção:

- Renderizar texto via React (JSX) para ser escapado.
- Se HTML for realmente necessário, sanitizar e aplicar REACT-XSS-001 + REACT-TT-001.

Notas:

- A documentação React (JSX) indica que o React DOM escapa valores embutidos em JSX antes de renderizar para ajudar a prevenir injeção. ([React][14])

---

### REACT-DOM-001: Evitar sinks de injeção DOM XSS em código React (usar alternativas seguras)

Severity: High

Obrigatório:

- MUST evitar sinks diretos de injeção DOM, mesmo fora da renderização React, salvo fortemente controlados.
- Se um sink DOM for necessário:
  - MUST garantir que as entradas são confiáveis/validadas/sanitizadas.
  - SHOULD aplicar Trusted Types (REACT-TT-001).

Padrões inseguros:

- `someEl.innerHTML = untrusted`
- `document.write(untrusted)`
- `new DOMParser().parseFromString(untrusted, 'text/html')` seguido de inserção

Pistas de deteção:

- Grep: `innerHTML`, `outerHTML`, `document.write`, `DOMParser`, `Range().createContextualFragment`, `insertAdjacentHTML`

Correção:

- Preferir:
  - `textContent` para inserção de texto.
  - Renderização React em vez de manipulação manual do DOM.
  - Sanitizador revisto para qualquer parse HTML necessário.

Notas:

- A documentação Trusted Types define sinks HTML como `Element.innerHTML` e `document.write()` como sinks de injeção que podem executar script com entrada controlada pelo atacante. ([MDN Web Docs][3])
- A orientação OWASP HTML5 recomenda `textContent` em vez de `innerHTML` para dados não confiáveis. ([OWASP Cheat Sheet Series][4])

---

### REACT-URL-001: Validar e restringir URLs não confiáveis em `href`, `src`, navegação e redirecionamentos

Severity: High apenas quando for possível provar que são controladas pelo atacante

Obrigatório:

- MUST tratar qualquer URL derivada de entrada não confiável como perigosa.
- MUST aplicar lista de permissões a esquemas e (quando aplicável) hosts:
  - Tipicamente permitir só `https:` (e talvez `http:` para localhost/dev) e URLs relativas para navegação na app.
  - MUST bloquear explicitamente `javascript:` e usos perigosos de `data:` salvo validação especializada e caso de uso claro.

- SHOULD preferir caminhos relativos same-site (ex.: `/settings`) a URLs absolutas.
- MUST validar parâmetros “returnTo/next/redirect” (ver REACT-REDIRECT-001).

Padrões inseguros:

- `<img src={userProvidedUrl}>...` (pode servir para tracking / exfil; também arriscado em scripts/iframes)
- `window.location = next`
- `navigate(next)` com `next` de query params sem validação

Pistas de deteção:

- Procurar:
  - `href={`, `src={`, `window.location`, `location.href`, `window.open`, `navigate(`, `redirectTo`, `returnTo`, `next=`

- Rastrear se o valor vem de URL/query/storage/API.

Correção:

- Implementar utilitário partilhado `safeUrl()`:
  - Parse com `new URL(value, base)`
  - Impor lista de permissões de esquema e host (ou same-origin)
  - Para redirecionamentos: permitir só caminhos relativos (a começar por `/`) ou lista estrita de origens absolutas.

- Recuar para destino seguro por defeito quando a validação falhar.

Notas:

- A OWASP nota o risco de `dangerouslySetInnerHTML` no React e que o React não trata com segurança URLs `javascript:` ou `data:` sem validação especializada. ([OWASP Cheat Sheet Series][9])

---

### REACT-MARKUP-001: Renderização Markdown / rich text deve ser configurada com segurança

Severity: Medium

Obrigatório:

- MUST assumir que markdown/rich text pode ser controlado pelo atacante se vier de utilizadores ou CMS.
- MUST garantir que HTML cru não é renderizado salvo sanitização.
- SHOULD preferir renderizadores markdown que:
  - Não permitam HTML cru por defeito, ou
  - Possam ser configurados para desativar HTML cru, ou
  - Sanitizem a saída HTML antes de renderizar.

Padrões inseguros:

- Markdown com “pass-through de HTML cru” ativado (ex.: opções/plugins que permitem HTML).
- Renderizar SVG/MathML/HTML fornecido pelo utilizador inline sem sanitização.

Pistas de deteção:

- Procurar bibliotecas e opções arriscadas:
  - `marked`, `markdown-it`, `react-markdown`, `rehype-raw`, `sanitize: false`, `allowDangerousHtml`, etc.

- Procurar `dangerouslySetInnerHTML` com “saída markdown”.

Correção:

- Desativar pass-through de HTML cru.
- Sanitizar saída com sanitizador comprovado (ex.: DOMPurify) antes de renderizar.

Notas:

- A orientação OWASP sobre XSS sublinha que escape hatches de frameworks exigem encoding de saída e/ou sanitização HTML. ([OWASP Cheat Sheet Series][9])

---

### REACT-TT-001: Usar Trusted Types (com CSP) para endurecer sinks de DOM XSS quando viável

Severity: Low

Obrigatório:

- SHOULD considerar ativar Trusted Types primeiro em modo report-only e só depois impor quando as violações estiverem resolvidas.
- SHOULD centralizar políticas Trusted Types e tratá-las como código de alto risco que exige revisão.
- MUST NOT criar políticas permissivas que apenas “deixam passar” strings não confiáveis.

Padrões inseguros:

- Política Trusted Types que devolve a string crua sem sanitização para sinks HTML.
- Muitas políticas espalhadas pelo código (difícil auditar).

Pistas de deteção:

- Procurar:
  - `trustedTypes.createPolicy`
  - diretivas CSP: `require-trusted-types-for`, `trusted-types`

- Procurar sinks DOM restantes (REACT-DOM-001).

Correção:

- Implementar poucas políticas bem delimitadas:
  - Política HTML com sanitizador (DOMPurify ou equivalente).
  - Política de URL de script com listas de permissões estritas.

- Correr em report-only, corrigir violações, depois impor.

Notas:

- O MDN descreve Trusted Types como forma de garantir que a entrada é transformada (tipicamente sanitizada) antes dos sinks de injeção, destacando sinks HTML (`innerHTML`, `document.write`) e URL JS (`script.src`). ([MDN Web Docs][3])
- A especificação W3C Trusted Types enquadra isto como redução do risco de DOM XSS ao restringir sinks a valores tipados criados por políticas revistas. ([W3C][15])

---

### REACT-CSP-001: Implementar e manter CSP como defesa em profundidade (especialmente com conteúdo não confiável)

Severity: Medium a High

Obrigatório:

- SHOULD implementar CSP em produção; MUST fazê-lo em apps que renderizam conteúdo não confiável ou integram scripts de terceiros.
- SHOULD evitar `unsafe-inline` e `unsafe-eval` quando possível.
- SHOULD usar nonces/hashes CSP para scripts inline se necessário, mantendo a política realista.
- SHOULD usar CSP para exigir/incentivar SRI quando apropriado.

Padrões inseguros:

- Ausência total de CSP na shell da app (HTML de entrada SPA).
- CSP a depender amplamente de `unsafe-inline`/`unsafe-eval` sem justificação.
- `script-src *` ou origens demasiado amplas.

Pistas de deteção:

- Procurar configuração CSP:
  - Config servidor/CDN, cabeçalhos nas respostas `index.html`, ou config do framework.

- Se ausente no repositório, marcar como “verificar no edge”.

Correção:

- Adicionar CSP via cabeçalhos HTTP de resposta (preferido).
- Começar com report-only para reduzir ruturas, depois impor.

Notas:

- A OWASP descreve CSP como “defesa em profundidade” contra XSS e nota que pode ajudar a impor SRI mesmo em sites estáticos, mas não deve ser a única defesa. ([OWASP Cheat Sheet Series][2])

---

### REACT-SRI-001: Usar Subresource Integrity (SRI) para scripts e estilos de terceiros (ou self-host)

Severity: Low

Obrigatório:

- MUST tratar JS de terceiros como equivalente a executar código arbitrário na vossa origem.
- Se carregar de CDN ou terceiro:
  - SHOULD usar SRI (`integrity=...`) e `crossorigin` quando aplicável.
  - SHOULD fixar versões exatas (evitar URLs “latest”).
  - SHOULD preferir self-host para código crítico.

Padrões inseguros:

- `<script src="https://cdn.example.com/lib/latest.js"></script>` sem integridade.
- Tag managers que carregam scripts arbitrários dinamicamente sem governação.

Pistas de deteção:

- Procurar em `public/index.html`, templates ou wrappers SSR:
  - `<script src=`, `<link rel="stylesheet" href=`
  - Snippets de tag manager (GTM, Segment, etc.)

- Identificar scripts carregados dinamicamente em JS em runtime.

Correção:

- Adicionar hashes SRI para assets de terceiros estáveis ou self-host.
- Aplicar controlos de governação a tag managers (ver REACT-3P-001).

Notas:

- O MDN descreve SRI como funcionalidade que permite ao browser verificar que recursos obtidos (ex.: de CDN) não foram manipulados, via hash criptográfico. ([MDN Web Docs][7])
- A orientação OWASP sobre CSP nota que CSP pode impor SRI e é útil mesmo em sites estáticos. ([OWASP Cheat Sheet Series][2])

---

### REACT-3P-001: JavaScript de terceiros e tag managers devem ser minimizados e governados

Severity: High

Obrigatório:

- MUST minimizar scripts de terceiros e tratar cada um como risco na cadeia de fornecimento.
- MUST saber exatamente que JS de terceiros executa na vossa origem e porquê.
- SHOULD implementar governação:
  - Rever e fixar versões (ou espelhar internamente).
  - Restringir acesso a dados (abordagem data-layer).
  - Usar SRI e CSP; considerar sandbox de UI não confiável em iframes quando possível.

Padrões inseguros:

- Scripts de analytics/anúncios não revistos com acesso total a DOM, cookies, storage e dados do utilizador.
- Tag managers alteráveis por perfis não de engenharia sem controlo de mudanças.

Pistas de deteção:

- Procurar snippets de fornecedores comuns em HTML/JS:
  - GTM, Segment, Hotjar, FullStory, etc.

- Procurar inserção dinâmica de script:
  - `document.createElement('script')`, `.src = ...`, `.appendChild(script)`

Correção:

- Reduzir a fornecedores estritamente necessários.
- Quando viável:
  - Self-host ou espelhar scripts.
  - Usar SRI.
  - Limitar exposição de dados via data layer controlado.

Notas:

- A OWASP nota que compromisso do servidor de JS de terceiros pode injetar JS malicioso, e destaca riscos como execução arbitrária e divulgação de informação sensível a terceiros. ([OWASP Cheat Sheet Series][5])

---

### REACT-AUTH-001: Tratamento de tokens e sessão deve ser resiliente a XSS (evitar storage sensível em Web Storage)

Severity: Medium

Obrigatório:

- SHOULD evitar guardar identificadores de sessão ou tokens de longa duração em `localStorage` (e em geral em Web Storage) porque XSS pode exfiltrar.
- Se tokens tiverem de existir no cliente:
  - SHOULD preferir armazenamento em memória com vida curta e mecanismos de refresh.
  - MUST definir âmbito e rodar tokens; evitar bearer tokens de longa duração em storage persistente.

- SHOULD preferir cookies HTTPOnly para tokens de sessão quando possível (exige estratégia CSRF: ver REACT-CSRF-001).

Padrões inseguros:

- `localStorage.setItem('token', ...)` / `sessionStorage.setItem('token', ...)` para tokens de auth.
- Persistir refresh tokens em `localStorage`.
- Tratar dados de Web Storage como confiáveis.

Pistas de deteção:

- Grep: `localStorage.`, `sessionStorage.`, `setItem(`, `getItem(`, `token`, `jwt`, `refresh`
- Procurar em código de auth “remember me” que persiste tokens.

Correção:

- Passar para cookies HTTPOnly (mudança no servidor) + proteções CSRF, ou tokens de curta duração só em memória.
- Reduzir âmbito e tempo de vida dos tokens.

Notas:

- A orientação OWASP HTML5 recomenda evitar informação sensível e identificadores de sessão em local storage e alerta que um XSS pode roubar tudo no Web Storage. ([OWASP Cheat Sheet Series][4])
- A orientação OAuth para apps baseadas em browser discute que tokens em storage persistente como localStorage podem ser acessíveis a JS malicioso (ex.: via XSS). ([IETF Datatracker][16])

---

### REACT-CSRF-001: Pedidos com cookie que alteram estado MUST ser protegidos contra CSRF

Severity: High

NOTA: Se a aplicação não usar auth baseada em cookie (ex.: cabeçalho Authorization), CSRF não é preocupação.

Obrigatório:

- Se a app depender de cookies para autenticação:
  - MUST proteger pedidos que alteram estado (POST/PUT/PATCH/DELETE) contra CSRF.
  - SHOULD incluir mecanismo de token CSRF (token sincronizador ou double-submit cookie) ou outro padrão robusto adequado ao backend.
  - SHOULD usar cookies SameSite como defesa em profundidade, não como única defesa.

Padrões inseguros:

- `fetch('/api/transfer', { method: 'POST', credentials: 'include' })` sem token/cabeçalho CSRF, a depender só de cookies.
- Usar GET para operações que alteram estado.

Pistas de deteção:

- Enumerar chamadas de rede que alteram estado e verificar:
  - Uso de `credentials: 'include'` ou `withCredentials: true`?
  - Inclusão de cabeçalho de token CSRF (ex.: `X-CSRF-Token`)?

- Procurar utilitários “csrf”; se ausentes, tratar como suspeito.

Correção:

- Adicionar fluxo de token CSRF:
  - Obter token de endpoint seguro e anexar a pedidos que alteram estado.
  - Validar no servidor.

- Manter cookies SameSite e validação Origin/Referer como defesa em profundidade.

Notas:

- A orientação OWASP CSRF explica o comportamento SameSite (Lax/Strict/None) como defesa em profundidade e porque Lax é muitas vezes o equilíbrio usabilidade/segurança, mas não substitui proteções CSRF completas. ([OWASP Cheat Sheet Series][6])

---

### REACT-AUTHZ-001: Não depender só de autorização no frontend

Severity: High (só se usada como proteção principal)

Obrigatório:

- MUST tratar todas as verificações de autorização no frontend como apenas UX.
- MUST impor autorização no servidor para qualquer recurso ou ação protegida.

Padrões inseguros:

- Ações “protegidas” ocultas na UI mas invocáveis na API sem verificações no servidor.
- Verificações no cliente como `if (user.isAdmin) { showAdminPanel(); }` sem enforcement no servidor.

Pistas de deteção:

- Procurar gating de UI em torno de ações sensíveis e verificar que os endpoints no servidor impõem autorização.
- Numa auditoria só frontend, reportar como “verificações no cliente não são segurança; verificar backend”.

Correção:

- Adicionar/confirmar verificações de autorização no servidor.
- Manter gating no frontend só como conveniência.

Notas:

- Propriedade geral de segurança de apps web; o React por si só não protege recursos no servidor.

---

### REACT-NET-001: Impedir exfiltração de dados e fugas de credenciais via pedidos de saída dinâmicos

Severity: Medium a High

Obrigatório:

- MUST evitar pedidos autenticados para origens controladas pelo atacante.
- SHOULD evitar que input do utilizador controle o destino do pedido (esquema/host/porta).
- SHOULD centralizar clientes de rede (fetch/axios) com:
  - `baseURL` fixo (ou lista de permissões estrita),
  - tratamento estrito de redirecionamentos,
  - uso explícito de `credentials`.

Padrões inseguros:

- `fetch(userProvidedUrl, { credentials: 'include' })`
- `axios.create({ baseURL: userProvidedBase })`
- Funcionalidades “fetch/preview de URL” no cliente que acedem a domínios arbitrários com cabeçalhos sensíveis.

Pistas de deteção:

- Procurar `fetch(` / `axios(` onde o primeiro argumento ou `baseURL` vem de:
  - query params, localStorage, respostas API, postMessage

- Procurar `credentials: 'include'`, `withCredentials: true`.

Correção:

- Impor listas de permissões de destino; desautorizar pedidos cross-origin salvo ser explicitamente necessário.
- Remover credenciais/cabeçalhos Authorization para destinos fora da lista.

Notas:

- Mesmo com limites do browser a comportamento cross-origin, fugas de tokens/cabeçalhos para endpoints não confiáveis continuam a ser falha comum.

---

### REACT-REDIRECT-001: Impedir redirecionamentos abertos e navegação não confiável

Severity: Medium

Obrigatório:

- MUST validar alvos de redirecionamento/navegação derivados de entrada não confiável (`next`, `returnTo`, `redirect`).
- SHOULD permitir apenas caminhos relativos same-site, ou lista estrita de origens confiáveis para URLs absolutas.

Padrões inseguros:

- `window.location.href = new URLSearchParams(location.search).get('next')`
- `navigate(next)` com `next` de query params.

Pistas de deteção:

- Procurar: `next`, `returnTo`, `redirect`, `window.location`, `navigate(`
- Rastrear origem do alvo de redirecionamento.

Correção:

- Permitir apenas caminhos relativos (`/^\/[^\s]*$/`) ou origens na lista de permissões.
- Recuar para destino seguro por defeito (ex.: `/`) quando inválido.

Notas:

- Redirecionamentos abertos são frequentes em phishing e podem minar fluxos SSO/OAuth.

---

### REACT-SW-001: Service workers são altamente privilegiados; exigir HTTPS e regras seguras de cache/atualização

Severity: Medium

Obrigatório:

- MUST servir service workers sobre HTTPS (exceto dev em `localhost`) e implementar só em contextos seguros.
- MUST evitar cachear respostas de API autenticadas sensíveis salvo desenho e modelo de ameaça explícitos.
- SHOULD implementar estratégia segura de atualização (recarregar com prompt, caches versionados, remover caches antigos no activate).

Padrões inseguros:

- Registar service worker numa app autenticada e cachear “tudo” indiscriminadamente.
- Caches de longa duração com PII ou conteúdo específico de utilizador partilhado entre contas.

Pistas de deteção:

- Procurar:
  - `navigator.serviceWorker.register`
  - `workbox`, `precacheAndRoute`, handlers `fetch` custom

- Inspecionar padrões de cache (`caches.open`, `cache.put`, `respondWith`).

Correção:

- Restringir cache a assets estáticos (JS/CSS/imagens) salvo modelo offline desenhado.
- Garantir chaves de cache por utilizador se dados específicos de utilizador tiverem de ser cacheados.
- Fornecer mecanismo claro de atualização.

Notas:

- O MDN nota que service workers exigem HTTPS por razões de segurança e atuam como proxy de pedidos/respostas. ([MDN Web Docs][10])
- “Contextos seguros” impedem que atacantes MITM acedam a APIs poderosas; service workers são exemplo de tal funcionalidade. ([MDN Web Docs][18])

---

### REACT-HEADERS-001: Garantir cabeçalhos de segurança essenciais na shell React da app (app ou edge)

Severity: Medium

Obrigatório (SPA típica servida a partir de uma origem):

- SHOULD definir:
  - CSP (`Content-Security-Policy`)
  - `X-Content-Type-Options: nosniff`
  - Proteção contra clickjacking (`frame-ancestors` no CSP e/ou `X-Frame-Options`)
  - `Referrer-Policy`
  - `Permissions-Policy` conforme apropriado

- MUST garantir que estes cabeçalhos estão definidos algures (CDN/edge/servidor), mesmo que não no repositório.

Padrões inseguros:

- Ausência total de cabeçalhos de segurança (app ou edge).
- CSP em falta em apps que renderizam conteúdo não confiável ou usam scripts de terceiros.

Pistas de deteção:

- Verificar config servidor/CDN no repositório (nginx, Cloudflare, Vercel, etc.).
- Se ausente, sinalizar como “verificar em runtime/edge”.

Correção:

- Definir cabeçalhos centralmente no edge.
- Manter CSP realista e iterativo (report-only → imposição).

Notas:

- A orientação MDN sobre clickjacking abrange defesas incluindo `X-Frame-Options` e CSP `frame-ancestors`. ([MDN Web Docs][8])
- A orientação OWASP CSP explica entrega via cabeçalhos de resposta e recomenda cabeçalhos como mecanismo preferido. ([OWASP Cheat Sheet Series][2])

---

### REACT-POSTMSG-001: `postMessage` deve validar origem e tratar o payload como dados não confiáveis

Severity: Medium a High (depende do que as mensagens podem fazer)

Obrigatório:

- MUST especificar `targetOrigin` exato ao enviar mensagens (não `*`) salvo razão estrita.
- MUST validar `event.origin` à receção e validar a forma da mensagem.
- MUST NOT avaliar dados da mensagem como código nem inseri-los no DOM como HTML.

Padrões inseguros:

- `window.postMessage(data, '*')` para alvos desconhecidos.
- À receção:
  - `window.addEventListener('message', (e) => { eval(e.data) })`
  - `element.innerHTML = e.data`

Pistas de deteção:

- Procurar: `postMessage(`, `addEventListener('message'`
- Verificar verificações de origem e tratamento seguro.

Correção:

- Adicionar listas de permissões de origem estritas e validação de esquema (ex.: zod).
- Tratar o payload estritamente como dados; renderizar com segurança via React.

Notas:

- A orientação OWASP HTML5 recomenda especificar origem esperada em `postMessage`, verificar origem do remetente, validar dados e evitar eval/innerHTML com conteúdo de mensagens. ([OWASP Cheat Sheet Series][4])

---

### REACT-FILE-001: Uploads de ficheiros e pré-visualizações não devem criar vulnerabilidades de conteúdo ativo no cliente

Severity: Medium (pode ser High se stored-XSS for possível)

Obrigatório:

- MUST tratar ficheiros carregados pelo utilizador e pré-visualizações como potencialmente maliciosos.
- MUST NOT renderizar HTML/SVG/outro conteúdo ativo carregado inline salvo sanitização e requisito explícito.
- SHOULD validar tipos de ficheiro no cliente para UX, mas MUST confiar na validação no servidor para segurança.

Padrões inseguros:

- Renderizar HTML carregado pelo utilizador como conteúdo.
- Renderização inline de SVG/HTML não confiável via `dangerouslySetInnerHTML` ou `<iframe srcdoc=...>` sem sanitização.

Pistas de deteção:

- Procurar componentes de upload e lógica de preview:
  - `input type="file"`, `FileReader`, `URL.createObjectURL`, `<iframe>`, `<object>`, `<embed>`.

- Rastrear onde o conteúdo carregado é mostrado depois.

Correção:

- Restringir tipos aceites, sanitizar quando necessário, preferir fluxos de download/anexo para tipos arriscados.
- Garantir que o servidor impõe a política real (tipo, renomear, scanning, armazenar fora da webroot).

Notas:

- A orientação OWASP sobre upload destaca lista de permissões de extensões, validação de tipo, nomes de ficheiro gerados, limite de tamanho, armazenamento fora da webroot, e conteúdo ativo no cliente (XSS, CSRF, etc.) quando os ficheiros são publicamente recuperáveis. ([OWASP Cheat Sheet Series][19])

---

### REACT-SUPPLY-001: Higiene de dependências e cadeia de fornecimento (frontend + tooling de build)

Severity: Low

Obrigatório:

- MUST usar lockfile e impor instalações reprodutíveis na CI.
- SHOULD auditar dependências regularmente e reagir rapidamente a avisos para:
  - React, react-dom, libs de router, tooling de build (Vite/Webpack), sanitizadores, libs de auth, etc.

- SHOULD reduzir exposição a ataques em scripts de instalação e risco de typosquatting.

Foco de auditoria:

- A CI deve usar `npm ci` (ou Yarn frozen lockfile / equivalente pnpm) para evitar deriva.
- Usar varredura de vulnerabilidades (`npm audit`, Dependabot/alertas GitHub, etc.).

Padrões inseguros:

- Sem lockfile ou lockfile ignorado na CI.
- `npm install` na CI gerando builds não reprodutíveis.
- Dependências de alto risco não fixadas ou não revistas; atualizações major súbitas sem revisão.
- Executar cegamente scripts de instalação de pacotes de terceiros.

Pistas de deteção:

- Verificar lockfiles: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`.
- Verificar scripts CI: `npm install` vs `npm ci`.
- Procurar scripts `postinstall` e passos de build suspeitos.

Correção:

- Usar lockfile e impor na CI (ex.: `npm ci`).
- Correr auditorias regularmente; fixar/atualizar com responsabilidade.
- Considerar restringir scripts de instalação quando viável.

Notas:

- A documentação npm descreve `npm audit` como envio da árvore de dependências ao registry para relatório de vulnerabilidades conhecidas e (opcionalmente) remediações via `npm audit fix`, notando que algumas vulnerabilidades exigem revisão manual. ([npm Docs][20])
- A documentação npm descreve `npm ci` como destinado a ambientes automatizados/CI, exigindo lockfile existente e falhando se `package.json` e lockfile não coincidirem. ([npm Docs][21])
- A orientação OWASP NPM recomenda impor o lockfile e cita explicitamente `npm ci` / `yarn install --frozen-lockfile` para abortar em inconsistências, e destaca o risco de scripts em tempo de instalação e a opção `--ignore-scripts` para reduzir superfície de ataque. ([OWASP Cheat Sheet Series][22])

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Em varredura ativa, usar estes padrões de alto sinal:

- HTML cru / escape hatches XSS:
  - `dangerouslySetInnerHTML`, `__html:`
  - Flags de pass-through HTML em Markdown: `rehype-raw`, `allowDangerousHtml`, `sanitize: false`

- Sinks DOM XSS:
  - `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser`, `createContextualFragment`

- Execução JS perigosa:
  - `eval(`, `new Function(`, `setTimeout("`, `setInterval("`

- Injeção de URL / navegação não confiável:
  - `href={` / `src={` com valores não confiáveis
  - `window.location`, `location.href`, `window.open`, `navigate(`
  - Query params: `next`, `returnTo`, `redirect`

- Risco token/sessão:
  - `localStorage.setItem`, `sessionStorage.setItem`, `getItem(` com `token`, `jwt`, `refresh`

- Acoplamento cookie/CSRF:
  - `credentials: 'include'`, `withCredentials: true` em pedidos que alteram estado sem cabeçalhos CSRF

- Scripts de terceiros:
  - `<script src=...>` em `public/index.html`
  - Snippets de tag manager e inserção dinâmica de script

- Service workers:
  - `navigator.serviceWorker.register`, uso Workbox, handlers `fetch` custom

- postMessage:
  - `postMessage(` com `*`, ausência de verificações de `event.origin`

- Cadeia de fornecimento:
  - Lockfile em falta, CI com `npm install`, sem passo de audit, scripts postinstall arriscados

Sempre tentar confirmar:

- origem dos dados (não confiável vs confiável)
- tipo de sink (escape hatch React vs sink DOM vs navegação vs storage)
- controlos de proteção presentes (sanitização, listas de permissões, CSP/Trusted Types, tokens CSRF, cabeçalhos, governação)

---

## 6) Fontes (consultadas em 2026-01-26)

Documentação principal React:

- Anúncio estável React 19 — `https://react.dev/blog/2024/12/05/react-19` ([React][23])
- Documentação React DOM: aviso `dangerouslySetInnerHTML` — `https://react.dev/reference/react-dom/components/common#dangerouslysetting-the-inner-html` ([React][12])
- React (legado) afirmação sobre escape em JSX — `https://legacy.reactjs.org/docs/introducing-jsx.html` ([React][14])

OWASP Cheat Sheet Series:

- Cross Site Scripting Prevention (escape hatches de frameworks; React `dangerouslySetInnerHTML`; notas sobre validação de URL) — `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][9])
- Content Security Policy — `https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][2])
- Cross-Site Request Forgery Prevention — `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][6])
- HTML5 Security (Web Storage, postMessage, tabnabbing, frames com sandbox) — `https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][4])
- Third Party JavaScript Management — `https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][5])
- File Upload — `https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][19])
- NPM Security best practices — `https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][22])

Referências browser / plataforma (MDN, W3C):

- Trusted Types API — `https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API` ([MDN Web Docs][3])
- Especificação W3C Trusted Types — `https://www.w3.org/TR/trusted-types/` ([W3C][15])
- Subresource Integrity — `https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity` ([MDN Web Docs][7])
- Visão geral defesas contra clickjacking — `https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Clickjacking` ([MDN Web Docs][8])
- Using Service Workers (requisito HTTPS; comportamento tipo proxy) — `https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers` ([MDN Web Docs][10])
- Contextos seguros (APIs poderosas restritas a HTTPS) — `https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts` ([MDN Web Docs][18])
- Valores de `rel` em links (noopener/noreferrer) — `https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel` ([MDN Web Docs][17])

Build tooling / exposição de env:

- Aviso Create React App sobre variáveis de ambiente — `https://create-react-app.dev/docs/adding-custom-environment-variables/` ([create-react-app.dev][1])
- Notas Vite sobre segurança de variáveis de ambiente — `https://vite.dev/guide/env-and-mode` ([vitejs][11])

Orientação auth/armazenamento de tokens:

- OAuth 2.0 for Browser-Based Apps (discussão de armazenamento de tokens) — `https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps` ([IETF Datatracker][16])

Ferramentas de dependências:

- Documentação npm audit — `https://docs.npmjs.com/cli/v10/commands/npm-audit/` ([npm Docs][20])
- Documentação npm ci — `https://docs.npmjs.com/cli/v10/commands/npm-ci/` ([npm Docs][21])

Referência de sanitizador:

- DOMPurify — `https://github.com/cure53/DOMPurify` ([GitHub][13])

[1]: https://create-react-app.dev/docs/adding-custom-environment-variables/ 'Adding Custom Environment Variables | Create React App'
[2]: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html 'Content Security Policy - OWASP Cheat Sheet Series'
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API 'Trusted Types API - Web APIs | MDN'
[4]: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html 'HTML5 Security - OWASP Cheat Sheet Series'
[5]: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html 'Third Party Javascript Management - OWASP Cheat Sheet Series'
[6]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html 'Cross-Site Request Forgery Prevention - OWASP Cheat Sheet Series'
[7]: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity 'Subresource Integrity - Security | MDN'
[8]: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Clickjacking 'Clickjacking - Security | MDN'
[9]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html 'Cross Site Scripting Prevention - OWASP Cheat Sheet Series'
[10]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers 'Using Service Workers - Web APIs | MDN'
[11]: https://vite.dev/guide/env-and-mode 'Env Variables and Modes | Vite'
[12]: https://react.dev/reference/react-dom/components/common 'Common components (e.g. <div>) – React'
[13]: https://github.com/cure53/DOMPurify 'GitHub - cure53/DOMPurify: DOMPurify - a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG. DOMPurify works with a secure default, but offers a lot of configurability and hooks. Demo:'
[14]: https://legacy.reactjs.org/docs/introducing-jsx.html 'Introducing JSX – React'
[15]: https://www.w3.org/TR/trusted-types/ 'Trusted Types'
[16]: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps '
            
                draft-ietf-oauth-browser-based-apps-26
            
        '
[17]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel 'HTML attribute: rel - HTML | MDN'
[18]: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts 'Secure contexts - Security | MDN'
[19]: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html 'File Upload - OWASP Cheat Sheet Series'
[20]: https://docs.npmjs.com/cli/v10/commands/npm-audit 'npm-audit | npm Docs'
[21]: https://docs.npmjs.com/cli/v10/commands/npm-ci 'npm-ci | npm Docs'
[22]: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html 'NPM Security - OWASP Cheat Sheet Series'
[23]: https://react.dev/blog/2024/12/05/react-19 'React v19 – React'
