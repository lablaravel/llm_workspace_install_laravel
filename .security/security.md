# Diretrizes de Segurança para Desenvolvimento Laravel

Este documento estabelece diretrizes abrangentes para desenvolvimento seguro com Laravel, seguindo as melhores práticas de segurança do framework e os padrões OWASP.

## Princípios Fundamentais

### Princípio Central
Todo código Laravel deve ser seguro por padrão, seguindo o princípio "secure by default" do framework.

### Integridade e Confiabilidade
* Manter o Laravel e suas dependências sempre atualizadas
* Verificar compatibilidade entre versões de pacotes antes de integrações
* Validar informações técnicas com a documentação oficial do Laravel
* Considerar retrocompatibilidade ao atualizar versões
* Monitorar deprecações e implementar alternativas recomendadas

### Qualidade e Revisão
* Seguir as convenções de código do Laravel
* Utilizar ferramentas de qualidade (Laravel Pint, PHPStan, PHP CS Fixer)
* Implementar testes automatizados (PHPUnit, Pest)
* Revisar código antes de deploy
* Considerar edge cases e cenários de erro

## Segurança - Camadas de Proteção

### Validação e Sanitização
* Usar Form Requests para validação
* Implementar validação server-side com Request Validation
* Sanitizar dados usando os helpers do Laravel
* Implementar rate limiting com middleware
* Usar validação de tipos forte (strict_types=1)
* Implementar logs de erros com Laravel Logger
* Usar mensagens de erro amigáveis sem expor detalhes internos

### Prevenção de Vulnerabilidades
* **XSS**: Usar {{ }} ao invés de {!! !!} no Blade, exceto quando necessário
* **SQL Injection**: Usar Eloquent e Query Builder
* **CSRF**: Usar @csrf em formulários e middleware VerifyCsrfToken
* **Mass Assignment**: Definir $fillable ou $guarded em models
* **File Upload**: Validar e sanitizar uploads com Storage facade
* **Command Injection**: Usar jobs e commands do Laravel
* **Session Hijacking**: Configurar session driver seguro

### Autenticação e Autorização
* Usar Laravel Sanctum para APIs
* Implementar autenticação com Laravel Breeze ou Jetstream
* Usar Gates e Policies para autorização
* Implementar 2FA com pacotes oficiais
* Usar o sistema de roles e permissions (Spatie)
* Implementar rate limiting em rotas de autenticação
* Configurar session timeout apropriado

### Gerenciamento de Sessão
* Configurar driver de sessão seguro (Redis preferencial)
* Usar middleware de autenticação apropriado
* Implementar remember me com segurança
* Configurar session lifetime apropriado
* Usar secure cookies em produção

### Headers e Configurações
* Configurar CORS via config/cors.php
* Implementar CSP headers via middleware
* Usar HTTPS em produção
* Configurar trusted proxies
* Implementar rate limiting global

## Boas Práticas Laravel

### Estrutura e Organização
* Seguir estrutura de diretórios padrão do Laravel
* Usar service providers para configuração
* Implementar repositories quando necessário
* Organizar código por domínio em apps maiores
* Usar contracts para abstrações

### Banco de Dados
* Usar migrations para versionamento
* Implementar índices apropriados
* Usar transactions para operações críticas
* Evitar N+1 queries com eager loading
* Implementar soft deletes para dados sensíveis
* Usar Query Builder para queries complexas

### Cache e Performance
* Configurar driver de cache apropriado
* Implementar cache tags quando possível
* Usar cache para queries frequentes
* Implementar queue para jobs pesados
* Configurar horizon em produção

## Ambientes e Deploy

### Ambiente Local
* Usar .env.example como template
* Nunca commitar .env
* Usar dados fake em desenvolvimento
* Implementar docker com Laravel Sail
* Manter consistência entre ambientes

### Controle de Versão
* Usar .gitignore padrão do Laravel
* Implementar git hooks com Husky
* Nunca commitar secrets ou chaves
* Usar conventional commits
* Proteger branches principais

### Deploy e CI/CD
* Usar Laravel Forge ou Envoyer
* Implementar zero-downtime deploys
* Configurar supervisor para queues
* Usar Github Actions ou similar
* Automatizar testes no CI

## Monitoramento e Logs

### Logging
* Configurar canais de log apropriados
* Usar Laravel Telescope em desenvolvimento
* Implementar log rotation
* Centralizar logs com serviços externos
* Monitorar erros com Sentry ou similar

### Monitoramento
* Usar Laravel Pulse em produção
* Implementar health checks
* Monitorar performance com ferramentas APM
* Configurar alertas para eventos críticos
* Manter métricas de aplicação

## Backup e Recuperação

### Estratégia de Backup
* Usar Laravel Backup
* Configurar backups automáticos
* Armazenar em múltiplos locais
* Implementar backup do banco de dados
* Testar restaurações regularmente

### Disaster Recovery
* Documentar processo de recuperação
* Manter ambiente DR atualizado
* Implementar rollback plan
* Testar recuperação periodicamente
* Manter snapshots do banco

## Conformidade LGPD/GDPR

### Dados Pessoais
* Mapear dados sensíveis
* Implementar consentimento
* Usar criptografia quando necessário
* Implementar anonimização
* Manter logs de acesso

### Segurança de Dados
* Criptografar dados sensíveis
* Implementar audit trails
* Usar Laravel Encryption
* Configurar backups seguros
* Implementar data retention

## Revisão de Código

### Code Review
* Verificar padrões do Laravel
* Validar segurança e performance
* Revisar queries e N+1
* Checar tratamento de erros
* Validar logs e monitoramento

### Documentação
* Manter README atualizado
* Documentar APIs com OpenAPI
* Usar PHPDoc em classes e métodos
* Documentar configurações necessárias
* Manter changelog atualizado