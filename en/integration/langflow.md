---
title: LangFlow Workflows
description: LangFlow workflow configurations and exports for GamiBot AI agents.
---

# LangFlow Workflows

Each workflow in GamiBot is defined as a **LangFlow JSON configuration** that orchestrates the AI processing pipeline.

---

## Workflow Components

Each LangFlow workflow includes:

| Component | Description |
|-----------|-------------|
| **Node definitions** | Moodle API, Qdrant search, LLM calls |
| **Edge connections** | Control flow and data pipelines |
| **Tool bindings** | API keys, model selection |
| **Error handling** | Retries and fallbacks |

---

## Summarization Workflow

### Visual Structure

```
┌──────────────┐    ┌────────────────┐    ┌───────────────┐    ┌─────────────┐
│ Input Node   │ → │ Qdrant Search  │ → │ LLM Summarize │ → │ Output Node │
│ (query,      │    │ (course filter,│    │ (GPT-4,       │    │ (response)  │
│  course_id)  │    │  top-k=5)      │    │  temp=0.5)    │    │             │
└──────────────┘    └────────────────┘    └───────────────┘    └─────────────┘
```

### JSON Configuration

```json
{
  "id": "summarization_workflow",
  "name": "Content Summarization",
  "nodes": [
    {
      "id": "input_node",
      "type": "input",
      "data": {
        "fields": ["course_id", "student_query"]
      }
    },
    {
      "id": "qdrant_search",
      "type": "tool",
      "tool_name": "qdrant_vector_search",
      "parameters": {
        "collection": "course_materials",
        "query": "${student_query}",
        "filter": {"course_id": "${course_id}"},
        "top_k": 5,
        "threshold": 0.7
      }
    },
    {
      "id": "llm_summarize",
      "type": "llm",
      "model": "gpt-4",
      "system_prompt": "You are an educational summarization assistant...",
      "user_prompt": "Summarize: ${student_query}\n\nMaterials:\n${qdrant_search.results}",
      "temperature": 0.5
    },
    {
      "id": "output_node",
      "type": "output",
      "data": "${llm_summarize.response}"
    }
  ],
  "edges": [
    {"source": "input_node", "target": "qdrant_search"},
    {"source": "qdrant_search", "target": "llm_summarize"},
    {"source": "llm_summarize", "target": "output_node"}
  ]
}
```

---

## Doubt Clarification Workflow

### Visual Structure

```
┌──────────────┐    ┌────────────────┐    ┌───────────────┐    ┌────────────────┐    ┌─────────────┐
│ Input Node   │ → │ Intent Parser  │ → │ Qdrant Search │ → │ LLM Clarify    │ → │ Output Node │
│ (question)   │    │ (topic detect) │    │ (context)     │    │ (explanation)  │    │             │
└──────────────┘    └────────────────┘    └───────────────┘    └────────────────┘    └─────────────┘
```

### Key Parameters

| Node | Parameter | Value |
|------|-----------|-------|
| Qdrant Search | `top_k` | 5 |
| Qdrant Search | `threshold` | 0.6 |
| LLM Clarify | `temperature` | 0.3 |
| LLM Clarify | `model` | gpt-4 |

---

## Quiz Generation Workflow

### Visual Structure (Phase A)

```
┌──────────────┐    ┌───────────────┐    ┌────────────────┐    ┌─────────────────┐    ┌─────────────┐
│ Topic Input  │ → │ Topic Validate│ → │ Qdrant Search  │ → │ Quiz Generator  │ → │ JSON Output │
│ (agent chat) │    │ (check exists)│    │ (top-k=10)     │    │ (structured)    │    │             │
└──────────────┘    └───────────────┘    └────────────────┘    └─────────────────┘    └─────────────┘
```

### JSON Configuration (Quiz Generation)

```json
{
  "id": "quiz_generation_workflow",
  "name": "Agentic Quiz Generation",
  "type": "agent",
  "agent_config": {
    "role": "Quiz Master Agent",
    "tools": ["qdrant_search", "quiz_generator"],
    "memory": "conversation_buffer"
  },
  "nodes": [
    {
      "id": "topic_input",
      "type": "agent_input",
      "data": {
        "prompt": "Which topic would you like to be quizzed on?"
      }
    },
    {
      "id": "topic_validate",
      "type": "condition",
      "condition": "${qdrant_search.count} >= 3",
      "on_false": {
        "message": "Insufficient materials. Suggest alternatives."
      }
    },
    {
      "id": "qdrant_search",
      "type": "tool",
      "tool_name": "qdrant_vector_search",
      "parameters": {
        "collection": "course_materials",
        "query": "${topic}",
        "filter": {"course_id": "${course_id}"},
        "top_k": 10,
        "threshold": 0.65
      }
    },
    {
      "id": "quiz_generator",
      "type": "llm",
      "model": "gpt-4",
      "temperature": 0.7,
      "output_format": "json",
      "system_prompt": "Generate a quiz with structured JSON output..."
    },
    {
      "id": "json_output",
      "type": "output",
      "format": "json",
      "schema": "quiz_schema.json"
    }
  ]
}
```

---

## Data Ingestion Workflow

### Visual Structure

```
┌──────────────┐    ┌────────────────┐    ┌────────────────┐    ┌─────────────────┐    ┌─────────────┐
│ Webhook      │ → │ File Download  │ → │ Text Extract   │ → │ Embed + Chunk   │ → │ Qdrant      │
│ (file event) │    │ (Moodle API)   │    │ (by type)      │    │ (1024 tokens)   │    │ Upsert      │
└──────────────┘    └────────────────┘    └────────────────┘    └─────────────────┘    └─────────────┘
```

---

## Environment Variables

Configure LangFlow with these environment variables:

```bash
# Qdrant Configuration
QDRANT_HOST=qdrant.example.com
QDRANT_PORT=6333
QDRANT_API_KEY=your_api_key

# LLM Provider
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=...

# Moodle Integration
MOODLE_API_URL=https://moodle.example.com/webservice/rest/server.php
MOODLE_TOKEN=your_moodle_token

# Webhook Security
WEBHOOK_SECRET=your_webhook_secret
```

---

## Error Handling

Each workflow includes retry logic:

```json
{
  "error_handling": {
    "retry": {
      "max_attempts": 3,
      "backoff": "exponential",
      "initial_delay_ms": 1000
    },
    "fallback": {
      "on_qdrant_failure": "staging_db",
      "on_llm_failure": "return_cached_or_error"
    }
  }
}
```

---

## Next Steps

- [Deployment Architecture](/en/deployment/architecture) - Infrastructure setup
- [Security & Privacy](/en/deployment/security) - Data protection
