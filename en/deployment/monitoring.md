---
title: Monitoring
description: Monitoring, quality assurance, and testing strategies for Gamibot.
---

# Monitoring and Quality Assurance

This page describes the monitoring setup, key metrics, and testing strategies for the Gamibot platform.

---

## Key Metrics

| Metric | Target | Monitoring Tool |
|--------|--------|-----------------|
| **Query latency (Doubt Clarification)** | < 5 sec | Application Insights |
| **Quiz generation time** | < 15 sec | LangFlow metrics |
| **Qdrant search accuracy (NDCG@5)** | > 0.8 | Evaluation dataset |
| **Student satisfaction (NPS)** | > 7/10 | Post-interaction survey |
| **System uptime** | > 99.5% | Prometheus + Alerting |
| **Embedding quality (cosine similarity)** | > 0.75 for relevant chunks | Manual audit |

---

## Prometheus Configuration

### Metrics Endpoints

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'moodle'
    static_configs:
      - targets: ['moodle:9090']

  - job_name: 'langflow'
    static_configs:
      - targets: ['langflow:9090']

  - job_name: 'qdrant'
    static_configs:
      - targets: ['qdrant:6333']
    metrics_path: /metrics
```

### Custom Metrics

```python
from prometheus_client import Counter, Histogram

# Request counters
chat_requests = Counter(
    'gamibot_chat_requests_total',
    'Total chat requests',
    ['workflow_type', 'course_id']
)

# Latency histogram
response_latency = Histogram(
    'gamibot_response_latency_seconds',
    'Response latency in seconds',
    ['workflow_type'],
    buckets=[0.5, 1, 2, 5, 10, 30]
)

# Usage example
@response_latency.labels(workflow_type='summarization').time()
def summarize_content(query, course_id):
    chat_requests.labels(
        workflow_type='summarization',
        course_id=course_id
    ).inc()
    # ... summarization logic
```

---

## Grafana Dashboards

### Overview Dashboard

```json
{
  "title": "Gamibot Overview",
  "panels": [
    {
      "title": "Chat Requests per Minute",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(gamibot_chat_requests_total[5m])"
        }
      ]
    },
    {
      "title": "Response Latency P95",
      "type": "stat",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, gamibot_response_latency_seconds_bucket)"
        }
      ]
    },
    {
      "title": "Error Rate",
      "type": "graph",
      "targets": [
        {
          "expr": "rate(gamibot_errors_total[5m])"
        }
      ]
    }
  ]
}
```

### Key Panels

| Panel | Description |
|-------|-------------|
| **Request Rate** | Chat requests per minute by workflow type |
| **Latency P95** | 95th percentile response time |
| **Error Rate** | Errors per minute by type |
| **Qdrant Health** | Vector database status and query times |
| **LLM Usage** | Token consumption and costs |

---

## Alerting Rules

```yaml
# alerting_rules.yml
groups:
  - name: gamibot_alerts
    rules:
      - alert: HighLatency
        expr: histogram_quantile(0.95, gamibot_response_latency_seconds_bucket) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response latency detected"
          description: "P95 latency is {{ $value }}s"

      - alert: HighErrorRate
        expr: rate(gamibot_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} per second"

      - alert: QdrantDown
        expr: up{job="qdrant"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Qdrant is down"
```

---

## Testing Strategy

### Unit Tests

| Component | Test Focus |
|-----------|------------|
| **Moodle plugin** | Webhook parsing, event handling |
| **LangFlow workflow** | Node execution, data flow |
| **Qdrant queries** | Filter logic, search accuracy |
| **Text extraction** | PDF, PPTX, EPUB parsing |

```python
# Example: Test text extraction
def test_pdf_extraction():
    extractor = PDFExtractor()
    text = extractor.extract("test_document.pdf")
    
    assert len(text) > 0
    assert "expected_content" in text
```

### Integration Tests

| Test | Description |
|------|-------------|
| **End-to-end ingestion** | File upload → Qdrant storage |
| **Summarization flow** | Query → LLM → Response |
| **Quiz cycle** | Generation → Answers → Feedback |

```python
# Example: Integration test
async def test_summarization_flow():
    response = await client.post("/api/chat", json={
        "course_id": 123,
        "user_id": 456,
        "message": "Summarize machine learning basics"
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert len(data["summary"]) > 100
```

### User Acceptance Testing (UAT)

| Phase | Details |
|-------|---------|
| **Pilot courses** | 2–3 courses (50+ students) |
| **Feedback collection** | Usability, content accuracy, response quality |
| **Iteration** | Prompt and configuration refinement |

### Performance Testing

| Test Type | Scenario |
|-----------|----------|
| **Load test** | 100 concurrent students querying |
| **Stress test** | 1 GB file ingestion |
| **Soak test** | 8-hour continuous operation |

```bash
# Load test with k6
k6 run --vus 100 --duration 30m load_test.js
```

---

## Health Checks

### Endpoint Configuration

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

### Docker Health Check

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

## Log Aggregation

### Structured Logging

```python
import structlog

logger = structlog.get_logger()

logger.info(
    "chat_request_processed",
    user_id=456,
    course_id=123,
    workflow="summarization",
    latency_ms=2340,
    tokens_used=450
)
```

### Log Format

```json
{
  "timestamp": "2025-12-16T20:30:00.000Z",
  "level": "info",
  "event": "chat_request_processed",
  "user_id": 456,
  "course_id": 123,
  "workflow": "summarization",
  "latency_ms": 2340,
  "tokens_used": 450
}
```

---

## Next Steps

- [Security & Privacy](/en/deployment/security) - Audit logging
- [Architecture](/en/deployment/architecture) - Scaling for metrics
