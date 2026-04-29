# Especificação de segurança web para JavaScript/TypeScript no frontend (JS/TS em browser moderno, sem framework específico)

Este documento é uma **especificação de segurança** que suporta:

1. **Geração de código secure-by-default** para novo JavaScript/TypeScript no frontend (sem assumir um framework concreto).
2. **Revisão de segurança / caça a vulnerabilidades** em código frontend existente (modo passivo “avisar enquanto se trabalha” e modo ativo “varrer o repositório e reportar”).

Está escrito de propósito como **requisitos normativos** (“MUST/SHOULD/MAY”) mais **regras de auditoria** (como maus padrões se manifestam, como detetar e como corrigir/atenuar).

---

## 0) Segurança, limites e restrições anti-abuso (MUST FOLLOW)

- MUST NOT pedir, mostrar, registar em log, hardcodificar ou commitar segredos (chaves API secretas, chaves privadas, passwords, refresh tokens OAuth, tokens de sessão, cookies).
  Notas:
  - Código frontend é observável pelos utilizadores finais. O que tiver de permanecer secreto não pode ir em código entregue ao browser.
  - Se o projeto usa chaves “públicas” (ex.: analytics publicável), MUST tratá-las como não secretas e com âmbito restrito.

- MUST NOT “corrigir” segurança desativando proteções (ex.: enfraquecer CSP com `unsafe-inline`/`unsafe-eval` sem justificação, remover verificações de origem em `postMessage`, usar `innerHTML` por conveniência, aceitar redirecionamentos/URLs arbitrários ou desligar sanitização).

- MUST fornecer **achados baseados em evidência** nas auditorias: citar caminhos de ficheiro, excertos de código e valores HTML/CSP/config relevantes que sustentem a conclusão.

- MUST tratar a incerteza com honestidade:
  - Cabeçalhos de segurança (CSP, frame-ancestors, etc.) podem estar no servidor/edge/CDN e não no repositório. Se não forem visíveis, reportar como “não visível aqui; verificar em runtime/config no edge”. (Nota: `<meta http-equiv=...>` só simula um subconjunto de cabeçalhos; não assumir que outros cabeçalhos existem só porque há uma meta tag.) ([MDN Web Docs][1])

---

## 1) Modos de operação

### 1.1 Modo geração (predefinido)

Quando for pedido para escrever novo código JS/TS de frontend ou alterar o existente:

- MUST cumprir todos os requisitos **MUST** desta especificação.
- SHOULD cumprir todos os **SHOULD** salvo indicação explícita em contrário do utilizador.
- MUST preferir APIs de browser seguras por defeito e bibliotecas comprovadas em vez de código de segurança artesanal (especialmente para sanitização HTML).
- MUST evitar introduzir novos sinks de risco (sinks de injeção DOM XSS como `innerHTML`, navegação para URLs `javascript:`, execução dinâmica via `eval`/`Function`, `postMessage` inseguro, carregamento inseguro de scripts de terceiros, etc.). ([OWASP Cheat Sheet Series][2])

### 1.2 Modo revisão passiva (sempre ativo enquanto se edita)

Enquanto se trabalha em qualquer parte de um repositório frontend (mesmo sem pedido explícito de varrimento de segurança):

- MUST “reparar” em violações desta especificação no código tocado ou próximo.
- SHOULD mencionar problemas à medida que surgem, com explicação breve + correção segura.

### 1.3 Modo auditoria ativa (pedido explícito de varrimento)

Quando o utilizador pedir para “varrer”, “auditar” ou “procurar vulnerabilidades”:

- MUST procurar sistematicamente no código violações desta especificação.
- MUST apresentar achados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada HTML (`index.html`, templates renderizados no servidor), inclusão de scripts/estilos e entrega de CSP (cabeçalho vs meta). ([W3C][3])
2. Sinks DOM XSS (`innerHTML`, `document.write`, `insertAdjacentHTML`, atributos de event handlers) e origens dos dados (parâmetros/hash de URL, storage, postMessage, respostas de API). ([OWASP Cheat Sheet Series][2])
3. Navegação/redirecionamentos (`window.location*`, alvos de links, listas de permissão de URL) incluindo riscos de URLs `javascript:`. ([MDN Web Docs][4])
4. Comunicação cross-origin (`postMessage`, padrões de iframes, sandboxing). ([MDN Web Docs][5])
5. Armazenamento de dados sensíveis (localStorage/sessionStorage) e pressupostos de confiança. ([OWASP Cheat Sheet Series][6])
6. Scripts de terceiros / tag managers / CDNs, controlos de integridade (SRI) e políticas (CSP). ([OWASP Cheat Sheet Series][7])
7. Gadgets de DOM clobbering e dependência insegura de propriedades nomeadas em `window`/`document`. ([OWASP Cheat Sheet Series][8])

---

## 2) Definições e orientação de revisão

### 2.1 Entrada não confiável (tratar como controlada pelo atacante salvo prova em contrário)

Exemplos:

- Dados derivados da URL: `location.href`, `location.search`, `location.hash`, `document.baseURI`, `new URLSearchParams(location.search)`, fragmentos de roteamento. ([OWASP Cheat Sheet Series][2])
- Conteúdo DOM que pode incluir markup controlado pelo utilizador (comentários, perfis, conteúdo CMS, saída markdown→HTML, etc.), especialmente se inserido dinamicamente. ([OWASP Cheat Sheet Series][2])
- Dados de eventos `postMessage` (`event.data`) e metadados (`event.origin`) de outras janelas/iframes. ([MDN Web Docs][5])
- Storage do browser: `localStorage`, `sessionStorage`, IndexedDB (o conteúdo pode ser influenciado por XSS ou acesso local; nunca tratar como “confiável”). ([OWASP Cheat Sheet Series][6])
- Qualquer dado devolvido por chamadas de rede (mesmo da “vossa API”), pois pode conter conteúdo de atacante armazenado que só se torna perigoso ao inserir no DOM. ([OWASP Cheat Sheet Series][2])

### 2.2 Sink perigoso (DOM XSS / execução de código)

Um sink é qualquer API/operação que pode executar script ou interpretar cadeias controladas pelo atacante como HTML/JS/URL de forma sensível à segurança. Sinks de alto sinal incluem:

- Parsing / inserção HTML: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `document.writeln`. ([OWASP Cheat Sheet Series][2])
- Execução dinâmica de código: `eval`, `new Function`, `setTimeout("...")`, `setInterval("...")`. ([MDN Web Docs][10])
- Navegação para URLs com script (ex.: `javascript:`) via setters como `Location.href`/`window.location` (e via `href` de links se controlado pelo atacante). ([MDN Web Docs][4])
- Definir atributos de event handler a partir de strings, ex.: `setAttribute("onclick", "...")`. ([OWASP Cheat Sheet Series][2])

### 2.3 Formato obrigatório de achado de auditoria

Para cada problema encontrado, produzir:

- Rule ID:
- Severity: Critical / High / Medium / Low
- Location: caminho do ficheiro + função/classe/módulo + linha(s)
- Evidence: excerto exato de código/config
- Impact: o que pode correr mal, quem pode explorar
- Fix: alteração segura (preferir diff mínimo)
- Mitigation: defesa em profundidade se a correção imediata for difícil
- False positive notes: o que verificar em caso de dúvida

---

## 3) Linha de base segura: configuração mínima em produção (MUST em produção)

É a linha de base mínima que evita erros de configuração de segurança JS/TS comuns no frontend. Alguns itens estão “no repo” (HTML/JS) e outros podem estar no servidor/edge.

### 3.1 Linha de base Content Security Policy (CSP) (SHOULD; MUST para apps de alto risco)

- SHOULD entregar CSP via cabeçalhos HTTP de resposta sempre que possível.
- MAY entregar CSP via tag HTML `<meta http-equiv="Content-Security-Policy" ...>` quando não for possível definir cabeçalhos (ex.: alojamento estático). ([MDN Web Docs][1])
- Se CSP for via `<meta http-equiv>`, MUST compreender as limitações:
  - A política só se aplica ao conteúdo que segue o elemento meta (deve aparecer muito cedo, antes de scripts/recursos a governar). ([W3C][3])
  - As seguintes diretivas **não são suportadas** em política entregue por meta e serão ignoradas: `report-uri`, `frame-ancestors` e `sandbox`. ([W3C][3])
  - CSP “report-only” não pode ser definida via elemento meta. ([W3C][3])

Objetivos práticos de linha de base:

- Evitar fontes de script `unsafe-inline` e `unsafe-eval` (enfraquecem muito o CSP contra XSS). ([MDN Web Docs][10])
- Preferir políticas de script com nonce ou hash se forem necessários scripts inline. ([MDN Web Docs][10])
- Considerar ativar enforcement de Trusted Types quando viável. ([MDN Web Docs][11])

### 3.2 Linha de base de scripts de terceiros (SHOULD)

- SHOULD minimizar execução de scripts de terceiros e tratá-los como privilégio equivalente ao JS first-party (correm com os privilégios da vossa origem). ([OWASP Cheat Sheet Series][7])
- SHOULD usar Subresource Integrity (SRI) para scripts/estilos de terceiros carregados de CDNs. ([MDN Web Docs][12])

### 3.3 Linha de base de comunicação entre janelas (SHOULD)

- SHOULD restringir comunicações `postMessage` a origens explícitas e validar origem e forma da mensagem. ([MDN Web Docs][5])

---

## 4) Regras (geração + auditoria)

Cada regra contém: prática exigida, padrões inseguros, pistas de deteção e remediação.

### JS-XSS-001: Não injetar HTML não confiável no DOM (evitar `innerHTML` e similares)

Severity: Critical se for possível provar que entrada controlada pelo atacante chega a estas APIs; caso contrário Medium

Obrigatório:

- MUST tratar `innerHTML`, `outerHTML` e `insertAdjacentHTML` como sinks perigosos quando a entrada pode conter dados não confiáveis. ([OWASP Cheat Sheet Series][2])
- MUST preferir APIs DOM seguras que não fazem parse de HTML:
  - `textContent` para texto. ([OWASP Cheat Sheet Series][2])
  - `document.createElement`, `appendChild`, `setAttribute` para atributos que não sejam handlers de eventos. ([OWASP Cheat Sheet Series][2])

- Se a inserção de HTML for realmente necessária, SHOULD sanitizar com um sanitizador HTML bem revisto e considerar fortemente Trusted Types para confinar o uso a caminhos de código auditados. ([MDN Web Docs][11])

Padrões inseguros:

- `el.innerHTML = userInput`
- `el.insertAdjacentHTML('beforeend', userInput)`
- `el.outerHTML = userInput`

Pistas de deteção:

- Procurar: `.innerHTML`, `.outerHTML`, `insertAdjacentHTML(`.
- Rastrear a origem da cadeia inserida: parâmetros/hash de URL, postMessage, storage, respostas de API, atributos DOM. ([OWASP Cheat Sheet Series][2])

Correção:

- Substituir por `textContent` para texto simples. ([OWASP Cheat Sheet Series][2])
- Para UI estruturada, construir nós DOM explicitamente.
- Para requisitos de “rich text”:
  - Sanitizar com sanitizador baseado em lista de permissões.
  - Preferir devolver “componentes” seguros em vez de strings HTML arbitrárias.
  - Usar enforcement de Trusted Types para que só `TrustedHTML` chegue aos sinks onde suportado. ([MDN Web Docs][11])

Mitigação:

- Implementar CSP estrito e considerar Trusted Types (`require-trusted-types-for 'script'`). ([MDN Web Docs][10])

Notas de falso positivo:

- Se for demonstrável que a cadeia é constante ou gerada só a partir de constantes confiáveis, pode ser segura. Mesmo assim preferir APIs mais seguras.

---

### JS-XSS-002: Evitar `document.write` / `document.writeln` (XSS + riscos de DOM clobbering)

Severity: Critical se for possível provar que entrada controlada pelo atacante chega a estas APIs; caso contrário Medium

Obrigatório:

- MUST evitar `document.write()` e `document.writeln()` em código de produção (são vetores de XSS e podem ser abusados com HTML manipulado, mesmo que alguns browsers bloqueiem `<script>` injetado em certas situações). ([MDN Web Docs][13])
- Se o uso legado for inevitável, MUST garantir que nenhuma entrada não confiável chega a estas APIs e SHOULD aplicar Trusted Types (`TrustedHTML`) onde suportado. ([MDN Web Docs][14])

Padrões inseguros:

- `document.write(userInput)`
- `document.writeln(getParam('q'))`

Pistas de deteção:

- Procurar `document.write(`, `document.writeln(`. ([OWASP Cheat Sheet Series][2])

Correção:

- Substituir por manipulação DOM (`createElement`, `appendChild`) ou inserção segura de texto (`textContent`). ([OWASP Cheat Sheet Series][2])

Mitigação:

- CSP estrito + enforcement de Trusted Types reduz o impacto se um sink permanecer. ([MDN Web Docs][10])

---

### JS-XSS-003: Não usar execução de código a partir de strings (`eval`, `new Function`, timeouts com string)

Severity: Critical se for possível provar que entrada controlada pelo atacante chega a estas APIs; caso contrário Medium

Obrigatório:

- MUST NOT enviar dados não confiáveis para:
  - `eval()`
  - `new Function(...)`
  - `setTimeout("...")` / `setInterval("...")` com argumentos string ([MDN Web Docs][10])

- SHOULD evitar estas APIs por completo em frontend moderno; refatorar para lógica sem eval. ([MDN Web Docs][10])
- MUST NOT “corrigir quebra de CSP” adicionando `unsafe-eval` salvo justificação documentada, revista e controlos compensatórios. ([MDN Web Docs][10])

Padrões inseguros:

- `eval(userInput)`
- `new Function("return " + userInput)()`
- `setTimeout(userInput, 0)` onde userInput é uma string

Pistas de deteção:

- Procurar `eval(`, `new Function`, `setTimeout("`, `setInterval("`.
- Procurar também construção de strings de código usadas mais tarde.

Correção:

- Substituir código dinâmico por:
  - dados estruturados + ramificação/handlers explícitos,
  - parse JSON (`JSON.parse`) em vez de `eval` para JSON. ([OWASP Cheat Sheet Series][2])

Mitigação:

- CSP que bloqueia APIs tipo `eval()` por predefinição e evitar `unsafe-eval`. ([MDN Web Docs][10])
- Considerar Trusted Types para casos controlados, mas tratá-lo como camada de endurecimento, não como licença para manter padrões com eval. ([MDN Web Docs][10])

---

### JS-XSS-004: Não definir atributos de handler de eventos a partir de strings (ex.: `setAttribute("onclick", "...")`)

Severity: High

Obrigatório:

- MUST NOT usar `setAttribute("on…", string)` ou padrões semelhantes com dados não confiáveis; isto força strings a tornarem-se código executável no contexto de handler de eventos. ([OWASP Cheat Sheet Series][2])
- SHOULD preferir `addEventListener` com referências a funções.

Padrões inseguros:

- `el.setAttribute("onclick", userInput)`
- `el.onclick = userControlledString` (atribuição de string)

Pistas de deteção:

- Procurar `.setAttribute("on`, `.onclick =`, `.onmouseover =`, etc.
- Rastrear se o lado direito pode ser influenciado por URL/hash/storage/postMessage. ([OWASP Cheat Sheet Series][2])

Correção:

- Substituir por `addEventListener("click", () => { ... })`.
- Se for necessário despacho dinâmico, usar um mapeamento com lista de permissões de identificadores para funções (sem eval de strings). ([OWASP Cheat Sheet Series][2])

---

### JS-URL-001: Sanitizar e aplicar lista de permissões a URLs antes da navegação (especialmente `window.location` / `location.replace`)

Severity: Low (High se for possível provar que um atacante controla totalmente o URL)

IMPORTANTE: Isto pode gerar muitos falsos positivos. Faça análise extra para determinar se o URL é totalmente controlado pelo atacante. Se não for, trate no máximo como informativo.

NOTA: Pode ser requisito de negócio redirecionar para qualquer URL. Se for o caso da funcionalidade, garanta pelo menos validação do esquema, mesmo que a origem possa ser arbitrária.

Obrigatório:

- MUST tratar qualquer atribuição a alvos de navegação como sensível em segurança:
  - `window.location = ...`
  - `location.href = ...`
  - `location.assign(...)`
  - `location.replace(...)` ([MDN Web Docs][4])

- MUST impedir navegação para URLs `javascript:` (e em geral outros esquemas ativos/com script), especialmente quando a entrada vem de parâmetros de URL, storage ou mensagens. ([MDN Web Docs][4]). Permitir apenas `http:` e `https:`.
- SHOULD validar / aplicar lista de permissões ao destino. Uma linha de base segura é:
  - Permitir apenas caminhos relativos same-origin, OU
  - Permitir apenas uma lista estrita de origens e protocolos (tipicamente `https:` e opcionalmente `http:` para dev em localhost). ([OWASP Cheat Sheet Series][8])

Padrões inseguros:

- `location.replace(getParam("next"))`
- `window.location = userSuppliedUrl`
- `location.assign(window.redirectTo || "/")` onde `redirectTo` pode ser clobbered ou definido pelo atacante ([OWASP Cheat Sheet Series][8])

Pistas de deteção:

- Procurar `window.location`, `location.href`, `location.assign`, `location.replace`.
- Procurar parâmetros comuns de redirecionamento: `next`, `returnTo`, `redirect`, `url`, `continue`.
- Procurar uso literal de `javascript:`. ([MDN Web Docs][4])

Correção:

- Fazer parse e validar com `new URL(value, location.origin)` e depois impor:
  - `url.protocol` em `{ "https:" }` (incluir `http:` apenas em caminhos explícitos só para dev),
  - `url.origin` igual a `location.origin` para redirecionamentos internos, ou numa lista estrita para externos,
  - opcionalmente permitir apenas prefixos de caminho específicos. ([MDN Web Docs][4])

- Se a validação falhar, navegar para um destino seguro por defeito (início/dashboard).

Mitigação:

- Implementar CSP estrito e Trusted Types para reduzir o impacto de sinks de DOM XSS; Trusted Types por si só não impedem todos os cenários de navegação insegura. ([W3C][15])

Notas de falso positivo:

IMPORTANTE: Isto pode gerar muitos falsos positivos. Faça análise extra para determinar se o URL é totalmente controlado pelo atacante. Se não for, trate no máximo como informativo.

- Algumas apps suportam redirecionamentos externos de propósito (SSO, pagamentos). Esses MUST constar de lista de permissões e documentação.

---

### JS-URL-002: Sanitizar URLs antes de inserir em contextos DOM com URL (`href`, `src`, etc.)

Severity: Low (High se for possível provar que um atacante controla totalmente o URL)

IMPORTANTE: Isto pode gerar muitos falsos positivos. Faça análise extra para determinar se o URL é totalmente controlado pelo atacante. Se não for, trate no máximo como informativo.

Obrigatório:

- MUST tratar a definição de atributos/propriedades DOM que carregam URL como sensível em segurança, especialmente:
  - `a.href`, `img.src`, `script.src`, `iframe.src`, `form.action`, `link.href`.

- MUST impedir esquemas com script (`javascript:` e outros esquemas ativos) quando os valores podem ser influenciados pelo atacante. ([MDN Web Docs][4])
- SHOULD preferir definir propriedades (ex.: `a.href = url.toString()`) após parse e validação, em vez de concatenação de strings.

Padrões inseguros:

- `link.href = getParam("u")`
- `el.setAttribute("href", userInput)` sem validação
- construir URLs por concatenação com partes não confiáveis

Pistas de deteção:

- Procurar `.href =`, `.src =`, `.action =`, `setAttribute("href"`, `setAttribute("src"`.
- Procurar uso de `javascript:` / `data:` em URLs. ([MDN Web Docs][4])

IMPORTANTE: Isto pode gerar muitos falsos positivos. Faça análise extra para determinar se o URL é totalmente controlado pelo atacante. Se não for, trate no máximo como informativo.

Correção:

- Usar `new URL(...)` e validar:
  - lista de permissões de protocolo
  - evitar passar valores fornecidos pelo utilizador a `<script src>` (tratar como execução de código). ([OWASP Cheat Sheet Series][8])

---

### JS-CSP-001: Usar CSP; entrega via meta é permitida

Severity: Medium a High (depende do modelo de ameaça; High ao processar conteúdo não confiável)

NOTA: O mais importante é definir o `script-src` do CSP. As outras diretivas são menos críticas e podem ser omitidas para facilitar o desenvolvimento.

Obrigatório:

- SHOULD implementar CSP como defesa em profundidade importante contra XSS. ([MDN Web Docs][10])
- MAY fornecer CSP via `<meta http-equiv="Content-Security-Policy" ...>` quando cabeçalhos não estiverem disponíveis. ([MDN Web Docs][1])
- Se o CSP for entregue via meta, MUST:
  - colocá-lo cedo (antes de scripts/recursos a governar), e
  - não depender de diretivas não suportadas em políticas meta (`report-uri`, `frame-ancestors`, `sandbox`). ([W3C][3])

- MUST evitar adicionar `unsafe-inline` como “correção rápida” salvo ser explicitamente necessário e revisto (anula grande parte do propósito do CSP). ([MDN Web Docs][10])
- MUST evitar adicionar `unsafe-eval` salvo necessidade explícita e revista (permite APIs tipo eval frequentemente abusadas). ([MDN Web Docs][10])

Padrões inseguros:

- Ausência de CSP (HTML do repositório ou servidor/edge) numa app que renderiza conteúdo não confiável.
- CSP com `script-src 'unsafe-inline'` e/ou `script-src 'unsafe-eval'` sem justificação forte. ([MDN Web Docs][10])
- CSP entregue via meta mas com `frame-ancestors` (será ignorado na meta). ([W3C][3])

Pistas de deteção:

- Procurar no HTML `<meta http-equiv="Content-Security-Policy"`.
- Procurar em configs servidor/edge o cabeçalho `Content-Security-Policy`.
- Se o CSP estiver só na meta, verificar que aparece antes de quaisquer `<script>` a governar. ([W3C][3])

Correção:

- Preferir CSP por cabeçalho no servidor/edge.
- Se só for possível via meta, manter CSP com lista de permissões forte e documentar limitações; proteções contra clickjacking (ex.: `frame-ancestors`) no servidor/edge, não na meta. ([W3C][3])

---

### JS-CSP-002: Preferir CSP estrito (nonces/hashes); evitar padrões inline/eval no código

Severity: Medium

NOTA: O mais importante é definir o `script-src` do CSP. As outras diretivas são menos críticas e podem ser omitidas para facilitar o desenvolvimento.

Obrigatório:

- SHOULD desenhar o frontend para funcionar com CSP estrito:
  - evitar scripts inline e handlers de eventos inline,
  - evitar APIs tipo eval (ver JS-XSS-003),
  - permitir scripts via nonce ou hash quando necessário. ([MDN Web Docs][10])

Padrões inseguros:

- Grandes blocos de script inline e handlers `onclick="..."` inline.
- Bibliotecas que exigem `unsafe-eval`.

Pistas de deteção:

- Procurar blocos `<script>` com código inline, `onclick="`, `onload="`, etc.
- Procurar diretivas CSP com `unsafe-inline` ou `unsafe-eval`. ([MDN Web Docs][10])

Correção:

- Mover scripts inline para ficheiros JS externos (same-origin).
- Usar nonces/hashes para blocos inline inevitáveis. ([MDN Web Docs][10])

---

### JS-TT-001: Usar Trusted Types para reduzir a superfície de ataque de DOM XSS (onde suportado)

Severity: Low

Obrigatório:

- SHOULD considerar ativar enforcement de Trusted Types com CSP `require-trusted-types-for 'script'` para que muitos sinks de DOM XSS rejeitem strings cruas. ([MDN Web Docs][11])
- Se usar Trusted Types, SHOULD usar também a diretiva CSP `trusted-types` para restringir que políticas podem ser criadas (reduz proliferação de políticas e melhora auditabilidade). ([MDN Web Docs][16])
- MUST manter o código de políticas Trusted Types pequeno, muito revisto, e como único caminho para produzir valores confiáveis para os sinks. ([W3C][15])

Padrões inseguros:

- “Trusted Types ativo” mas a política devolve a entrada sem alteração (sem sanitização/validação).
- Muitas políticas ad hoc no código sem restrição.
- Acreditar que Trusted Types sozinho impede todas as navegações inseguras ou todas as classes de XSS. (Ataca sinks de injeção DOM; não é um sandbox universal.) ([W3C][15])

Pistas de deteção:

- Procurar diretivas CSP: `require-trusted-types-for` e `trusted-types`.
- Procurar `trustedTypes.createPolicy(` e inspecionar implementações das políticas. ([MDN Web Docs][11])

Correção:

- Adicionar um conjunto pequeno de políticas bem revistas (ex.: `createHTML` que sanitiza).
- Restringir políticas permitidas via `trusted-types <policyName...>`.
- Migrar sinks para exigir `TrustedHTML` / `TrustedScriptURL` conforme apropriado. ([MDN Web Docs][11])

---

### JS-MSG-001: `postMessage` deve usar validação estrita de origem e `targetOrigin` explícito

Severity: Medium (High se comportamento perigoso puder ser acionado via postMessage)

Obrigatório:

- Ao enviar mensagens, MUST definir `targetOrigin` explícito (não `*`) para não enviar dados a uma origem inesperada após redirecionamentos ou mudanças de origem da janela. ([MDN Web Docs][5])
- Ao receber mensagens, MUST:
  - Validar `event.origin` exatamente contra uma lista de permissões de origens esperadas (sem correspondência por substring). ([OWASP Cheat Sheet Series][6])
  - Considerar validar `event.source` (referência de janela esperada) quando aplicável. ([MDN Web Docs][5])
  - Validar a estrutura de `event.data` (esquema/forma) e tratá-lo só como dados (nunca avaliar como código nem inserir no DOM com `innerHTML`). ([OWASP Cheat Sheet Series][6])

Padrões inseguros:

- `otherWindow.postMessage(payload, "*")`
- `window.addEventListener("message", (e) => { doSomething(e.data) })` sem verificação de `origin`
- `if (e.origin.includes("trusted.com"))` (verificações por substring)
- `el.innerHTML = e.data` ([OWASP Cheat Sheet Series][6])

Pistas de deteção:

- Procurar `postMessage(`, `addEventListener("message"`, `onmessage =`.
- Auditar todos os handlers quanto a verificações explícitas de lista de permissões em `event.origin`. ([OWASP Cheat Sheet Series][6])

Correção:

- Definir uma lista de permissões:
  - `const ALLOWED = new Set(["https://app.example.com", "https://accounts.example.com"]);`
    NOTA: Para facilitar o desenvolvimento, pode usar a origem da página atual `window.location.origin` como origem segura por defeito.

- À receção:
  - `if (!ALLOWED.has(event.origin)) return;`
  - Validar `event.data` com esquema estrito e rejeitar campos desconhecidos/extra.

- No envio:
  - usar a string exata da origem esperada como `targetOrigin`. ([OWASP Cheat Sheet Series][6])

Mitigação:

- Combinar com CSP estrito e evitar sinks DOM nos fluxos de mensagens. ([MDN Web Docs][10])

---

### JS-STORAGE-001: Web Storage não é local seguro para segredos (e é influenciável pelo atacante)

Severity: Low

Obrigatório:

- MUST NOT guardar segredos sensíveis ou identificadores de sessão em `localStorage` (ou `sessionStorage`) se o compromisso importar; um único XSS pode exfiltrar tudo no storage. ([OWASP Cheat Sheet Series][6])
- MUST tratar valores lidos do storage como entrada não confiável (atacantes podem carregar valores maliciosos via XSS). ([OWASP Cheat Sheet Series][6])
- SHOULD preferir cookies definidos pelo servidor com `HttpOnly` para identificadores de sessão (JS não pode definir `HttpOnly`, por isso evitar guardar IDs de sessão em storage acessível a JS). ([OWASP Cheat Sheet Series][6])
- SHOULD evitar alojar várias apps não relacionadas na mesma origem se dependem de separação de storage (o storage é por origem). ([OWASP Cheat Sheet Series][6])

Padrões inseguros:

- `localStorage.setItem("access_token", token)`
- `localStorage.setItem("session", sessionId)`
- Assumir que `localStorage` é “confiável porque é same-origin”.

Pistas de deteção:

- Procurar `localStorage.getItem`, `localStorage.setItem`, `sessionStorage.*`.
- Sinalizar chaves `token`, `jwt`, `session`, `auth`, `refresh`. ([OWASP Cheat Sheet Series][6])

Correção:

- Usar sessões geridas no servidor ou tokens de curta duração entregues e rodados com segurança, com defesas XSS cuidadosas (CSP/Trusted Types) e exposição mínima em JS.
- Se o storage for necessário para estado não sensível, mantê-lo fora de autenticação e validar/escapar antes do uso.

---

### JS-SUPPLY-001: JavaScript de terceiros é risco relevante na cadeia de fornecimento; minimizar e controlar

Severity: Low

Obrigatório:

- MUST tratar JS de terceiros como equivalente em privilégio ao JS first-party (pode executar código arbitrário na vossa origem e aceder a dados do DOM). ([OWASP Cheat Sheet Series][7])
- SHOULD minimizar scripts de terceiros e preferir:
  - self-host / espelho de scripts,
  - listas de permissões CSP estritas,
  - SRI para scripts em CDN,
  - monitorização contínua de alterações inesperadas. ([OWASP Cheat Sheet Series][7])

Padrões inseguros:

- Carregar scripts remotos arbitrários de muitos fornecedores sem revisão.
- Usar gestores de tags que injetam scripts dinamicamente sem controlos de integridade.
- Permitir scripts com wildcards amplos no CSP (ex.: `script-src *`). ([MDN Web Docs][10])

Pistas de deteção:

- Procurar no HTML `<script src="https://...">` e snippets de tag manager.
- Procurar em CSP `script-src` wildcards ou domínios demasiado amplos.
- Procurar injeção dinâmica de script: `document.createElement("script")`, `script.src = ...`, `appendChild(script)`. ([OWASP Cheat Sheet Series][8])

Correção:

- Remover tags de terceiros desnecessárias.
- Self-host ou espelhar scripts quando possível.
- Restringir CSP `script-src` ao menor conjunto de origens confiáveis.
- Adicionar SRI a scripts/estilos de CDN. ([OWASP Cheat Sheet Series][7])

---

### JS-SRI-001: Usar Subresource Integrity (SRI) para scripts/estilos de terceiros

Severity: Low

Obrigatório:

- SHOULD usar SRI para que os browsers só carreguem recursos de terceiros se coincidirem com um hash criptográfico esperado. ([MDN Web Docs][12])
- MUST atualizar hashes SRI sempre que o recurso subjacente mudar (fixar versões; evitar URLs “latest”).

Padrões inseguros:

- `<script src="https://cdn.example.com/lib.js"></script>` sem `integrity`.
- Carregar recursos `latest` ou não fixados de terceiros.

Pistas de deteção:

- Procurar `<script src="https://` e `<link rel="stylesheet" href="https://` sem `integrity=`.
- Verificar se `integrity` existe e usa hashes fortes (sha256/384/512 são típicos). ([MDN Web Docs][12])

Correção:

- Adicionar `integrity="sha384-..."` (ou apropriado) e garantir modo CORS adequado quando necessário.
- Preferir self-host de bibliotecas críticas.

---

### FS-DOMC-001: Prevenir DOM clobbering (evitar depender de propriedades nomeadas em `window`/`document`)

Severity: Medium a High (pode tornar-se Critical se permitir carregamento de script ou navegação `javascript:`)

Obrigatório:

- MUST NOT depender de variáveis globais implícitas ou de lookups `window.someName` / `document.someName` que possam ser clobbered por elementos HTML injetados com `id`/`name` coincidentes. ([OWASP Cheat Sheet Series][8])
- MUST evitar padrões como `let x = window.redirectTo || "/safe"; location.assign(x);` onde `redirectTo` possa ser clobbered para um `<a>` cujo `href` é controlado pelo atacante (incluindo `javascript:`). ([OWASP Cheat Sheet Series][8])
- SHOULD usar declarações explícitas de variáveis, âmbito local e consultas DOM explícitas (`getElementById`) em vez de acesso por propriedade nomeada. ([OWASP Cheat Sheet Series][8])
- Se a app inserir markup controlado pelo utilizador (mesmo sanitizado), SHOULD garantir que a sanitização considera colisões de `id`/`name`. ([OWASP Cheat Sheet Series][8])

Padrões inseguros:

- `const cfg = window.config || {};` usado para URLs sensíveis em segurança.
- `const redirect = window.redirectTo || "/"; location.assign(redirect);` ([OWASP Cheat Sheet Series][8])
- Carregar scripts a partir de valores de config `window.*` sem validação estrita.

Pistas de deteção:

- Procurar `window.` e `document.` usados como armazenamento de config (especialmente padrões de fallback `||`).
- Procurar `location.assign/replace` com variáveis vindas de propriedades `window`/`document`.
- Procurar criação dinâmica de script (`createElement('script')`) onde `.src` vem de variável não local. ([OWASP Cheat Sheet Series][8])

Correção:

- Guardar config em constantes ao nível do módulo (não em `window`/`document`) e passá-la explicitamente.
- Validar qualquer config tipo URL com listas de permissões de protocolo/origem (ver JS-URL-001). ([OWASP Cheat Sheet Series][8])
- Considerar endurecimento: sanitização, CSP e (em casos limitados) congelar objetos sensíveis, mas como defesa em profundidade, não substituto de padrões de código seguros. ([OWASP Cheat Sheet Series][8])

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Em varredura ativa, usar estes padrões de alto sinal:

- Sinks de DOM XSS:
  - `.innerHTML`, `.outerHTML`, `insertAdjacentHTML(`
  - `document.write(`, `document.writeln(` ([OWASP Cheat Sheet Series][2])

- Navegação / sinks de URL perigosos:
  - `window.location`, `location.href`, `location.assign`, `location.replace`
  - literais `javascript:` (e outros esquemas suspeitos como `data:text/html`) ([MDN Web Docs][4])

- Execução de código a partir de string:
  - `eval(`, `new Function`, `setTimeout("`, `setInterval("` ([MDN Web Docs][10])

- Injeção de string em handler de eventos:
  - `.setAttribute("on`, `.onclick =`, `.onload =` com strings ([OWASP Cheat Sheet Series][2])

- `postMessage`:
  - `postMessage(` com `"*"` como targetOrigin
  - `addEventListener("message"` sem verificações estritas de lista de permissões em `event.origin` ([MDN Web Docs][5])

- Storage:
  - `localStorage.setItem(` / `getItem(`, `sessionStorage.*`
  - chaves com `token`, `jwt`, `session`, `auth`, `refresh` ([OWASP Cheat Sheet Series][6])

- CSP e relacionados:
  - configuração do cabeçalho `Content-Security-Policy` (servidor/edge)
  - `<meta http-equiv="Content-Security-Policy" ...>`
  - CSP com `unsafe-inline` ou `unsafe-eval`
  - diretivas `require-trusted-types-for` / `trusted-types` ([MDN Web Docs][1])

- Scripts de terceiros:
  - `<script src="https://...">` sem `integrity=`
  - snippets de tag manager e caminhos de injeção dinâmica de script ([MDN Web Docs][12])

- Gadgets de DOM clobbering:
  - padrões `window.<nome> || ...` e `document.<nome> || ...`
  - uso sensível em segurança de propriedades `window`/`document` como fonte de config ([OWASP Cheat Sheet Series][8])

Sempre tentar confirmar:

- origem dos dados (não confiável vs confiável),
- tipo de sink (parse HTML, navegação, execução de código, mensagens, storage),
- controlos de proteção presentes (CSP, Trusted Types, sanitizadores, listas de permissões estritas, validação de esquema).

---

## 6) Fontes (consultadas em 2026-01-27)

Normas / documentação de plataforma principais:

- W3C Content Security Policy Level 2 (restrições de entrega via `<meta>` HTML; diretivas não suportadas em CSP meta): `https://www.w3.org/TR/CSP2/` ([W3C][3])
- MDN: Guia CSP (CSP estrito, nonces/hashes, `unsafe-inline`/`unsafe-eval`, bloqueio de eval): `https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP` ([MDN Web Docs][10])
- MDN: `<meta http-equiv>` (CSP via meta e aviso sobre cabeçalhos de segurança baseados em meta): `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv` ([MDN Web Docs][1])
- MDN: `frame-ancestors` (nota: não suportado em `<meta>`): `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors` ([MDN Web Docs][18])

DOM XSS e sinks perigosos:

- OWASP: DOM Based XSS Prevention Cheat Sheet (sinks perigosos + padrões seguros como `textContent`): `https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][2])
- MDN: `innerHTML` (considerações de segurança): `https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML` ([MDN Web Docs][19])
- MDN: `insertAdjacentHTML` (considerações de segurança): `https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML` ([MDN Web Docs][20])
- MDN: `document.write()` / `document.writeln()` (considerações de segurança): `https://developer.mozilla.org/en-US/docs/Web/API/Document/write` e `https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln` ([MDN Web Docs][13])

Riscos de esquemas de URL:

- MDN: URLs `javascript:` (execução na navegação; desencorajadas; referência a `window.location`): `https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript` ([MDN Web Docs][4])

Trusted Types:

- W3C: especificação Trusted Types (sinks de DOM XSS incluem `Element.innerHTML` e setters de `Location.href`; objetivos e limitações): `https://www.w3.org/TR/trusted-types/` ([W3C][15])
- MDN: diretiva `require-trusted-types-for`: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for` ([MDN Web Docs][11])
- MDN: diretiva `trusted-types`: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/trusted-types` ([MDN Web Docs][16])

Mensagens entre janelas:

- MDN: `window.postMessage` (orientação de segurança: especificar targetOrigin; validar origem): `https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage` ([MDN Web Docs][5])
- OWASP: HTML5 Security Cheat Sheet (Web Messaging: origem explícita, verificações estritas, sem `innerHTML`): `https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][6])

Scripts de terceiros e integridade:

- OWASP: Third Party JavaScript Management Cheat Sheet (riscos e mitigações incluindo SRI/mirroring): `https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][7])
- MDN: visão geral de Subresource Integrity: `https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity` ([MDN Web Docs][12])
- W3C: especificação Subresource Integrity: `https://www.w3.org/TR/sri-2/` ([W3C][21])

DOM clobbering:

- OWASP: DOM Clobbering Prevention Cheat Sheet (risco de acesso por propriedade nomeada; exemplos com `location.assign` e `javascript:`): `https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][8])

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv'
[2]: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html'
[3]: https://www.w3.org/TR/CSP2/ 'Content Security Policy Level 2'
[4]: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript 'javascript: URLs - URIs | MDN'
[5]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage 'https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage'
[6]: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html'
[7]: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html'
[8]: https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html'
[9]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener'
[10]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP'
[11]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for'
[12]: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity 'https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity'
[13]: https://developer.mozilla.org/en-US/docs/Web/API/Document/write 'https://developer.mozilla.org/en-US/docs/Web/API/Document/write'
[14]: https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln 'https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln'
[15]: https://www.w3.org/TR/trusted-types/ 'https://www.w3.org/TR/trusted-types/'
[16]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/trusted-types 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/trusted-types'
[18]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors'
[19]: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML 'https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML'
[20]: https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML 'https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML'
[21]: https://www.w3.org/TR/sri-2/ 'https://www.w3.org/TR/sri-2/'
