---
title: Monitorização
description: Monitorização, garantia de qualidade e estratégias de teste para o Gamibot.
---

# Monitorização e Garantia de Qualidade

Esta página descreve a configuração de monitorização, métricas chave e estratégias de teste para a plataforma Gamibot.

---

## Métricas Principais

| Métrica | Objetivo | Ferramenta de Monitorização |
|---------|----------|----------------------------|
| **Latência de consulta (Esclarecimento de Dúvidas)** | < 5 seg | Application Insights |
| **Tempo de geração de quiz** | < 15 seg | Métricas LangFlow |
| **Precisão de pesquisa Qdrant (NDCG@5)** | > 0.8 | Dataset de avaliação |
| **Satisfação do aluno (NPS)** | > 7/10 | Inquérito pós-interação |
| **Uptime do sistema** | > 99.5% | Prometheus + Alerting |
| **Qualidade de embedding (similaridade cosseno)** | > 0.75 para chunks relevantes | Auditoria manual |

---

## Configuração Prometheus

### Métricas Personalizadas

```python
from prometheus_client import Counter, Histogram

# Contadores de pedidos
chat_requests = Counter(
    'gamibot_chat_requests_total',
    'Total de pedidos de chat',
    ['workflow_type', 'course_id']
)

# Histograma de latência
response_latency = Histogram(
    'gamibot_response_latency_seconds',
    'Latência de resposta em segundos',
    ['workflow_type'],
    buckets=[0.5, 1, 2, 5, 10, 30]
)

# Exemplo de utilização
@response_latency.labels(workflow_type='summarization').time()
def summarize_content(query, course_id):
    chat_requests.labels(
        workflow_type='summarization',
        course_id=course_id
    ).inc()
    # ... lógica de sumarização
```

---

## Dashboards Grafana

### Painéis Principais

| Painel | Descrição |
|--------|-----------|
| **Taxa de Pedidos** | Pedidos de chat por minuto por tipo de fluxo |
| **Latência P95** | Tempo de resposta do percentil 95 |
| **Taxa de Erros** | Erros por minuto por tipo |
| **Saúde Qdrant** | Estado da base de dados vetorial e tempos de consulta |
| **Utilização LLM** | Consumo de tokens e custos |

---

## Regras de Alerta

```yaml
# alerting_rules.yml
groups:
  - name: gamibot_alerts
    rules:
      - alert: AltaLatencia
        expr: histogram_quantile(0.95, gamibot_response_latency_seconds_bucket) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Alta latência de resposta detetada"
          description: "Latência P95 é {{ $value }}s"

      - alert: AltaTaxaErros
        expr: rate(gamibot_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Alta taxa de erros detetada"
          description: "Taxa de erros é {{ $value }} por segundo"

      - alert: QdrantInativo
        expr: up{job="qdrant"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Qdrant está inativo"
```

---

## Estratégia de Testes

### Testes Unitários

| Componente | Foco do Teste |
|------------|---------------|
| **Plugin Moodle** | Parsing de webhook, gestão de eventos |
| **Fluxo LangFlow** | Execução de nós, fluxo de dados |
| **Consultas Qdrant** | Lógica de filtro, precisão de pesquisa |
| **Extração de texto** | Parsing de PDF, PPTX, EPUB |

### Testes de Integração

| Teste | Descrição |
|-------|-----------|
| **Ingestão end-to-end** | Upload de ficheiro → Armazenamento Qdrant |
| **Fluxo de sumarização** | Consulta → LLM → Resposta |
| **Ciclo de quiz** | Geração → Respostas → Feedback |

### Testes de Aceitação do Utilizador (UAT)

| Fase | Detalhes |
|------|----------|
| **Cursos piloto** | 2–3 cursos (50+ alunos) |
| **Recolha de feedback** | Usabilidade, precisão de conteúdo, qualidade de resposta |
| **Iteração** | Refinamento de prompts e configurações |

### Testes de Desempenho

| Tipo de Teste | Cenário |
|---------------|---------|
| **Teste de carga** | 100 alunos concorrentes a consultar |
| **Teste de stress** | Ingestão de ficheiro de 1 GB |
| **Teste de resistência** | 8 horas de operação contínua |

---

## Verificações de Saúde

### Configuração de Endpoint

```python
@app.get("/health")
async def health_check():
    checks = {
        "qdrant": await check_qdrant(),
        "database": await check_database(),
        "llm_provider": await check_llm(),
    }
    
    all_healthy = all(checks.values())
    
    return {
        "status": "healthy" if all_healthy else "unhealthy",
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }
```

### Verificação de Saúde Docker

```yaml
# docker-compose.yml
services:
  langflow:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7860/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## Próximos Passos

- [Segurança e Privacidade](/pt/deployment/security) - Registo de auditoria
- [Arquitetura](/pt/deployment/architecture) - Escalabilidade para métricas
