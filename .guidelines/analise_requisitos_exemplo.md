# Exemplo de Análise de Requisitos (Modelo Personalizável)

> **Como usar este modelo**: copie o conteúdo abaixo para um novo arquivo, substitua os blocos marcados com `{{ }}` pelas informações do seu projeto e remova as notas de instrução que não desejar manter.

---

## 1. Contexto Geral

Sistema {{tipo_de_aplicacao}} em {{stack_principal}} para:
- {{objetivo_1}}
- {{objetivo_2}}
- {{objetivo_3}}

Escopo inicial envolve {{descricao_escopo_inicial}}.

---

## 2. Perfis / Papéis

| Papel | Escopo |
|-------|--------|
| {{papel_1}} | {{responsabilidades_papel_1}} |
| {{papel_2}} | {{responsabilidades_papel_2}} |
| {{papel_opcional}} | {{responsabilidades_papel_opcional}} |

Notas:
- Defina papéis adicionais conforme necessário (ex.: Operador, Marketing).
- Utilize roles e policies do Laravel para controlar o acesso.

---

## 3. Módulos Funcionais

### 3.1. {{modulo_1_nome}}
Descrição breve do módulo.

Funcionalidades principais:
- {{funcionalidade_1}}
- {{funcionalidade_2}}
- {{funcionalidade_3}}

### 3.2. {{modulo_2_nome}}
Repita a estrutura de descrição e funcionalidades para cada módulo relevante.

Sugestão: organize os módulos por domínio (ex.: Bots, Produtos, Clientes, Campanhas, Relatórios).

---

## 4. Requisitos Funcionais

| ID | Descrição | Prioridade |
|----|-----------|------------|
| RF-001 | {{descricao_requisito_alta_prioridade}} | Alta |
| RF-002 | {{descricao_requisito_media_prioridade}} | Média |
| RF-003 | {{descricao_requisito_baixa_prioridade}} | Baixa |

Recomendações:
- Mantenha a numeração sequencial.
- Utilize critérios MoSCoW ou outro método para priorização.

---

## 5. Requisitos Não Funcionais

| Categoria | Requisito |
|-----------|-----------|
| Segurança | {{exigencia_segurança}} |
| Performance | {{exigencia_performance}} |
| Escalabilidade | {{estrategia_escalabilidade}} |
| Observabilidade | {{estrategia_observabilidade}} |

Inclua requisitos de compliance (ex.: LGPD), disponibilidade e manutenção.

---

## 6. Modelagem de Dados (Relacional)

Tabelas principais sugeridas:
1. `{{tabela_1}}` — {{descricao_tabela_1}}
2. `{{tabela_2}}` — {{descricao_tabela_2}}
3. `{{tabela_3}}` — {{descricao_tabela_3}}

Caso haja armazenamento NoSQL, descreva coleções adicionais (ex.: `messages_history`).

---

## 7. Fluxos Principais

### 7.1. {{fluxo_critico_1}}
1. {{passo_1}}
2. {{passo_2}}
3. {{passo_3}}

### 7.2. {{fluxo_critico_2}}
Liste os passos relevantes para cada fluxo de negócio essencial.

---

## 8. User Stories

| ID | Story | Critérios de Aceitação |
|----|-------|------------------------|
| US-001 | {{historia_usuario_1}} | {{criterios_aceitacao_1}} |
| US-002 | {{historia_usuario_2}} | {{criterios_aceitacao_2}} |

Sugestão: alinhe stories aos papéis definidos e às funcionalidades previstas.

---

## 9. Integrações e Dependências Externas

- {{integracao_1}} — {{detalhes_integracao_1}}
- {{integracao_2}} — {{detalhes_integracao_2}}

Indique APIs, provedores externos (ex.: WhatsApp, gateways de pagamento) e requisitos de autenticação.

---

## 10. Scheduler e Filas

- Jobs agendados: {{jobs_agendados}}
- Filas: {{filas_definidas}}
- Prioridades e SLAs: {{prioridades_slas}}

Documente cadência, workers dedicados e requisitos de monitoramento (ex.: Horizon).

---

## 11. Validações & Regras de Negócio

| Regra | Descrição |
|-------|-----------|
| R1 | {{regra_negocio_1}} |
| R2 | {{regra_negocio_2}} |
| R3 | {{regra_negocio_3}} |

Inclua regras específicas de domínio (ex.: limites de disparos, horários de atendimento, opt-out).

---

## 12. Métricas e Relatórios

- {{metrica_1}}
- {{metrica_2}}
- {{metrica_3}}

Descreva indicadores-chave (KPIs), periodicidade e visualizações desejadas.

---

## 13. Segurança / Compliance

- {{politica_seguranca_1}}
- {{politica_seguranca_2}}
- {{politica_compliance}}

Referencie padrões (ex.: OWASP, LGPD) e defina planos de resposta a incidentes.

---

## 14. Roadmap de Entregas (Sugestão)

| Fase | Escopo |
|------|--------|
| Fase 1 | {{entrega_fase_1}} |
| Fase 2 | {{entrega_fase_2}} |
| Fase 3 | {{entrega_fase_3}} |

Ajuste as fases conforme a prioridade do projeto e capacidade da equipe.

---

## 15. Estratégia de Testes

- Unit: {{escopo_teste_unitario}}
- Feature: {{escopo_teste_feature}}
- Integration: {{escopo_teste_integracao}}
- Performance: {{escopo_teste_performance}}

Documente ferramentas (ex.: PestPHP), ambientes e critérios de aceitação.

---

## 16. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| {{risco_1}} | {{mitigacao_1}} |
| {{risco_2}} | {{mitigacao_2}} |

Classifique riscos por impacto e probabilidade para priorizar ações.

---

## 17. Próximos Passos

1. {{proximo_passo_1}}
2. {{proximo_passo_2}}
3. {{proximo_passo_3}}

Finalize a análise alinhando stakeholders, validando prioridades e definindo entregáveis.

---

> **Checklist Final**
> - [ ] Todos os campos `{{ }}` foram substituídos?
> - [ ] Seções irrelevantes foram removidas ou ajustadas?
> - [ ] Stakeholders revisaram e aprovaram a versão inicial?
> - [ ] Repositório/documentos de suporte estão referenciados?


