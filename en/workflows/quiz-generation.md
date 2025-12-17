---
title: Quiz Generation
description: How GamiBot creates personalized quizzes with formative feedback using an agentic approach.
---

# Agentic Quiz Generation Flow

**Trigger:** Student requests a practice quiz via agent interaction  
**Duration:** Phase A (generation): 5–15 seconds | Phase B (feedback): 2–10 seconds  
**Example:** "Create a 5-question quiz on Redes Neurais, multiple choice"

---

## Overview

The quiz generation uses an **agentic approach** where an AI "Quiz Master Agent" orchestrates the entire process, from topic selection to feedback delivery.

```
Phase A: Student Intent → Topic Selection → Material Retrieval → Quiz Synthesis
Phase B: Student Answers → Grading → Error Analysis → Formative Feedback
```

---

## Phase A: Quiz Generation

### 1. Agent Initialization

The Quiz Master Agent is initialized with:

- **Role:** "Quiz Master Agent"
- **Goal:** Create personalized practice quiz
- **Tools:** Qdrant search, LLM for question generation
- **Context:** `course_id`, `student_id`, `student_quiz_history` (optional)

### 2. Topic Elicitation

Agent-student dialogue:

> **Agent:** "Which topic would you like to be quizzed on?"  
> **Student:** "Redes Neurais"  
> **Agent:** *Validates topic exists in Qdrant for the course*

### 3. Quiz Format Selection

> **Agent:** "Prefer true/false or multiple choice? How many questions (3–10)?"  
> **Student:** "5 multiple choice"

Agent stores: `topic`, `format`, `num_questions`

### 4. Material Retrieval

Qdrant search for quiz content:

```json
{
  "collection": "course_materials",
  "query": "<topic embeddings>",
  "filter": { "course_id": "<student's course>" },
  "top_k": 10,
  "threshold": 0.65
}
```

::: tip Why top_k=10?
More chunks retrieved = greater variety in question generation
:::

### 5. Quiz Validation

| Check | Action |
|-------|--------|
| `k < 3` materials | Agent suggests alternative topics |
| `k >= 3` materials | Proceed to question generation |

### 6. Question Generation

**System Prompt:**

```
You are an expert quiz designer for university students.
Generate {num_questions} {format} questions based on the provided course materials.

Requirements:
- Each question must test a distinct learning objective
- Difficulty progression: first 2 easy, next 2 medium, last 1 hard
- Distractors must be plausible but clearly incorrect
- All content MUST come from the provided materials
- Language: Portuguese (Portugal)

Output format: JSON with exact structure below.
```

**Generation Parameters:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Temperature** | 0.7 | Balance diversity and accuracy |
| **Output** | Structured JSON | Consistent parsing |

### 7. JSON Quiz Structure

```json
{
  "quiz_id": "uuid",
  "course_id": 123,
  "topic": "Redes Neurais",
  "format": "multiple_choice",
  "num_questions": 5,
  "created_at": "2025-12-16T20:30:00Z",
  "materials_used": ["chunk_id_1", "chunk_id_2"],
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "difficulty": "easy",
      "text": "O que é uma rede neural artificial?",
      "options": [
        {"label": "A", "text": "Um modelo computacional inspirado no cérebro humano"},
        {"label": "B", "text": "Uma rede de computadores interligados"},
        {"label": "C", "text": "Uma arquitetura de hardware específica"},
        {"label": "D", "text": "Um algoritmo de ordenação de dados"}
      ],
      "correct_answer": "A",
      "explanation": "Uma rede neural artificial é um modelo computacional...",
      "source_chunk": "chunk_id_1"
    }
  ]
}
```

### 8. Response Delivery

- Agent returns only the JSON quiz object
- Client renders quiz in interactive format
- Student completes quiz in Moodle chat or web interface

---

## Phase B: Answer Feedback

### 1. Answer Submission

Student submits responses:

```json
{
  "quiz_id": "uuid",
  "answers": [
    {"question_id": 1, "answer": "A"},
    {"question_id": 2, "answer": "C"},
    {"question_id": 3, "answer": "B"}
  ]
}
```

### 2. Grading

For each answer:

- Compare student answer vs. `correct_answer`
- Calculate: `score = correct / num_questions`
- Mark: ✅ (correct) / ❌ (incorrect)

### 3. Error Analysis

For incorrect answers:

- Retrieve source chunks for those questions
- Categorize error type:

| Error Type | Description |
|------------|-------------|
| **Concept misunderstanding** | Fundamental confusion about the topic |
| **Careless mistake** | Correct understanding, incorrect selection |
| **Knowledge gap** | Topic not fully studied |

### 4. Formative Feedback Generation

For each incorrect question:

```
❌ Pergunta 2: Incorreta

**Sua resposta:** C - "Uma técnica de compressão"
**Resposta correta:** A - "Um método de regularização"

**Explicação:** Dropout é uma técnica de regularização que 
aleatoriamente desativa neurónios durante o treino para 
prevenir overfitting. Não está relacionado com compressão de dados.

**Reveja:** Secção 3.2 em "lecture_04_regularization.pdf"
```

### 5. Overall Feedback

```
📊 Resultado: 3/5 corretas (60%)

✅ **Pontos fortes:**
   Você demonstra boa compreensão de conceitos básicos de redes neurais.

📚 **Áreas a melhorar:**
   Foque em técnicas de regularização e otimização.

🎯 **Próximos passos:**
   • Reveja os materiais sobre regularização
   • Tente outro quiz sobre este tópico
   • Avance para "Redes Convolucionais"
```

### 6. Learning Loop

- Store quiz performance in student profile
- Recommend related topics for further study
- Offer options:
  - "Generate another quiz on this topic?"
  - "Move to [next topic]?"

---

## Quiz Prompt Template (Portuguese)

```
Você é um expert em design de testes educacionais para alunos universitários.
Crie {num_questions} questões {format} baseadas nos materiais de aula fornecidos.

Requisitos:
- Cada questão testa um objetivo de aprendizagem distinto
- Progressão de dificuldade: primeiras 2 fáceis, próximas 2 médias, última 1 difícil
- Distratores plausíveis mas claramente incorretos
- TODO conteúdo vem dos materiais fornecidos
- Linguagem: Português (Portugal)
- Formato: JSON exato como especificado

---

Materiais de aula:
{chunk_1}
{chunk_2}
{chunk_3}
...

Gere as questões agora. Responda APENAS com JSON válido.
```

---

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `min_questions` | 3 | Minimum quiz length |
| `max_questions` | 10 | Maximum quiz length |
| `difficulty_distribution` | progressive | Easy → Medium → Hard |
| `feedback_detail` | full | Include explanations and references |

---

## Next Steps

- [Moodle Plugin](/en/integration/moodle-plugin) - Integration architecture
- [Monitoring](/en/deployment/monitoring) - Track quiz performance metrics
