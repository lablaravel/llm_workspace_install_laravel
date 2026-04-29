# Especificação de segurança da Web Frontend JavaScript/TypeScript (navegador Vanilla JS/TS, navegadores modernos)
Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:
1. **Geração de código seguro por padrão** para novo front-end JavaScript/TypeScript (nenhuma estrutura específica assumida).
2. **Revisão de segurança/caça de vulnerabilidades** no código de front-end existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).
Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).
---
## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)
- NÃO DEVE solicitar, gerar, registrar, codificar ou confirmar segredos (chaves de API destinadas a serem secretas, chaves privadas, senhas, tokens de atualização OAuth, tokens de sessão, cookies).
  Notas:
  - O código frontend é inerentemente observável pelos usuários finais. Se um valor precisar permanecer secreto, ele não deverá estar no código entregue pelo navegador.
  - Se o projeto usar chaves “públicas” (por exemplo, chaves analíticas publicáveis), elas DEVEM ser tratadas como não secretas e com escopo definido de acordo.
- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, enfraquecendo o CSP com `unsafe-inline`/`unsafe-eval` sem justificativa, removendo verificações de origem para `postMessage`, mudando para `innerHTML` por conveniência, aceitando redirecionamentos/URLs arbitrários ou desativando a higienização).
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar caminhos de arquivos, trechos de código e valores HTML/CSP/config relevantes que justifiquem a reivindicação.
- DEVE tratar a incerteza com honestidade:
  - Cabeçalhos de segurança (CSP, ancestrais de quadros, etc.) podem ser definidos por servidor/borda/CDN em vez de no código do repositório. Se não estiver visível, relate como “não visível aqui; verifique na configuração de tempo de execução/edge”. (Observe também que `<meta http-equiv=...>` apenas simula um subconjunto de cabeçalhos; não presuma que outros cabeçalhos de segurança existem apenas porque existe uma meta tag.) ([MDN Web Docs][1])
---
## 1) Modos de operação
### 1.1 Modo de geração (padrão)
Quando solicitado a escrever um novo código JS/TS de frontend ou modificar o código existente:
- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs de navegador seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado (especialmente para higienização de HTML).
- DEVE evitar a introdução de novos coletores de risco (sumidouros de injeção DOM XSS como `innerHTML`, navegação para URLs `javascript:`, execução dinâmica de código via `eval`/`Function`, `postMessage` inseguro, carregamento inseguro de scripts de terceiros, etc.). ([Série de folhas de dicas OWASP] [2])
### 1.2 Modo de revisão passiva (sempre ativado durante a edição)
Ao trabalhar em qualquer lugar em um repositório de front-end (mesmo que o usuário não tenha solicitado uma verificação de segurança):
- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.
### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)
Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:
- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).
Ordem de auditoria recomendada:
1. Pontos de entrada HTML (`index.html`, modelos renderizados pelo servidor), inclusões de script/estilo e qualquer entrega CSP (cabeçalho vs meta). ([W3C][3])
2. Coletores DOM XSS (`innerHTML`, `document.write`, `insertAdjacentHTML`, atributos do manipulador de eventos) e suas fontes de dados (parâmetros/hash de URL, armazenamento, postMessage, respostas de API). ([Série de folhas de dicas OWASP] [2])
3. Tratamento de navegação/redirecionamento (`window.location*`, destinos de link, listas de permissões de URL), incluindo `javascript:` perigos de URL. ([Documentos da Web MDN] [4])
4. Comunicação entre origens (`postMessage`, padrões de incorporação de iframe, sandboxing). ([Documentos da Web MDN] [5])
5. Armazenamento de dados confidenciais (localStorage/sessionStorage) e suposições sobre confiança. ([Série de folhas de dicas OWASP] [6])
6. Scripts/gerenciadores de tags/CDNs de terceiros e controles de integridade (SRI) e controles de política (CSP). ([Série de folhas de dicas OWASP] [7])
7. Dispositivos destruidores de DOM e dependência insegura de propriedades nomeadas `window`/`document`. ([Série de folhas de dicas OWASP] [8])
---
## 2) Definições e orientações de revisão
### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)
Os exemplos incluem:
- Dados derivados de URL: `location.href`, `location.search`, `location.hash`, `document.baseURI`, `new URLSearchParams(location.search)`, fragmentos de roteamento. ([Série de folhas de dicas OWASP] [2])
- Conteúdo DOM que pode incluir marcação controlada pelo usuário (comentários, perfis, conteúdo CMS, saída de marcação para HTML, etc.), especialmente se inserido dinamicamente. ([Série de folhas de dicas OWASP] [2])
- Dados de eventos `postMessage` (`event.data`) e metadados (`event.origin`) de outras janelas/frames. ([Documentos da Web MDN] [5])
- Armazenamento do navegador: `localStorage`, `sessionStorage`, IndexedDB (o conteúdo pode ser influenciado pelo invasor via XSS ou acesso à máquina local; nunca trate como “confiável”). ([Série de folhas de dicas OWASP] [6])
- Quaisquer dados retornados de chamadas de rede (mesmo que sejam de “sua API”), pois podem conter conteúdo armazenado do invasor que se torna perigoso somente quando inserido no DOM. ([Série de folhas de dicas OWASP] [2])
### 2.2 Coletor perigoso (DOM XSS/coletor de execução de código)
Um coletor é qualquer API/operação que pode executar script ou interpretar strings controladas pelo invasor como HTML/JS/URL de maneira sensível à segurança. Os coletores de alto sinal incluem:
- Análise / inserção de HTML: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `document.writeln`. ([Série de folhas de dicas OWASP] [2])
- Execução dinâmica de código: `eval`, `new Function`, `setTimeout("...")`, `setInterval("...")`. ([Documentos da Web MDN] [10])
- Navegação para URLs contendo scripts (por exemplo, `javascript:`) por meio de setters como `Location.href`/`window.location` (e via link `href` se for controlado por um invasor). ([Documentos da Web MDN] [4])
- Definir atributos do manipulador de eventos a partir de strings, por exemplo. `setAttribute("onclick", "...")`. ([Série de folhas de dicas OWASP] [2])
### 2.3 Formato de descoberta de auditoria necessário
Para cada problema encontrado, produza:
- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + função/classe/módulo + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas falso-positivas: o que verificar em caso de incerteza
---
## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)
Esta é a menor linha de base que evita configurações incorretas comuns de segurança JS/TS de front-end. Alguns itens estão “no repositório” (HTML/JS) e alguns podem residir no servidor/borda.
### 3.1 Linha de base da Política de Segurança de Conteúdo (CSP) (DEVE; OBRIGATÓRIA para aplicativos de alto risco)
- DEVE entregar CSP através de cabeçalhos de resposta HTTP quando possível.
- PODE entregar CSP por meio de uma tag HTML `<meta http-equiv="Content-Security-Policy" ...>` quando você não pode definir cabeçalhos (por exemplo, restrições de hospedagem puramente estáticas). ([Documentos da Web MDN] [1])
- Se estiver usando CSP via `<meta http-equiv>`, DEVE entender as limitações:
  - A política aplica-se apenas ao conteúdo que segue o elemento meta (portanto, deve aparecer muito cedo, antes de quaisquer scripts/recursos que você deseja governar). ([W3C][3])
  - As seguintes diretivas **não são suportadas** em uma política meta-entregue e serão ignoradas: `report-uri`, `frame-ancestors` e `sandbox`. ([W3C][3])
  - O CSP “somente relatório” não pode ser definido por meio de um metaelemento. ([W3C][3])
Metas básicas práticas:
- Evite fontes de script `unsafe-inline` e `unsafe-eval` (elas enfraquecem significativamente o valor do CSP em relação ao XSS). ([Documentos da Web MDN] [10])
- Prefira políticas de script baseadas em nonce ou hash se precisar de scripts embutidos. ([Documentos da Web MDN] [10])
- Considere ativar a aplicação de tipos confiáveis sempre que possível. ([Documentos da Web MDN] [11])
### 3.2 Linha de base de scripts de terceiros (DEVE)
- DEVE minimizar a execução de scripts de terceiros e tratá-lo como privilégio equivalente ao JS primário (ele é executado com os privilégios de sua origem). ([Série de folhas de dicas OWASP] [7])
- DEVE usar Subresource Integrity (SRI) para scripts/estilos de terceiros carregados de CDNs. ([Documentos da Web MDN] [12])
### 3.3 Linha de base de comunicação entre janelas (DEVE)
- DEVE restringir as comunicações `postMessage` a origens explícitas e validar a origem e o formato da mensagem. ([Documentos da Web MDN] [5])
---
## 4) Regras (geração + auditoria)
Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.
### JS-XSS-001: Não injete HTML não confiável no DOM (evite `innerHTML` e amigos)
Gravidade: Crítica se você puder provar que a entrada controlada pelo invasor pode alcançar essas APIs; caso contrário, Médio
Obrigatório:
- DEVE tratar `innerHTML`, `outerHTML` e `insertAdjacentHTML` como coletores perigosos quando sua entrada pode conter dados não confiáveis. ([Série de folhas de dicas OWASP] [2])
- DEVE preferir APIs DOM seguras que não analisem HTML:
  - `textContent` para texto. ([Série de folhas de dicas OWASP] [2])
  - `document.createElement`, `appendChild`, `setAttribute` para atributos que não são manipuladores de eventos. ([Série de folhas de dicas OWASP] [2])
- Se a inserção de HTML for realmente necessária, DEVE higienizar com um sanitizador de HTML bem revisado e considerar fortemente a aplicação de Tipos Confiáveis ​​para limitar o uso a caminhos de código auditados. ([Documentos da Web MDN] [11])
Padrões inseguros:
- `el.innerHTML=userInput`
- `el.insertAdjacentHTML('beforeend', userInput)`
- `el.outerHTML = userInput`
Dicas de detecção:
- Procure por: `.innerHTML`, `.outerHTML`, `insertAdjacentHTML(`.
- Rastreie a origem da string inserida: parâmetros/hash de URL, postMessage, armazenamento, respostas de API, atributos DOM. ([Série de folhas de dicas OWASP] [2])
Consertar:
- Substitua por `textContent` para texto simples. ([Série de folhas de dicas OWASP] [2])
- Para UI estruturada, crie nós DOM explicitamente.
- Para requisitos de “rich text”:
  - Higienize usando um desinfetante baseado em lista de permissões.
  - Prefira retornar “componentes” seguros em vez de strings HTML arbitrárias.
  - Use a aplicação de tipos confiáveis ​​para garantir que apenas `TrustedHTML` alcance coletores onde houver suporte. ([Documentos da Web MDN] [11])
Mitigação:
- Implante um CSP estrito e considere a aplicação de tipos confiáveis ​​(`require-trusted-types-for 'script'`). ([Documentos da Web MDN] [10])
Notas falsas positivas:
- Se a string for comprovadamente constante ou totalmente gerada a partir de constantes confiáveis, ela pode ser segura. Ainda prefiro APIs mais seguras.
---
### JS-XSS-002: Evite `document.write` / `document.writeln` (XSS + riscos de destruição de documentos)
Gravidade: Crítica se você puder provar que a entrada controlada pelo invasor pode alcançar essas APIs; caso contrário, Médio
Obrigatório:
- DEVE evitar `document.write()` e `document.writeln()` no código de produção (eles são vetores XSS e podem ser abusados ​​com HTML criado mesmo se alguns navegadores bloquearem `<script>` injetado em certas situações). ([Documentos da Web MDN] [13])
- Se o uso legado for inevitável, DEVE garantir que nenhuma entrada não confiável chegue a essas APIs e DEVE impor Tipos Confiáveis (`TrustedHTML`) quando suportados. ([Documentos da Web MDN] [14])
Padrões inseguros:
- `document.write(userInput)`
- `document.writeln(getParam('q'))`
Dicas de detecção:
- Procure por `document.write(`, `document.writeln(`. ([Série de folhas de dicas OWASP][2])
Consertar:
- Substitua por manipulação de DOM (`createElement`, `appendChild`) ou inserção segura de texto (`textContent`). ([Série de folhas de dicas OWASP] [2])
Mitigação:
- A aplicação estrita de CSP + tipos confiáveis ​​reduz o raio de explosão se um coletor permanecer. ([Documentos da Web MDN] [10])
---
### JS-XSS-003: Não use execução de string para código (`eval`, `new Function`, tempos limite de string)
Gravidade: Crítica se você puder provar que a entrada controlada pelo invasor pode alcançar essas APIs; caso contrário, Médio
Obrigatório:
- NÃO DEVE passar dados não confiáveis para:
  - `eval()`
  - `nova função (...)`
  - `setTimeout("...")` / `setInterval("...")` com argumentos de string ([MDN Web Docs][10])
- DEVE evitar essas APIs inteiramente no código frontend moderno; refatorar para lógica sem avaliação. ([Documentos da Web MDN] [10])
- NÃO DEVE “consertar quebras de CSP” adicionando `unsafe-eval` a menos que haja uma justificativa documentada e revisada e controles de compensação. ([Documentos da Web MDN] [10])
Padrões inseguros:
- `eval(userInput)`
- `nova Função("return " + userInput)()`
- `setTimeout(userInput, 0)` onde userInput é uma string
Dicas de detecção:
- Procure por `eval(`, `nova Função`, `setTimeout("`, `setInterval("`.
- Pesquise também a construção de strings de código usadas posteriormente.
Consertar:
- Substitua o código dinâmico por:
  - dados estruturados + ramificações/manipuladores explícitos,
  - Análise JSON (`JSON.parse`) em vez de `eval` para JSON. ([Série de folhas de dicas OWASP] [2])
Mitigação:
- CSP que bloqueia APIs do tipo `eval()` por padrão e evita `unsafe-eval`. ([Documentos da Web MDN] [10])
- Considere tipos confiáveis para casos controlados, mas trate-os como uma camada de proteção, não como uma licença para manter padrões de avaliação. ([Documentos da Web MDN] [10])
---
### JS-XSS-004: Não defina atributos do manipulador de eventos a partir de strings (por exemplo, `setAttribute("onclick", "...")`)
Gravidade: Alta
Obrigatório:
- NÃO DEVE usar `setAttribute("on…", string)` ou padrões similares com dados não confiáveis; isso força as strings em código executável no contexto do manipulador de eventos. ([Série de folhas de dicas OWASP] [2])
- DEVE preferir `addEventListener` com referências de função.
Padrões inseguros:
- `el.setAttribute("onclick", userInput)`
- `el.onclick = userControlledString` (atribuição de string)
Dicas de detecção:
- Procure por `.setAttribute("on`, `.onclick =`, `.onmouseover =`, etc.
- Rastreie se o RHS pode ser influenciado por URL/hash/storage/postMessage. ([Série de folhas de dicas OWASP] [2])
Consertar:
- Substitua por `addEventListener("click", () => { ... })`.
- Se for necessário despacho dinâmico, use um mapeamento permitido de identificadores para funções (sem avaliação de string). ([Série de folhas de dicas OWASP] [2])
---
### JS-URL-001: Sanitizar e permitir URLs antes da navegação (especialmente `window.location` / `location.replace`)
Gravidade: Baixa (Alta se você puder provar que um invasor pode controlar totalmente o URL)
IMPORTANTE: Isso pode causar muitos falsos positivos. Execute uma análise extra para determinar se o URL é totalmente controlado pelo invasor. Se não for totalmente controlado pelo invasor, isso será, na melhor das hipóteses, informativo.
NOTA: Pode ser uma funcionalidade importante poder redirecionar para qualquer URL. Se esse for o objetivo do recurso, no mínimo, certifique-se de que ele verifique o esquema, mesmo que a origem possa ser qualquer coisa.
Obrigatório:
- DEVE tratar qualquer atribuição a alvos de navegação como sensível à segurança:
  - `janela.localização = ...`
  - `localização.href = ...`
  - `localização.assign(...)`
  - `location.replace(...)` ([MDN Web Docs][4])
- DEVE impedir a navegação para URLs `javascript:` (e geralmente outros esquemas ativos/com script), especialmente quando a entrada é derivada de parâmetros de URL, armazenamento ou mensagens. ([Documentos da Web MDN] [4]). Permitir apenas `http:` e `https:`.
- DEVE validar/permitir o destino. Uma linha de base segura é:
  - Permitir apenas caminhos relativos de mesma origem, OU
  - Permitir apenas uma lista de permissões estrita de origens e protocolos (normalmente `https:` e opcionalmente `http:` para localhost dev). ([Série de folhas de dicas OWASP] [8])
Padrões inseguros:
- `localização.replace(getParam("próximo"))`
- `window.location = userSuppliedUrl`
- `location.assign(window.redirectTo || "/")` onde `redirectTo` pode ser derrotado ou definido por um invasor ([OWASP Cheat Sheet Series][8])
Dicas de detecção:
- Procure por `window.location`, `location.href`, `location.assign`, `location.replace`.
- Pesquise parâmetros de redirecionamento comuns: `next`, `returnTo`, `redirect`, `url`, `continue`.
- Procure por `javascript:` uso literal. ([Documentos da Web MDN] [4])
Consertar:
- Analise e valide com `new URL(value, location.origin)` e, em seguida, aplique:
  - `url.protocol` em `{ "https:" }` (e inclua apenas `http:` em caminhos de código explícitos somente para desenvolvedores),
  - `url.origin` é igual a `location.origin` para redirecionamentos internos ou em uma lista de permissões estrita para redirecionamentos externos,
  - opcionalmente permite apenas prefixos de caminho específicos. ([Documentos da Web MDN] [4])
- Se a validação falhar, navegue até um padrão seguro (home/dashboard).
Mitigação:
- Implemente a aplicação estrita de CSP e tipos confiáveis ​​para reduzir o impacto dos coletores DOM XSS, mas observe que os tipos confiáveis ​​não evitam todos os possíveis cenários de navegação inseguros por conta própria. ([W3C][15])
Notas falsas positivas:
IMPORTANTE: Isso pode causar muitos falsos positivos. Execute uma análise extra para determinar se o URL é totalmente controlado pelo invasor. Se não for totalmente controlado pelo invasor, isso será, na melhor das hipóteses, informativo.
- Alguns aplicativos suportam intencionalmente redirecionamentos externos (SSO, fluxos de pagamento). Eles DEVEM estar na lista de permissões e documentados.
---
### JS-URL-002: Limpe URLs antes de inseri-las em contextos de URL DOM (`href`, `src`, etc.)
Gravidade: Baixa (Alta se você puder provar que um invasor pode controlar totalmente o URL)
IMPORTANTE: Isso pode causar muitos falsos positivos. Execute uma análise extra para determinar se o URL é totalmente controlado pelo invasor. Se não for totalmente controlado pelo invasor, isso será, na melhor das hipóteses, informativo.
Obrigatório:
- DEVE tratar a configuração de atributos/propriedades DOM contendo URL como sensíveis à segurança, especialmente:
  - `a.href`, `img.src`, `script.src`, `iframe.src`, `form.action`, `link.href`.
- DEVE evitar esquemas contendo scripts (`javascript:` e outros esquemas ativos) quando os valores podem ser influenciados pelo invasor. ([Documentos da Web MDN] [4])
- DEVE preferir definir propriedades (por exemplo, `a.href = url.toString()`) após análise e validação, em vez de concatenação de strings.
Padrões inseguros:
- `link.href = getParam("u")`
- `el.setAttribute("href", userInput)` sem validação
- construção de URLs via concatenação com partes não confiáveis
Dicas de detecção:
- Procure por `.href =`, `.src =`, `.action =`, `setAttribute("href"`, `setAttribute("src"`.
- Pesquise o uso de `javascript:` / `data:` em URLs. ([Documentos da Web MDN] [4])
IMPORTANTE: Isso pode causar muitos falsos positivos. Execute uma análise extra para determinar se o URL é totalmente controlado pelo invasor. Se não for totalmente controlado pelo invasor, isso será, na melhor das hipóteses, informativo.
Consertar:
- Use `new URL(...)` e valide:
  - lista de permissões de protocolo
  - evite passar valores fornecidos pelo usuário para `<script src>` (trate como execução de código). ([Série de folhas de dicas OWASP] [8])
---
### JS-CSP-001: Usar CSP; meta delivery is allowed
Severity: Medium to High (depends on threat model; High when handling untrusted content)
NOTE: It is most important to set the CSP's script-src. All other directives are not as important and can generally be excluded for the ease of development.
Obrigatório:
- SHOULD deploy a CSP as a major defense-in-depth against XSS. ([Documentos da Web MDN] [10])
- MAY provide CSP via `<meta http-equiv="Content-Security-Policy" ...>` when headers are not available. ([Documentos da Web MDN] [1])
- Se o CSP for entregue via meta, DEVE:
  - place it early (before scripts/resources you want governed), and
  - not rely on unsupported directives in meta policies (`report-uri`, `frame-ancestors`, `sandbox`). ([W3C][3])
- DEVE evitar adicionar `unsafe-inline` como uma “solução rápida” para problemas de CSP, a menos que explicitamente exigido e revisado (isso vai contra grande parte do propósito do CSP). ([Documentos da Web MDN] [10])
- MUST avoid adding `unsafe-eval` unless explicitly required and reviewed (it allows eval-like APIs that are commonly abused). ([Documentos da Web MDN] [10])
Padrões inseguros:
- Nenhum CSP presente em qualquer lugar (repo HTML ou servidor/edge) para um aplicativo que renderiza conteúdo não confiável.
- CSP inclui `script-src 'unsafe-inline'` e/ou `script-src 'unsafe-eval'` sem forte justificativa. ([Documentos da Web MDN] [10])
- CSP entregue via meta, mas inclui `frame-ancestors` (será ignorado no meta). ([W3C][3])
Dicas de detecção:
- Pesquise em HTML por `<meta http-equiv="Content-Security-Policy"`.
- Pesquise configurações de servidor/borda para o cabeçalho `Content-Security-Policy`.
- Se CSP estiver apenas em meta, verifique se ele aparece antes de qualquer tag `<script>` que você deseja controlar. ([W3C][3])
Consertar:
- Prefira CSP entregue por cabeçalho no servidor/borda.
- Se estiver restrito ao meta, mantenha um CSP forte na lista de permissões e documente as limitações; implementar proteções contra clickjacking (por exemplo, `frame-ancestors`) no servidor/borda, não no meta. ([W3C][3])
---
### JS-CSP-002: Prefira CSP estrito (nonces/hashes); evite padrões inline/eval no código
Gravidade: Média
NOTA: É muito importante definir o script-src do CSP. Todas as outras directivas não são tão importantes e geralmente podem ser excluídas para facilitar o desenvolvimento.
Obrigatório:
- DEVE projetar o código frontend para funcionar sob um CSP estrito:
  - evite scripts embutidos e manipuladores de eventos embutidos,
  - evite APIs do tipo eval (consulte JS-XSS-003),
  - permitir scripts via nonce ou hash quando necessário. ([Documentos da Web MDN] [10])
Padrões inseguros:
- Grandes quantidades de blocos de script embutidos e manipuladores `onclick="..."` embutidos.
- Bibliotecas que requerem `unsafe-eval`.
Dicas de detecção:
- Procure por blocos `<script>` com código embutido, `onclick="`, `onload="`, etc.
- Procure por diretivas CSP contendo `unsafe-inline` ou `unsafe-eval`. ([Documentos da Web MDN] [10])
Consertar:
- Mova scripts embutidos para arquivos JS externos (mesma origem).
- Use nonces/hashes para quaisquer blocos inline inevitáveis. ([Documentos da Web MDN] [10])
---
### JS-TT-001: Use tipos confiáveis ​​para reduzir a superfície de ataque DOM XSS (quando houver suporte)
Gravidade: Baixa
Obrigatório:
- DEVE considerar habilitar a aplicação de tipos confiáveis ​​com CSP `require-trusted-types-for 'script'` para fazer com que muitos coletores DOM XSS rejeitem strings brutas. ([Documentos da Web MDN] [11])
- Se estiver usando tipos confiáveis, DEVE também usar a diretiva `trusted-types` do CSP para restringir quais políticas podem ser criadas (reduz a expansão de políticas e melhora a auditabilidade). ([Documentos da Web MDN] [16])
- DEVE manter o código de política de tipos confiáveis pequeno, altamente revisado e usado como o único caminho para produzir valores confiáveis para coletores. ([W3C][15])
Padrões inseguros:
- “Tipos confiáveis ​​habilitados”, mas a política simplesmente retorna a entrada inalterada (sem higienização/validação).
- Muitas políticas ad hoc criadas em toda a base de código sem restrições.
- Crença de que os tipos confiáveis ​​por si só impedem todas as navegações inseguras ou todas as classes XSS. (Ele tem como alvo coletores de injeção DOM; não é uma sandbox universal.) ([W3C][15])
Dicas de detecção:
- Procure por diretivas CSP: `require-trusted-types-for` e `trusted-types`.
- Pesquise o código para `trustedTypes.createPolicy(` e inspecione as implementações de políticas. ([MDN Web Docs][11])
Consertar:
- Adicione um pequeno conjunto de políticas bem revisadas (por exemplo, `createHTML` que higieniza).
- Restringir políticas permitidas através de `trusted-types <policyName...>`.
- Migrar coletores para exigir `TrustedHTML` / `TrustedScriptURL` conforme apropriado. ([Documentos da Web MDN] [11])
---
### JS-MSG-001: `postMessage` must use strict origin validation and explicit targetOrigin
Severity: Medium (High if dangerous behavior can be triggered via postMessage)
Obrigatório:
- Ao enviar mensagens, DEVE definir um `targetOrigin` explícito (não `*`) para evitar o envio de dados para uma origem inesperada após redirecionamentos ou alterações na origem da janela. ([Documentos da Web MDN] [5])
- Ao receber mensagens, DEVE:
  - Validate `event.origin` exactly against an allowlist of expected origins (no substring matching). ([Série de folhas de dicas OWASP] [6])
  - Consider validating `event.source` (expected window reference) when applicable. ([Documentos da Web MDN] [5])
  - Valide a estrutura `event.data` (esquema/forma) e trate-a puramente como dados (nunca avalie-a como código e nunca insira no DOM com `innerHTML`). ([Série de folhas de dicas OWASP] [6])
Padrões inseguros:
- `otherWindow.postMessage(carga útil, "*")`
- `window.addEventListener("message", (e) => { doSomething(e.data) })` sem verificação de `origin`
- `if (e.origin.includes("trusted.com"))` (verificações de substring)
- `el.innerHTML = e.data` ([Série de folhas de dicas OWASP] [6])
Dicas de detecção:
- Procure por `postMessage(`, `addEventListener("message"`, `onmessage =`.
- Audite todos os manipuladores para verificações explícitas da lista de permissões em `event.origin`. ([Série de folhas de dicas OWASP] [6])
Consertar:
- Definir uma lista de permissões:
  - `const ALLOWED = new Set(["https://app.example.com", "https://accounts.example.com"]);`
    NOTA: Para facilitar o desenvolvimento, você pode usar a origem da página atual `window.location.origin` como uma origem padrão segura.
- Ao receber:
  - `if (!ALLOWED.has(event.origin)) return;`
  - Valide `event.data` com um esquema estrito e rejeite campos desconhecidos/extras.
- Ao enviar:
  - use a string de origem exata esperada como `targetOrigin`. ([Série de folhas de dicas OWASP] [6])
Mitigação:
- Combine com um CSP estrito e evite coletores de DOM em caminhos de mensagens. ([Documentos da Web MDN] [10])
---
### JS-STORAGE-001: O armazenamento na Web não é um local seguro para segredos (e pode ser influenciado por invasores)
Gravidade: Baixa
Obrigatório:
- NÃO DEVE armazenar segredos confidenciais ou identificadores de sessão em `localStorage` (ou `sessionStorage`) se o comprometimento for importante; um único XSS pode exfiltrar tudo no armazenamento. ([Série de folhas de dicas OWASP] [6])
- DEVE tratar os valores lidos do armazenamento como entrada não confiável (os invasores podem carregar valores maliciosos no armazenamento via XSS). ([Série de folhas de dicas OWASP] [6])
- DEVE preferir cookies definidos pelo servidor com `HttpOnly` para identificadores de sessão (JS não pode definir `HttpOnly`, portanto, evite armazenar IDs de sessão em armazenamento acessível por JS). ([Série de folhas de dicas OWASP] [6])
- DEVE evitar hospedar vários aplicativos não relacionados na mesma origem se eles dependerem da separação de armazenamento (o armazenamento abrange toda a origem). ([Série de folhas de dicas OWASP] [6])
Padrões inseguros:
- `localStorage.setItem("token_acesso", token)`
- `localStorage.setItem("sessão", sessionId)`
- Supondo que `localStorage` seja “confiável porque é de mesma origem”.
Dicas de detecção:
- Procure por `localStorage.getItem`, `localStorage.setItem`, `sessionStorage.*`.
- Sinalize chaves de armazenamento denominadas `token`, `jwt`, `session`, `auth`, `refresh`. ([Série de folhas de dicas OWASP] [6])
Consertar:
- Use sessões gerenciadas por servidor ou tokens de curta duração entregues e rotacionados com segurança, com defesas XSS cuidadosas (CSP/Tipos confiáveis) e exposição mínima a JS.
- Se o armazenamento precisar ser usado para um estado não confidencial, mantenha-o sem autenticação e valide/escape antes de usar.
---
### JS-SUPPLY-001: JavaScript de terceiros é um grande risco para a cadeia de suprimentos; minimizar e controlá-lo
Gravidade: Baixa
Obrigatório:
- DEVE tratar JS de terceiros como equivalente ao JS primário em privilégio (ele pode executar código arbitrário em sua origem e acessar dados DOM). ([Série de folhas de dicas OWASP] [7])
- DEVE minimizar scripts de terceiros e preferir:
  - auto-hospedagem/espelhamento de script,
  - listas de permissões rigorosas de CSP,
  - SRI para qualquer script hospedado em CDN,
  - monitoramento contínuo de mudanças inesperadas. ([Série de folhas de dicas OWASP] [7])
Padrões inseguros:
- Carregar scripts remotos arbitrários de muitos fornecedores sem revisão.
- Usando gerenciadores de tags que podem injetar scripts dinamicamente sem controles de integridade.
- Permitir scripts de curingas amplos em CSP (por exemplo, `script-src *`). ([Documentos da Web MDN] [10])
Dicas de detecção:
- Pesquise em HTML os trechos `<script src="https://...">` e `tag manager`.
- Pesquise fontes `script-src` do CSP em busca de curingas ou domínios excessivamente amplos.
- Procure por injeção dinâmica de script: `document.createElement("script")`, `script.src = ...`, `appendChild(script)`. ([Série de folhas de dicas OWASP] [8])
Consertar:
- Remova tags desnecessárias de terceiros.
- Scripts de auto-hospedagem ou espelho sempre que possível.
- Bloqueie o CSP `script-src` para o menor conjunto de fontes confiáveis.
- Adicione SRI para scripts/estilos CDN. ([Série de folhas de dicas OWASP] [7])
---
### JS-SRI-001: Use integridade de sub-recursos (SRI) para scripts/estilos de terceiros
Gravidade: Baixa
Obrigatório:
- DEVE usar SRI para garantir que os navegadores só carreguem recursos de terceiros se eles corresponderem a um hash criptográfico esperado. ([Documentos da Web MDN] [12])
- DEVE atualizar os hashes SRI sempre que o recurso subjacente for alterado (pin versões; evite URLs “mais recentes”).
Padrões inseguros:
- `<script src="https://cdn.example.com/lib.js"></script>` sem `integridade`.
- Carregando recursos de terceiros `mais recentes` ou não fixados.
Dicas de detecção:
- Procure por `<script src="https://` e `<link rel="stylesheet" href="https://` sem `integrity=`.
- Verifique se a `integridade` está presente e usa hashes fortes (sha256/384/512 são típicos). ([Documentos da Web MDN] [12])
Consertar:
- Adicione `integrity="sha384-..."` (ou apropriado) e garanta o modo CORS adequado quando necessário.
- Prefira bibliotecas críticas auto-hospedadas.
---
### FS-DOMC-001: Evita a destruição do DOM (evite depender de propriedades nomeadas `window`/`document`)
Gravidade: Média a Alta (pode se tornar Crítica se ativar o carregamento de script ou a navegação `javascript:`)
Obrigatório:
- NÃO DEVE confiar em variáveis ​​globais implícitas ou pesquisas `window.someName` / `document.someName` que podem ser derrotadas por elementos HTML injetados com `id`/`name` correspondentes. ([Série de folhas de dicas OWASP] [8])
- DEVE evitar padrões como `let x = window.redirectTo || "/seguro"; location.assign(x);` onde `redirectTo` pode ser transferido para um elemento `<a>` cujo `href` é controlado pelo invasor (incluindo `javascript:`). ([Série de folhas de dicas OWASP] [8])
- DEVE usar declarações explícitas de variáveis, escopo local e consultas DOM explícitas (`getElementById`) em vez de acesso a propriedades nomeadas. ([Série de folhas de dicas OWASP] [8])
- Se o aplicativo inserir marcação controlada pelo usuário (mesmo higienizada), DEVE garantir que as estratégias de higienização considerem colisões `id`/`name`. ([Série de folhas de dicas OWASP] [8])
Padrões inseguros:
- `const cfg = window.config || {};` usado para URLs sensíveis à segurança.
- `const redirecionamento = window.redirectTo || "/"; location.assign (redirect);` ([Série de folhas de dicas OWASP] [8])
- Carregando scripts de valores de configuração `window.*` sem validação estrita.
Dicas de detecção:
- Procure por `window.` e `document.` usados ​​como armazenamentos de configuração (especialmente padrões de fallback `||`).
- Pesquise o uso de `location.assign/replace` com variáveis ​​que vêm das propriedades `window`/`document`.
- Procure por criação de script dinâmico (`createElement('script')`) onde `.src` vem de uma variável não local. ([Série de folhas de dicas OWASP] [8])
Consertar:
- Armazene a configuração em constantes com escopo de módulo (não em `window`/`document`) e passe-a explicitamente.
- Valide qualquer configuração semelhante a URL com listas de permissões de protocolo/origem (consulte FEJS-URL-001). ([Série de folhas de dicas OWASP] [8])
- Considere o endurecimento: higienização, CSP e (em casos limitados) congelamento de objetos sensíveis, mas trate-os como uma defesa profunda e não como um substituto para padrões de codificação seguros. ([Série de folhas de dicas OWASP] [8])
---
## 5) Heurísticas práticas de varredura (como “caçar”)
Ao digitalizar ativamente, use estes padrões de sinal alto:
- coletores DOM XSS:
  - `.innerHTML`, `.outerHTML`, `insertAdjacentHTML(`
  - `document.write(`, `document.writeln(` ([Série de folhas de dicas OWASP][2])
- Navegação perigosa/sumidouros de URL:
  - `window.location`, `location.href`, `location.assign`, `location.replace`
  - `javascript:` literais (e outros esquemas suspeitos como `data:text/html`) ([MDN Web Docs][4])
- Execução de string para código:
  - `eval(`, `nova Função`, `setTimeout("`, `setInterval("` ([MDN Web Docs][10])
- Injeção de string do manipulador de eventos:
  - `.setAttribute("on`, `.onclick =`, `.onload =` com strings ([OWASP Cheat Sheet Series][2])
- `postMessage`:
  - `postMessage(` com `"*"` como targetOrigin
  - `addEventListener("message"` sem verificações estritas da lista de permissões `event.origin` ([MDN Web Docs][5])
- Armazenamento:
  - `localStorage.setItem(` / `getItem(`, `sessionStorage.*`
  - chaves contendo `token`, `jwt`, `session`, `auth`, `refresh` ([OWASP Cheat Sheet Series][6])
- CSP e relacionados:
  - Configuração do cabeçalho `Content-Security-Policy` (servidor/borda)
  - `<meta http-equiv="Política de segurança de conteúdo" ...>`
  - CSP contendo `unsafe-inline` ou `unsafe-eval`
  - Diretivas `require-trusted-types-for` / `trusted-types` ([MDN Web Docs][1])
- Scripts de terceiros:
  - `<script src="https://...">` sem `integridade=`
  - Snippets do gerenciador de tags e caminhos de código de injeção de script dinâmico ([MDN Web Docs][12])
- Dispositivos de destruição de DOM:
  - `janela.<nome> || ...` e `documento.<nome> || ...` padrões
  - uso sensível à segurança de propriedades `window`/`document` como fontes de configuração ([OWASP Cheat Sheet Series][8])
Sempre tente confirmar:
- origem dos dados (não confiável versus confiável),
- tipo de coletor (análise de HTML, navegação, execução de código, manipulação de mensagens, armazenamento),
- controles de proteção presentes (CSP, tipos confiáveis, desinfetantes, listas de permissões estritas, validação de esquema).
---
## 6) Fontes (acessado em 27/01/2026)
Padrões primários/documentos de plataforma:
- Política de segurança de conteúdo W3C nível 2 (restrições de entrega HTML `<meta>`; diretivas não suportadas em meta CSP): `https://www.w3.org/TR/CSP2/` ([W3C][3])
- MDN: Guia CSP (CSP estrito, nonces/hashes, `unsafe-inline`/`unsafe-eval`, bloqueio de avaliação): `https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP` ([MDN Web Docs][10])
- MDN: `<meta http-equiv>` (CSP via meta e aviso sobre cabeçalhos de segurança baseados em meta): `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv` ([MDN Web Docs][1])
- MDN: `frame-ancestors` (e observe que não é suportado em `<meta>`): `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors` ([MDN Web Docs][18])
DOM XSS e coletores perigosos:
- OWASP: Folha de dicas de prevenção XSS baseada em DOM (sumidouros perigosos + padrões seguros como `textContent`): `https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [2])
- MDN: `innerHTML` (considerações de segurança): `https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML` ([MDN Web Docs][19])
- MDN: `insertAdjacentHTML` (considerações de segurança): `https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML` ([MDN Web Docs][20])
- MDN: `document.write()` / `document.writeln()` (considerações de segurança): `https://developer.mozilla.org/en-US/docs/Web/API/Document/write` e `https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln` ([MDN Web Docs][13])
Perigos do esquema de URL:
- MDN: `javascript:` URLs (execução na navegação; desencorajado; referências `window.location`): `https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript` ([MDN Web Docs][4])
Tipos confiáveis:
- W3C: Especificação de tipos confiáveis (os coletores DOM XSS incluem setters `Element.innerHTML` e `Location.href`; objetivos e limitações): `https://www.w3.org/TR/trusted-types/` ([W3C][15])
- MDN: diretiva `require-trusted-types-for`: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for` ([MDN Web Docs][11])
- MDN: diretiva `trusted-types`: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/trusted-types` ([MDN Web Docs][16])
Mensagens entre janelas:
- MDN: `window.postMessage` (orientação de segurança: especificar targetOrigin; validar origem): `https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage` ([MDN Web Docs][5])
- OWASP: Folha de dicas de segurança HTML5 (orientação sobre mensagens da Web: origem explícita, verificações rigorosas, sem `innerHTML`): `https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [6])
Scripts de terceiros e integridade:
- OWASP: Folha de referências de gerenciamento de JavaScript de terceiros (riscos e mitigações, incluindo SRI/espelhamento): `https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html` ([Série de folhas de referências OWASP] [7])
- MDN: visão geral da integridade dos sub-recursos: `https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity` ([MDN Web Docs][12])
- W3C: Especificação de integridade de sub-recursos: `https://www.w3.org/TR/sri-2/` ([W3C][21])
Derrota de DOM:
- OWASP: DOM Clobbering Prevention Cheat Sheet (nomeado risco de acesso à propriedade; exemplos de ataques envolvendo `location.assign` e `javascript:`): `https://cheatsheetseries.owasp.org/cheatsheets/DOM_Clobbering_Prevention_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][8])
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
