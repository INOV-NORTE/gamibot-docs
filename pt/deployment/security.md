---
title: Segurança e Privacidade
description: Medidas de segurança e considerações de privacidade para a plataforma GamiBot.
---

# Segurança e Privacidade

Esta página descreve as medidas de segurança e considerações de privacidade implementadas na plataforma GamiBot.

---

## Proteção de Dados

### Encriptação

| Camada | Padrão | Descrição |
|--------|--------|-----------|
| **Em Trânsito** | TLS 1.3 | Todas as chamadas API (Moodle ↔ LangFlow ↔ Qdrant ↔ Cliente) |
| **Em Repouso** | AES-256 | Payloads Qdrant (se dados sensíveis detetados) |
| **Chaves API** | Variáveis de ambiente | Nunca em código ou logs |

---

## Controlo de Acesso

### Isolamento de Cursos

Todas as consultas Qdrant incluem filtro `course_id` para garantir que os alunos não possam aceder a materiais de outros cursos:

```python
# Cada pesquisa tem âmbito de curso
results = qdrant_client.search(
    collection_name="course_materials",
    query_vector=embedding,
    query_filter=Filter(
        must=[
            FieldCondition(
                key="course_id",
                match=MatchValue(value=student_course_id)
            )
        ]
    )
)
```

### Autenticação

- **Tokens de sessão Moodle** validados para cada pedido API
- **Assinaturas de webhook** verificadas com HMAC-SHA256
- **Chaves API** rotacionadas regularmente

### Acesso Baseado em Funções

| Função | Capacidades |
|--------|-------------|
| **Aluno** | Consultar apenas os seus cursos |
| **Instrutor** | Gerir ingestão, ver analytics |
| **Gestor** | Administração completa do sistema |

---

## Retenção de Dados

| Tipo de Dados | Período de Retenção | Método de Purga |
|---------------|---------------------|-----------------|
| **Materiais do curso (vetores)** | Duração do curso + 1 ano | Manual pelo instrutor |
| **Histórico de chat** | 6 meses | Eliminação automática |
| **Desempenho de quiz** | 1 ano académico | Eliminação automática |
| **Logs de ingestão** | 3 meses | Eliminação automática |
| **Embeddings de utilizador** | 6 meses | Eliminação automática após término do curso |

---

## Considerações de Privacidade

### Transparência

::: info Notificação ao Aluno
Os alunos são informados de que a IA resume os seus materiais de curso através de mensagens claras na interface de chat e nas configurações do Moodle.
:::

### Opções de Opt-Out

- **Checkbox** para excluir dados do aluno do treino de LLM (se usar API OpenAI)
- **Exportação de dados** disponível mediante pedido
- **Eliminação de dados** disponível mediante pedido

### Sem Partilha com Terceiros

- Materiais **não são partilhados** com plataformas de IA externas sem consentimento explícito
- Todo o processamento pode usar **LLMs auto-hospedados** para máxima privacidade

### Conformidade com RGPD

| Direito | Implementação |
|---------|---------------|
| **Direito de Acesso** | Exportar dados do aluno em 30 dias |
| **Direito ao Apagamento** | Eliminar dados do aluno em 30 dias |
| **Direito à Portabilidade** | Exportação JSON de todos os dados pessoais |
| **Direito de Oposição** | Opt-out do processamento de IA |

---

## Segurança do Modelo

### Filtragem de Conteúdo

- **Sem geração** de conteúdo prejudicial, discriminatório ou de desonestidade académica
- Prompts do sistema incluem diretrizes de segurança explícitas
- Output é monitorizado para violações de política

### Defesa contra Injeção de Prompts

```python
def sanitize_user_input(input_text: str) -> str:
    """Prevenir ataques de injeção de prompts."""
    # Remover padrões de injeção potenciais
    dangerous_patterns = [
        "ignore previous instructions",
        "system prompt",
        "you are now",
        "forget your instructions"
    ]
    
    sanitized = input_text
    for pattern in dangerous_patterns:
        sanitized = sanitized.replace(pattern, "[FILTERED]")
    
    return sanitized
```

### Mitigação de Alucinações

- Output do LLM **estritamente restrito** a materiais recuperados (princípio RAG)
- Respostas incluem **citações de fonte**
- Scores de confiança registados para monitorização de qualidade

---

## Próximos Passos

- [Monitorização](/pt/deployment/monitoring) - Rastrear métricas de segurança
- [Arquitetura](/pt/deployment/architecture) - Configuração de infraestrutura segura
