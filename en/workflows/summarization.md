---
title: Content Summarization
description: How Gamibot generates personalized summaries of course materials using RAG.
---

# Content Summarization Flow

**Trigger:** Student requests summary via chat interface  
**Duration:** 3–8 seconds  
**Example:** "Summarize topic: Recurrent Neural Networks"

---

## Process Overview

The summarization flow uses retrieval-augmented generation (RAG) to create personalized summaries based on the student's course materials.

```
Student Query → Qdrant Search → Context Building → LLM Synthesis → Response
```

---

## Detailed Steps

### 1. Query Input

Student submits a natural language request through the chat interface:

- **Context provided:**
  - `course_id` - Student's enrolled course
  - `student_id` - For personalization
  - `language` - Response language (e.g., pt-PT)

### 2. Context Building

The system prepares the search:

- Build Qdrant filter: `course_id == student's course`
- Optional: Narrow by `section_id` or `module_id` if specified
- Extract topic keywords from student query

### 3. Semantic Search

Find relevant course materials:

```json
{
  "collection": "course_materials",
  "query_vector": "<embedded student query>",
  "filter": { "course_id": 123 },
  "top_k": 5,
  "threshold": 0.7
}
```

### 4. Result Evaluation

| Scenario | Action |
|----------|--------|
| `k < 3` results | Return: "Insufficient materials; please consult instructor" |
| `k >= 3` results | Proceed to summarization |

### 5. Prompt Construction

The LLM receives a structured prompt:

**System Prompt:**
```
You are an educational assistant for Portuguese-speaking university students. 
Summarize the following course materials clearly and concisely.

Structure your response as:
1. **Definição** – What is this concept?
2. **Conceitos principais** – Key points to understand
3. **Exemplos práticos** – Real-world or course examples
4. **Aplicações** – How is this used?

Language: Portuguese (Portugal)
Tone: Educational, accessible
Length: 200–400 words
```

**User Prompt:**
```
Student's request: {query}

Course materials retrieved:
{chunk_1}
{chunk_2}
{chunk_3}
{chunk_4}
{chunk_5}
```

### 6. LLM Summarization

Generation parameters:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | GPT-4 or Claude 3 | High quality output |
| **Temperature** | 0.5 | Balance consistency and creativity |
| **Max tokens** | 600 | Sufficient for structured response |

### 7. Response Delivery

The response is formatted for readability:

- **Format:** Markdown with headings and bullet points
- **Citation:** "Based on materials from: [filename, section]"
- **Quality logging:** Similarity scores recorded for QA

---

## Example Response

::: info Student Query
"Summarize topic: Redes Neurais Recorrentes"
:::

**Sample Response:**

> ## Definição
> 
> Redes Neurais Recorrentes (RNNs) são um tipo de rede neural artificial projetada para processar sequências de dados, mantendo uma "memória" interna de informações anteriores.
> 
> ## Conceitos Principais
> 
> - **Estados ocultos:** Armazenam informação das entradas anteriores
> - **Backpropagation Through Time (BPTT):** Algoritmo de treino específico
> - **Vanishing gradient:** Problema comum em sequências longas
> 
> ## Exemplos Práticos
> 
> - Previsão de texto (autocompletar)
> - Tradução automática
> - Análise de sentimento
> 
> ## Aplicações
> 
> RNNs são utilizadas em processamento de linguagem natural, reconhecimento de voz, e análise de séries temporais.
> 
> *Baseado em materiais de: lecture_05_rnn.pdf, Secção 3*

---

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `top_k` | 5 | Number of chunks to retrieve |
| `similarity_threshold` | 0.7 | Minimum relevance score |
| `max_response_length` | 400 words | Summary length limit |
| `temperature` | 0.5 | LLM creativity level |

---

## Next Steps

- [Doubt Clarification](/en/workflows/doubt-clarification) - Question answering flow
- [Quiz Generation](/en/workflows/quiz-generation) - Adaptive assessments
