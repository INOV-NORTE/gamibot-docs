---
title: Technologies
description: Core technologies and key dependencies used in the Gamibot AI-enhanced Moodle platform.
---

# Core Technologies

This page describes the technology stack and key dependencies that power the Gamibot platform.

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **LMS** | Moodle (custom PHP plugins) | Course and resource management |
| **Orchestration** | LangFlow | Workflow design and agent orchestration |
| **Vector Database** | Qdrant | Semantic search and vector storage |
| **Embeddings** | Configurable (OpenAI, local, etc.) | Convert text to dense vectors |
| **LLM** | GPT-4, Claude 3, or local alternatives | Agent reasoning and generation |
| **ORM** | Prisma | Database abstraction (if using relational DB) |
| **Backend** | Node.js + Express or Python | API layer and webhook handlers |
| **File Processing** | Unstructured, PyPDF2, python-pptx | Extract text from diverse formats |

---

## Key Dependencies

### Moodle Plugins

- **`local_gamibot_manager`** - Webhook dispatcher for file upload events

### LangFlow Integration

- Bundled Qdrant integration for vector operations
- LLM connectors for multiple providers (OpenAI, Anthropic, local models)

### Vector Operations

- **Qdrant client library** - Python or Node.js SDK for vector operations
- Collections support sharding and replication for scalability

### Text Extraction Libraries

| Format | Library | Notes |
|--------|---------|-------|
| **PDF** | PyPDF2, pdfplumber | OCR fallback available |
| **PowerPoint** | python-pptx | Extracts slides + speaker notes |
| **ePub** | ebooklib | Chapter parsing support |
| **Word** | python-docx | Full document support |
| **Plain Text** | Native | UTF-8 encoding |

---

## Embedding Models

The platform supports configurable embedding models:

### OpenAI Embeddings

```json
{
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "max_tokens": 8191
}
```

### Local Alternatives

- **Sentence Transformers** - Self-hosted option for privacy
- **all-MiniLM-L6-v2** - Lightweight, efficient embeddings
- **BGE** - Multilingual support

---

## LLM Provider Options

### Cloud Providers

| Provider | Model | Best For |
|----------|-------|----------|
| OpenAI | GPT-4, GPT-4o | General purpose, high quality |
| Anthropic | Claude 3 Opus/Sonnet | Long context, safety |
| Google | Gemini | Multimodal, cost-effective |

### Local/Self-Hosted

| Model | Framework | Notes |
|-------|-----------|-------|
| Llama 3 | Ollama, vLLM | Open source, privacy |
| Mistral | Ollama, vLLM | Efficient, multilingual |
| Phi-3 | Ollama | Small, fast |

---

## Infrastructure Requirements

See the [Deployment Architecture](/en/deployment/architecture) page for detailed infrastructure specifications.
