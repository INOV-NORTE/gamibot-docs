---
title: Security & Privacy
description: Security measures and privacy considerations for the GamiBot platform.
---

# Security and Privacy

This page describes the security measures and privacy considerations implemented in the GamiBot platform.

---

## Data Protection

### Encryption

| Layer | Standard | Description |
|-------|----------|-------------|
| **In Transit** | TLS 1.3 | All API calls (Moodle ↔ LangFlow ↔ Qdrant ↔ Client) |
| **At Rest** | AES-256 | Qdrant payloads (if sensitive data detected) |
| **API Keys** | Environment variables | Never in code or logs |

### Secure Communication

```
┌────────┐   TLS 1.3   ┌──────────┐   TLS 1.3   ┌────────┐
│ Client │ ←─────────→ │  Moodle  │ ←─────────→ │ Qdrant │
└────────┘             └──────────┘             └────────┘
                             ↕
                        TLS 1.3
                             ↕
                       ┌──────────┐
                       │ LangFlow │
                       └──────────┘
```

---

## Access Control

### Course Isolation

All Qdrant queries include `course_id` filter to ensure students cannot access other courses' materials:

```python
# Every search is course-scoped
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

### Authentication

- **Moodle session tokens** validated for every API request
- **Webhook signatures** verified with HMAC-SHA256
- **API keys** rotated regularly

### Role-Based Access

| Role | Capabilities |
|------|--------------|
| **Student** | Query own courses only |
| **Instructor** | Manage ingestion, view analytics |
| **Manager** | Full system administration |

---

## Data Retention

| Data Type | Retention Period | Purging Method |
|-----------|------------------|----------------|
| **Course materials (vectors)** | Duration of course + 1 year | Manual by instructor |
| **Chat history** | 6 months | Automatic deletion |
| **Quiz performance** | 1 academic year | Automatic deletion |
| **Ingestion logs** | 3 months | Automatic deletion |
| **User embeddings** | 6 months | Automatic deletion after course end |

### Automatic Purging

```sql
-- Scheduled job for chat history cleanup
DELETE FROM {local_gamibot_chat}
WHERE created_at < NOW() - INTERVAL '6 months';

-- Quiz performance cleanup
DELETE FROM {local_gamibot_quizzes}
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## Privacy Considerations

### Transparency

::: info Student Notification
Students are informed that AI summarizes their course materials through clear messaging in the chat interface and Moodle settings.
:::

### Opt-Out Options

- **Checkbox** to exclude student data from LLM training (if using OpenAI API)
- **Data export** available upon request
- **Data deletion** available upon request

### No Third-Party Sharing

- Materials are **not shared** with external AI platforms without explicit consent
- All processing can use **self-hosted LLMs** for maximum privacy

### GDPR Compliance

| Right | Implementation |
|-------|----------------|
| **Right to Access** | Export student data within 30 days |
| **Right to Erasure** | Delete student data within 30 days |
| **Right to Portability** | JSON export of all personal data |
| **Right to Object** | Opt-out of AI processing |

---

## Model Safety

### Content Filtering

- **No generation** of harmful, discriminatory, or academic dishonesty content
- System prompts include explicit safety guidelines
- Output is monitored for policy violations

### Prompt Injection Defense

```python
def sanitize_user_input(input_text: str) -> str:
    """Prevent prompt injection attacks."""
    # Remove potential injection patterns
    dangerous_patterns = [
        "ignore previous instructions",
        "system prompt",
        "you are now",
        "forget your instructions"
    ]
    
    sanitized = input_text
    for pattern in dangerous_patterns:
        sanitized = sanitized.replace(pattern, "[FILTERED]")
    
    # Escape special tokens
    sanitized = sanitized.replace("```", "'''")
    
    return sanitized
```

### Hallucination Mitigation

- LLM output **strictly constrained** to retrieved materials (RAG principle)
- Responses include **source citations**
- Confidence scores logged for quality monitoring

### Audit Trail

All LLM interactions are logged:

```json
{
  "timestamp": "2025-12-16T20:30:00Z",
  "user_id": 456,
  "course_id": 123,
  "query": "What is machine learning?",
  "response_hash": "sha256:...",
  "model": "gpt-4",
  "tokens_used": 450,
  "latency_ms": 2340
}
```

---

## Security Checklist

Before deploying to production:

- [ ] TLS certificates installed and valid
- [ ] API keys stored in environment variables
- [ ] Webhook secrets configured and validated
- [ ] Database credentials secured
- [ ] Firewall rules configured
- [ ] Access logs enabled
- [ ] Backup procedures tested
- [ ] Incident response plan documented

---

## Next Steps

- [Monitoring](/en/deployment/monitoring) - Track security metrics
- [Architecture](/en/deployment/architecture) - Secure infrastructure setup
