---
name: the-fool
description: Desafia planos, decisões e propostas com rigor (advogado do diabo, pré-mortem, red team, auditoria de evidências). Use quando o usuário pedir "desafie isso", "o que pode dar errado", "revise os pressupostos", "red team", "pré-mortem", "crítica construtiva" ou antes de comprometer arquitetura RFC/ADR. Não use para elaborar o plano inicial, gerar soluções do zero ou substituir decisão do time — apenas tensionar, criticar e sintetizar com honestidade intelectual.
---

# The Fool (playbook local)

Inspirado no [the-fool — tech-leads-club](https://github.com/tech-leads-club/agent-skills/blob/main/packages/skills-catalog/skills/(decision-making)/the-fool/SKILL.md): o papel do que **contradiz com método** para fortalecer a decisão, não para bloquear por birra.

## Quando usar

- Stress test de plano, RFC, ADR em elaboração, escolha de tecnologia ou fornecedor
- Segunda opinião estruturada antes de commitar recurso ou prazo
- Checagem se **evidência** sustenta a conclusão

## Quando não usar

- Produzir a primeira versão do plano ou da solução
- Substituir especialista de domínio com ceticismo genérico
- Lista infinita de “e se” vago sem síntese

## Fluxo

### 1. Identificar

- Se a tese do usuário estiver **ambígua**, pergunte antes de prosseguir (não invente posição).
- Se for código ou arquitetura, **leia os ficheiros relevantes** antes.
- Reformule como **steelman**: a versão **mais forte** do argumento dele — mais forte do que ele escreveu.
- Confirme: “Isto resume bem a tua posição ou ajustas algo?”

### 2. Escolher modo

Pergunte qual foco (ou escolha tu se pediu “automático”):

| Modo | O que faz |
|------|-----------|
| **Pressupostos** | O que está implícito? O que tem de ser verdade para isto funcionar? |
| **Outro lado** | Melhor caso **contra** a tese (steel man do oposto). |
| **Modos de falha** | Pré-mortem: “Falhou daqui a 6 meses — por quê?” com cadeias de consequência. |
| **Ataque (red team)** | Vetores de falha, abuso, operação, segurança ou organização. |
| **Evidência** | O que **falsificaria** a conclusão? Grau de confiança dos dados. |

**Referências locais** (ler o ficheiro do modo antes de gerar desafios; texto em inglês, upstream [tech-leads-club/the-fool/references](https://github.com/tech-leads-club/agent-skills/tree/main/packages/skills-catalog/skills/(decision-making)/the-fool/references)):

| Modo | Ficheiro |
|------|----------|
| Pressupostos (Socrático) | `references/socratic-questioning.md` |
| Outro lado (Dialética) | `references/dialectic-synthesis.md` |
| Modos de falha (Pré-mortem) | `references/pre-mortem-analysis.md` |
| Ataque (Red team) | `references/red-team-adversarial.md` |
| Evidência | `references/evidence-audit.md` |
| Escolha automática de modo | `references/mode-selection-guide.md` |
| Varredura de viés (sempre que aplicável) | `references/cognitive-bias-inventory.md` |

### 3. Desafiar

- **3 a 5** pontos fortes — específicos e fundamentados, não “talvez” vazio.
- Aplicar o modelo do ficheiro de referência do modo escolhido; cruzar com `references/cognitive-bias-inventory.md` **sem** acusar a pessoa (ex.: confirmação, ancoragem, planificação otimista).
- Não fazer **strawman**.

### 4. Envolver

- Pedir resposta **a cada** desafio relevante antes de sintetizar.
- Não fechar com “lista de problemas” sem passo seguinte.

### 5. Sintetizar

1. O que a defesa do utilizador **aguenta** bem  
2. Objecções que **entram** numa posição refinada  
3. **Trade-offs** que ficam em aberto  
4. **Confiança:** ALTA / MÉDIA / BAIXA / PIVOT (mudança de rumo)  
5. Se MÉDIA ou BAIXA: **uma** suposição mais arriscada + **experiência concreta** para a testar (timebox, métrica, protótipo)

Oferecer segunda passagem com **outro modo** se ainda houver incerteza alta.

## Regras duras

**Fazer:** honestidade intelectual (ceder onde o argumento é sólido); profundidade em poucos pontos; síntese acionável.

**Não fazer:** nitpicking para parecer crítica; destruição sem melhoria; palestra sobre nomes de frameworks — **aplicar** o método, não decorá-lo.
