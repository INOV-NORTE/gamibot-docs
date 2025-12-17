---
title: Fluxos LangFlow
description: Configurações e exportações de fluxos de trabalho LangFlow para agentes de IA GamiBot.
---

# Fluxos de Trabalho LangFlow

Cada fluxo de trabalho no GamiBot é definido como uma **configuração JSON LangFlow** que orquestra o pipeline de processamento de IA.

---

## Componentes de Fluxo de Trabalho

Cada fluxo de trabalho LangFlow inclui:

| Componente | Descrição |
|------------|-----------|
| **Definições de nós** | API Moodle, pesquisa Qdrant, chamadas LLM |
| **Conexões de arestas** | Fluxo de controlo e pipelines de dados |
| **Bindings de ferramentas** | Chaves API, seleção de modelo |
| **Gestão de erros** | Retries e fallbacks |

---

## Fluxo de Trabalho de Sumarização

### Estrutura Visual

```
┌──────────────┐    ┌────────────────┐    ┌───────────────┐    ┌─────────────┐
│ Nó de Entrada│ → │ Pesquisa Qdrant│ → │ LLM Sumarizar │ → │ Nó de Saída │
│ (consulta,   │    │ (filtro curso, │    │ (GPT-4,       │    │ (resposta)  │
│  course_id)  │    │  top-k=5)      │    │  temp=0.5)    │    │             │
└──────────────┘    └────────────────┘    └───────────────┘    └─────────────┘
```

### Configuração JSON

```json
{
  "id": "summarization_workflow",
  "name": "Sumarização de Conteúdo",
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
      "system_prompt": "Você é um assistente de sumarização educacional...",
      "user_prompt": "Resumir: ${student_query}\n\nMateriais:\n${qdrant_search.results}",
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

## Variáveis de Ambiente

Configure o LangFlow com estas variáveis de ambiente:

```bash
# Configuração Qdrant
QDRANT_HOST=qdrant.example.com
QDRANT_PORT=6333
QDRANT_API_KEY=your_api_key

# Fornecedor LLM
OPENAI_API_KEY=sk-...
# ou
ANTHROPIC_API_KEY=...

# Integração Moodle
MOODLE_API_URL=https://moodle.example.com/webservice/rest/server.php
MOODLE_TOKEN=your_moodle_token

# Segurança de Webhook
WEBHOOK_SECRET=your_webhook_secret
```

---

## Gestão de Erros

Cada fluxo de trabalho inclui lógica de retry:

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

## Próximos Passos

- [Arquitetura de Implantação](/pt/deployment/architecture) - Configuração de infraestrutura
- [Segurança e Privacidade](/pt/deployment/security) - Proteção de dados
