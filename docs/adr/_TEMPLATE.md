# ADR-{NUMERO}: [Título da Decisão]

> **Copie este arquivo para ADR-{NUMERO}-{titulo-kebab}.md antes de editar**
> Architecture Decision Record - Registro de Decisão Arquitetural (formato Nygard simplificado)

## Metadata de Integração

```yaml
---
adr_number: 001
task_id: null
task_url: null
confluence_page_id: null
confluence_url: null
github_repo: owner/repo
github_branch: null
last_sync: null
status: proposed
related_adrs: []
---
```

> **Confluence:** [Ver no Confluence](confluence_url)  
> **ADR Relacionado:** [ADR-{NUMERO}](link-adr) (se aplicável)

---

## Status

**Status Atual:** Proposto | Aceito | Depreciado | Substituído

> **Nota:** ADRs aceitos são imutáveis. Se a decisão mudar, crie um novo ADR marcando o anterior como "Substituído" e referencie-o aqui.

**Histórico:**
- YYYY-MM-DD: Criado (Status: Proposto)
- YYYY-MM-DD: Aprovado (Status: Aceito)
- YYYY-MM-DD: Substituído por [ADR-{NUMERO}](link) (Status: Substituído)

---

## Contexto e Problema

### Situação Atual

[Descreva a situação atual que motivou a necessidade de uma decisão arquitetural. Seja específico sobre o problema técnico, de negócio ou social que precisa ser resolvido.]

**Exemplo:**
O sistema atual utiliza MongoDB para persistência de dados, mas estamos enfrentando limitações em consultas complexas que requerem joins e transações ACID. Além disso, a equipe tem mais experiência com SQL e o cliente precisa de relatórios que são mais fáceis de gerar com bancos relacionais.

### Fatores Relevantes

**Técnicos:**
- [Fator técnico 1]
- [Fator técnico 2]

**Negócio:**
- [Fator de negócio 1]
- [Fator de negócio 2]

**Social/Organizacional:**
- [Fator social 1]
- [Fator social 2]

**Exemplo:**
**Técnicos:**
- Necessidade de transações ACID para operações financeiras
- Consultas complexas com múltiplos joins
- Necessidade de integridade referencial

**Negócio:**
- Equipe tem expertise em PostgreSQL
- Cliente precisa de relatórios SQL complexos
- Custo de migração vs benefício a longo prazo

**Social/Organizacional:**
- Time prefere tecnologias com comunidade ativa
- Facilita contratação de novos desenvolvedores

---

## Decisão

[Declaração clara e imperativa da decisão tomada. Use linguagem direta: "Nós iremos usar X", "Nós implementaremos Y", "Nós adotaremos Z".]

**Exemplo:**
Nós iremos usar PostgreSQL em vez de MongoDB para persistência de dados no sistema principal.

### Alternativas Consideradas

| Alternativa | Descrição | Por que foi rejeitada |
|-------------|-----------|----------------------|
| [Alternativa 1] | [Descrição breve] | [Razão da rejeição] |
| [Alternativa 2] | [Descrição breve] | [Razão da rejeição] |
| [Alternativa 3] | [Descrição breve] | [Razão da rejeição] |

**Exemplo:**
| Alternativa | Descrição | Por que foi rejeitada |
|-------------|-----------|----------------------|
| Continuar com MongoDB | Manter status quo | Não resolve problemas de transações e consultas complexas |
| MySQL | Banco relacional alternativo | Equipe tem menos experiência, menos recursos avançados |
| Híbrido (MongoDB + PostgreSQL) | Usar ambos | Complexidade desnecessária, overhead de manutenção |

---

## Racional

[Justificativa detalhada da decisão. Esta seção é crítica para IA entender as prioridades da organização e evitar "refatorações indevidas". Explique POR QUE esta opção foi escolhida entre as alternativas.]

**Exemplo:**
PostgreSQL foi escolhido porque:

1. **Transações ACID:** Necessárias para operações financeiras críticas do sistema
2. **Consultas Complexas:** Suporte nativo a joins, subqueries e window functions facilita relatórios
3. **Expertise da Equipe:** Reduz curva de aprendizado e acelera desenvolvimento
4. **Ecosistema:** Laravel tem excelente suporte para PostgreSQL com Eloquent ORM
5. **Escalabilidade:** PostgreSQL atende necessidades atuais e futuras do projeto
6. **Custo:** Open-source elimina custos de licenciamento

**Prioridades da Organização (reveladas por esta decisão):**
- Confiabilidade e integridade de dados > Flexibilidade de schema
- Produtividade da equipe > Novas tecnologias
- Soluções comprovadas > Experimentação

---

## Consequências

### Consequências Positivas

- [ ] **Benefício 1:** [Descrição do benefício e impacto]

- [ ] **Benefício 2:** [Descrição do benefício e impacto]

**Exemplo:**
- [ ] **Integridade de Dados:** Transações ACID garantem consistência em operações críticas
- [ ] **Produtividade:** Equipe desenvolve mais rápido com tecnologia conhecida
- [ ] **Relatórios:** Consultas SQL complexas facilitam geração de relatórios
- [ ] **Manutenibilidade:** Código mais simples sem necessidade de abstrações complexas
- [ ] **Contratação:** Facilita encontrar desenvolvedores com experiência em PostgreSQL

### Consequências Negativas

- [ ] **Desvantagem 1:** [Descrição da desvantagem e impacto]

- [ ] **Desvantagem 2:** [Descrição da desvantagem e impacto]

**Exemplo:**
- [ ] **Migração:** Requer migração de dados existentes (esforço estimado: 2 semanas)
- [ ] **Schema Fixo:** Menos flexibilidade para mudanças de schema comparado a NoSQL
- [ ] **Escalabilidade Horizontal:** PostgreSQL escala melhor verticalmente que horizontalmente
- [ ] **Curva de Aprendizado:** Novos membros da equipe precisam aprender PostgreSQL (mas é mais fácil que MongoDB para nossa stack)

### Trade-offs Aceitos

[Descreva explicitamente os trade-offs que foram aceitos com esta decisão.]

**Exemplo:**
- **Flexibilidade vs Consistência:** Aceitamos schema mais rígido em troca de garantias de consistência
- **Velocidade de Desenvolvimento vs Performance:** Priorizamos desenvolvimento rápido sobre otimizações prematuras
- **Simplicidade vs Escalabilidade:** Escolhemos solução mais simples que atende necessidades atuais, com plano de evolução futura

---

## Conformidade

### Como Validar que Esta Decisão Está Sendo Seguida

[Defina como a IA e desenvolvedores podem verificar se o código está seguindo esta decisão arquitetural.]

**Exemplo:**
- **Linting/Análise Estática:** Verificar que migrations usam PostgreSQL (não MongoDB)
- **Code Review:** Revisar que novos modelos usam Eloquent (não drivers MongoDB)
- **Testes:** Garantir que testes de integração usam PostgreSQL
- **Documentação:** Verificar que README menciona PostgreSQL como banco padrão

### Regras de Validação Automática

```yaml
# Exemplo de regra para validação automática
rules:
  - name: "Usar apenas PostgreSQL"
    check: "Não usar drivers MongoDB no código"
    files: ["app/**/*.php", "database/**/*.php"]
    exclude: ["tests/**"]
```

### Checklist de Conformidade

- [ ] Configuração de banco usa PostgreSQL
- [ ] Migrations são compatíveis com PostgreSQL
- [ ] Modelos usam Eloquent (não drivers NoSQL)
- [ ] Testes usam PostgreSQL
- [ ] Documentação menciona PostgreSQL
- [ ] CI/CD configurado para PostgreSQL

---

## Implementação

### Passos de Implementação

1. [ ] **Passo 1:** [Descrição do passo]
2. [ ] **Passo 2:** [Descrição do passo]
3. [ ] **Passo 3:** [Descrição do passo]

**Exemplo:**
1. [ ] Configurar PostgreSQL no ambiente de desenvolvimento
2. [ ] Criar script de migração de dados do MongoDB para PostgreSQL
3. [ ] Atualizar configurações do Laravel (.env)
4. [ ] Executar migração de dados em ambiente de staging
5. [ ] Validar integridade dos dados migrados
6. [ ] Atualizar documentação
7. [ ] Deploy em produção

### Arquivos Impactados

| Arquivo/Diretório | Tipo de Mudança | Prioridade |
|-------------------|-----------------|------------|
| `config/database.php` | Configuração | Alta |
| `database/migrations/` | Migrations | Alta |
| `.env.example` | Configuração | Média |
| `README.md` | Documentação | Média |

---

## Referências e Links

### Documentação Externa

- [Link para documentação da tecnologia escolhida]
- [Link para guias de migração, se aplicável]
- [Link para ADRs relacionados]

**Exemplo:**
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Laravel Database: https://laravel.com/docs/database
- ADR-002: Migração de Dados MongoDB → PostgreSQL

### ADRs Relacionados

- **Substitui:** [ADR-{NUMERO}](link) (se este ADR substitui outro)
- **Relacionado:** [ADR-{NUMERO}](link) (se há ADRs relacionados)
- **Depende de:** [ADR-{NUMERO}](link) (se esta decisão depende de outra)

---

## Notas Adicionais

### Decisões Futuras que Podem Afetar Este ADR

- [Nota sobre possíveis mudanças futuras]
- [Nota sobre evolução esperada]

**Exemplo:**
- Se no futuro precisarmos de escalabilidade horizontal extrema, podemos considerar read replicas ou sharding
- Se surgirem necessidades de schema altamente flexível, podemos avaliar híbrido PostgreSQL + documento storage

### Lições Aprendidas

- [Lição 1]
- [Lição 2]

**Exemplo:**
- Decisões arquiteturais devem considerar não apenas aspectos técnicos, mas também expertise da equipe
- Trade-offs devem ser documentados explicitamente para evitar revisões desnecessárias no futuro

---

## Checklist de Validação

### Antes de Aprovar ADR

- [ ] Contexto e problema estão claramente definidos
- [ ] Decisão é declarativa e imperativa
- [ ] Alternativas foram consideradas e documentadas
- [ ] Racional explica POR QUE esta opção foi escolhida
- [ ] Consequências (positivas e negativas) estão listadas
- [ ] Trade-offs aceitos estão explícitos
- [ ] Métodos de validação de conformidade estão definidos
- [ ] Implementação tem passos claros

### Para Uso com IA

- [ ] Racional é detalhado o suficiente para IA entender prioridades
- [ ] Consequências negativas estão explícitas para evitar "refatorações indevidas"
- [ ] Seção de Conformidade permite validação automática
- [ ] ADR é imutável após aceito (novas decisões criam novo ADR)

---

**Data de Criação:** YYYY-MM-DD  
**Autor(es):** [Nome(s)]  
**Revisado por:** [Nome(s)]  
**Aprovado por:** [Nome(s)]  
**Versão:** 1.0
