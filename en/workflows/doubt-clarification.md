---
title: Doubt Clarification
description: How Gamibot answers student questions using course-specific context.
---

# Doubt Clarification Flow

**Trigger:** Student posts a specific question about course content  
**Duration:** 2–5 seconds  
**Example:** "What is the difference between supervised and unsupervised learning?"

---

## Process Overview

The doubt clarification flow provides context-aware answers to student questions, drawing exclusively from their course materials.

```
Student Question → Intent Detection → Qdrant Search → LLM Explanation → Response
```

---

## Detailed Steps

### 1. Question Intake

Student asks a specific question in the chat:

- **Context provided:**
  - `course_id` - Student's enrolled course
  - `student_id` - For personalization tracking
  - `student_level` (optional) - "beginner", "intermediate", "advanced"

### 2. Intent Detection

The system analyzes the question:

- Parse for topic, concept, and difficulty indicators
- Flag if question is out-of-scope (administrative, non-academic)
- Identify key concepts for targeted search

### 3. Qdrant Search

Retrieve relevant course materials:

```json
{
  "filter": { "course_id": "<student's course>" },
  "query": "<original question + semantic expansion>",
  "top_k": 5,
  "include": ["chunk_text", "filename", "section_id"]
}
```

### 4. Result Handling

| Scenario | Response |
|----------|----------|
| **No results (k=0)** | "I couldn't find specific materials about this in your course. Please consult your instructor or textbook section [X]." |
| **Weak results (k<3, similarity<0.6)** | Partial answer + disclaimer about limited materials |
| **Strong results (k≥3, similarity≥0.7)** | Full explanation from course materials |

### 5. Clarification Prompt

**System Prompt (Portuguese):**

```
Você é um tutor educacional paciente e claro. Um aluno tem uma dúvida.
Explique usando APENAS os materiais de aula fornecidos.
Se os materiais não cobrem completamente a resposta, diga-o explicitamente.

Nível do aluno: {student_level}

Estruture a resposta assim:
1. **Resposta direta** – responda a pergunta em 1-2 frases
2. **Explicação passo-a-passo** – detalhes (3-4 passos)
3. **Exemplo do curso** – mostre com exemplo concreto
4. **Dica de estudo** – o que rever ou como aplicar

Linguagem: Português (Portugal), clara e acessível
Tom: Educacional, paciente, sem jargão desnecessário
```

### 6. LLM Explanation

Generation parameters prioritize accuracy:

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | GPT-4 or Claude 3 | High accuracy |
| **Temperature** | 0.3 | Prioritize accuracy over creativity |
| **Format** | Step-by-step | Clear explanation structure |

### 7. Metacognitive Enhancement

Every response ends with:

- "Did this clarify your doubt? Follow-up questions welcome."
- Question + answer logged for curriculum improvement

---

## Example Interaction

::: info Student Question
"Qual é a diferença entre supervised e unsupervised learning?"
:::

**Sample Response:**

> ## Resposta Direta
> 
> A principal diferença está na presença de rótulos: no supervised learning, os dados de treino têm rótulos conhecidos; no unsupervised learning, não existem rótulos.
> 
> ## Explicação Passo-a-Passo
> 
> 1. **Supervised Learning:** O modelo aprende a partir de exemplos rotulados (input → output conhecido)
> 2. **Unsupervised Learning:** O modelo identifica padrões sem orientação prévia
> 3. **Objetivo:** Supervisado prevê; não-supervisado agrupa ou reduz dimensões
> 4. **Exemplos:** Classificação de spam (supervisado) vs. segmentação de clientes (não-supervisado)
> 
> ## Exemplo do Curso
> 
> Na aula 3, vimos o algoritmo k-means (não-supervisado) para agrupar dados de estudantes por comportamento.
> 
> ## Dica de Estudo
> 
> Reveja a secção 2.3 do material "ML_Fundamentals.pdf" para mais exemplos práticos.
> 
> ---
> *Esta resposta esclareceu a sua dúvida? Perguntas de seguimento são bem-vindas!*

---

## Adaptive Responses

The system adjusts explanations based on student level:

| Level | Adaptation |
|-------|------------|
| **Beginner** | Simpler vocabulary, more analogies, longer explanations |
| **Intermediate** | Standard academic language, balanced detail |
| **Advanced** | Technical terminology, concise explanations, references to literature |

---

## Fallback Behavior

When course materials don't cover the topic:

```
Não encontrei informação específica sobre este tópico nos materiais 
do seu curso. 

Sugestões:
• Consulte o seu docente para clarificação
• Verifique a secção [X] do livro recomendado
• Procure recursos adicionais na biblioteca digital
```

---

## Next Steps

- [Quiz Generation](/en/workflows/quiz-generation) - Adaptive assessments
- [LangFlow Integration](/en/integration/langflow) - Workflow configuration
