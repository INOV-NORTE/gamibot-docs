# GamiBot
## Comprehensive Project Documentation

**Organization:** Pedagogical Innovation Center (CIP), Polytechnic of Porto (IPP)  
**Last Updated:** December 2025  
**Status:** Active Development

---

## Executive Summary

This document provides comprehensive technical and conceptual documentation for a Moodle plugin that integrates Large Language Model (LLM) agents with vector database technology to deliver personalized learning experiences. The system consists of four primary workflows: Data Ingestion, Content Summarization, Doubt Clarification, and Agentic Quiz Generation.

The plugin enables:
- Automatic ingestion of diverse course materials (PDFs, PPTs, ePub, text documents)
- Real-time retrieval-augmented generation (RAG) for personalized summaries
- Intelligent doubt clarification based on course context
- Adaptive quiz generation with formative feedback

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Technologies](#core-technologies)
3. [Workflow Specifications](#workflow-specifications)
4. [Data Ingestion Pipeline](#data-ingestion-pipeline)
5. [Content Summarization Flow](#content-summarization-flow)
6. [Doubt Clarification Flow](#doubt-clarification-flow)
7. [Agentic Quiz Generation Flow](#agentic-quiz-generation-flow)
8. [Integration Points](#integration-points)
9. [Security and Privacy](#security-and-privacy)
10. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### Overview

The plugin operates as a distributed system with three main components:

1. **Moodle LMS** – Learning Management System hosting course content and student data
2. **LangFlow Orchestration Layer** – Workflow automation and LLM agent orchestration
3. **Vector Database (Qdrant)** – Semantic search and retrieval of ingested materials

### Architectural Diagram

┌─────────────────────────────────────────────────────────────┐
│                      Moodle LMS                              │
│                  (Course Management)                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Courses │ Resources │ Activities │ Student Progress    │  │
│  │ Files   │ Metadata  │ Assessment │ Interactions        │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                     │
              │ Webhooks            │ API Queries
              ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    LangFlow Workflows                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ • Data Ingestion Pipeline                              │  │
│  │ • Content Summarization Agent                          │  │
│  │ • Doubt Clarification Agent                            │  │
│  │ • Quiz Generation Agent (with feedback loop)           │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                     │
              │ Embeddings          │ Vector Queries
              ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Qdrant Vector DB                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Collections:                                            │  │
│  │ • course_materials (vectors + metadata)                │  │
│  │ • course_metadata (course_id, section_id, file_type)  │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

### Data Flow Principles

- **Course-scoped filtering:** All Qdrant queries are filtered by `course_id` to ensure student access only to their own course materials
- **Metadata preservation:** File origin, section, module, and mimetype are retained for context
- **Agentic orchestration:** LLM agents control workflow logic, tool invocation, and decision-making
- **Fallback strategies:** When insufficient materials exist, agents provide educational guidance

---

## Core Technologies

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **LMS** | Moodle (custom PHP plugins) | Course and resource management |
| **Orchestration** | LangFlow | Workflow design and agent orchestration |
| **Vector Database** | Qdrant | Semantic search and vector storage |
| **Embeddings** | (Configurable: OpenAI, local, etc.) | Convert text to dense vectors |
| **LLM** | GPT-4, Claude 3, or local alternatives | Agent reasoning and generation |
| **ORM** | Prisma | Database abstraction (if using relational DB) |
| **Backend** | Node.js + Express or Python | API layer and webhook handlers |
| **File Processing** | Unstructured, PyPDF2, python-pptx | Extract text from diverse formats |

### Key Dependencies

- **Moodle plugins:** `local_gamibot_manager` (webhook dispatcher)
- **LangFlow:** Bundled Qdrant integration, LLM connectors
- **Qdrant client library:** Python or Node.js SDK for vector operations
- **Text extraction:** PDF → PyPDF2/pdfplumber; PPT → python-pptx; ePub → ebooklib; TXT → native

---

## Workflow Specifications

### 1. Data Ingestion Pipeline

**Trigger:** File uploaded to Moodle course resource/activity  
**Duration:** 5–30 seconds (depends on file size)  
**Scope:** Supports PDF, Word (.docx), PPT (.pptx), ePub, plain text

#### Process Flow

\begin{figure}
\centering
\includegraphics[width=0.9\textwidth]{data_ingestion_flow.png}
\caption{Data Ingestion Pipeline: Moodle webhook → text extraction → chunking → embedding → Qdrant upsert}
\label{fig:ingestion}
\end{figure}

#### Detailed Steps

1. **Webhook Trigger**
   - Moodle event observer fires on `\core\event\content_uploaded`
   - Payload: `course_id`, `module_id`, `section_id`, `file_url`, `filename`, `mimetype`
   - Verification: HMAC secret validation (security)

2. **Validation**
   - Check webhook signature
   - Verify supported file type (whitelist: PDF, DOCX, PPTX, EPUB, TXT)
   - Validate course exists in system

3. **File Retrieval**
   - Download file from Moodle file storage (authenticated request)
   - Handle timeouts (files >100MB logged as warning)

4. **Content Extraction**
   - **PDF:** PyPDF2 or pdfplumber for text + OCR fallback
   - **DOCX:** python-docx library
   - **PPTX:** python-pptx with slide + notes extraction
   - **EPUB:** ebooklib for chapter parsing
   - **TXT:** Direct read (UTF-8)

5. **Content Segmentation**
   - Recursive character splitter (chunk size: 1024 tokens, overlap: 200 tokens)
   - Preserves semantic coherence within chunks

6. **Embedding Generation**
   - Model: Configurable (default: OpenAI `text-embedding-3-small`)
   - Dimension: 1536 for OpenAI, varies by model
   - Batching: Process up to 25 chunks per request

7. **Qdrant Upsert**
   - Collection: `course_materials`
   - Vector ID: SHA256(course_id + module_id + chunk_index)
   - Metadata:
     {
       "course_id": 123,
       "module_id": 456,
       "section_id": 789,
       "filename": "lecture_01.pdf",
       "file_type": "pdf",
       "chunk_index": 2,
       "source": "moodle",
       "uploaded_date": "2025-12-16T20:00:00Z",
       "chunk_text": "..."
     }

#### Error Handling

| Error | Recovery |
|-------|----------|
| File not found | Log and notify admin; skip ingestion |
| Unsupported type | Log warning; skip file |
| Extraction fails | Fallback to filename indexing; alert instructor |
| Embedding API down | Queue for retry (exponential backoff) |
| Qdrant unavailable | Store in staging DB; sync on recovery |

#### Metadata Schema

{
  "collection_name": "course_materials",
  "vectors": {
    "size": 1536,
    "distance": "Cosine"
  },
  "payload_schema": {
    "course_id": "integer",
    "module_id": "integer",
    "section_id": "integer",
    "filename": "text",
    "file_type": "keyword",
    "source": "keyword",
    "uploaded_date": "datetime",
    "chunk_text": "text"
  }
}

---

### 2. Content Summarization Flow

**Trigger:** Student requests summary via chat interface  
**Duration:** 3–8 seconds  
**Example:** "Summarize topic: Recurrent Neural Networks"

#### Process Flow

\begin{figure}
\centering
\includegraphics[width=0.9\textwidth]{content_summarization_flow.png}
\caption{Summarization Flow: Query parsing → Qdrant filtered search → LLM synthesis → response}
\label{fig:summarization}
\end{figure}

#### Detailed Steps

1. **Query Input**
   - Student submits natural language request
   - Context: `course_id`, `student_id`, `language` (pt-PT)

2. **Context Building**
   - Build Qdrant filter: `course_id == student's course`
   - Optional: Narrow by `section_id` or `module_id` if specified
   - Extract topic keywords from student query

3. **Semantic Search**
   - Embed student query using same model as ingestion
   - Search Qdrant: top-k=5-10 most relevant chunks
   - Threshold: min similarity 0.7 (configurable)

4. **Result Evaluation**
   - If `k < 3`: Return message "Insufficient materials; please consult instructor"
   - If `k ≥ 3`: Proceed to summarization

5. **Prompt Construction**
   - System prompt: "You are an educational assistant. Summarize the following course materials in a clear, structured way for a Portuguese-speaking student. Use 200–400 words. Organize by: Definition → Key concepts → Examples → Applications"
   - User prompt: Concatenate retrieved chunks
   - Language: Portuguese (pt-PT)

6. **LLM Summarization**
   - Model: GPT-4 or Claude 3 (configurable)
   - Temperature: 0.5 (balances consistency and creativity)
   - Output: Structured summary with clear sections

7. **Response Delivery**
   - Format: Markdown with headings, bullet points, examples
   - Citation: Include "Based on materials from: [filename, section]"
   - Confidence: Log similarity scores for quality assurance

#### Prompt Template

System:
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

---

Student's request: {query}

Course materials retrieved:
{chunk_1}
{chunk_2}
{chunk_3}
{chunk_4}
{chunk_5}

---

### 3. Doubt Clarification Flow

**Trigger:** Student posts a specific question about course content  
**Duration:** 2–5 seconds  
**Example:** "What is the difference between supervised and unsupervised learning?"

#### Process Flow

\begin{figure}
\centering
\includegraphics[width=0.9\textwidth]{doubt_clarification_flow.png}
\caption{Doubt Clarification Flow: Question → Qdrant search → LLM explanation → feedback}
\label{fig:doubt}
\end{figure}

#### Detailed Steps

1. **Question Intake**
   - Student asks specific question in chat
   - Context: `course_id`, `student_id`, `student_level` (optional: "beginner", "intermediate", "advanced")

2. **Intent Detection**
   - Parse question for topic, concept, and difficulty indicators
   - Flag if question is out-of-scope (administrative, non-academic)

3. **Qdrant Search**
   - Filter: `course_id == student's course`
   - Search query: Original question + semantic expansion
   - Retrieve: top-k=5 most relevant chunks
   - Include: Chunk source (filename, section) for transparency

4. **Result Handling**
   - **No results (k=0):** Respond: "I couldn't find specific materials about this in your course. Please consult your instructor or textbook section [X]."
   - **Weak results (0 < k < 3, similarity < 0.6):** Mix: partial answer from materials + disclaimer
   - **Strong results (k ≥ 3, similarity ≥ 0.7):** Proceed to full explanation

5. **Clarification Prompt**
   - System: "You are a patient educational tutor. A student has a doubt. Explain clearly, step-by-step, using ONLY the provided course materials. If the materials don't fully answer, say so explicitly."
   - User: "Student question: {question}\n\nCourse materials:\n{chunks}"
   - Adaptivity: Adjust language complexity based on `student_level`

6. **LLM Explanation**
   - Model: GPT-4 or Claude 3
   - Temperature: 0.3 (prioritize accuracy over creativity)
   - Format: Step-by-step explanation with examples from course

7. **Metacognitive Enhancement**
   - End response with: "Did this clarify your doubt? Follow-up questions welcome."
   - Log question + answer for curriculum improvement

#### Prompt Template (pt-PT)

System:
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

---

Dúvida do aluno: {question}

Materiais de aula:
{chunk_1}
{chunk_2}
{chunk_3}

---

### 4. Agentic Quiz Generation Flow

**Trigger:** Student requests a practice quiz via agent interaction  
**Duration:** Phase A (generation): 5–15 seconds | Phase B (feedback): 2–10 seconds  
**Example:** "Create a 5-question quiz on Redes Neurais, multiple choice"

#### Process Flow

**Phase A: Quiz Generation**

\begin{figure}
\centering
\includegraphics[width=0.9\textwidth]{quiz_generation_phase_a.png}
\caption{Quiz Generation Phase A: Student intent → agent orchestration → topic selection → material retrieval → quiz synthesis}
\label{fig:quiz_a}
\end{figure}

**Phase B: Answer Feedback**

\begin{figure}
\centering
\includegraphics[width=0.9\textwidth]{quiz_generation_phase_b.png}
\caption{Quiz Generation Phase B: Student answers → grading → error analysis → formative feedback}
\label{fig:quiz_b}
\end{figure}

#### Phase A – Quiz Generation (Detailed)

1. **Agent Initialization**
   - Role: "Quiz Master Agent"
   - Goal: Create personalized practice quiz
   - Tools available: Qdrant search, LLM for question generation
   - Context: `course_id`, `student_id`, `student_quiz_history` (optional)

2. **Topic Elicitation**
   - Agent asks: "Which topic would you like to be quizzed on?"
   - Student response: "Redes Neurais" or broader topic
   - Agent validates topic exists in Qdrant for the course

3. **Quiz Format Selection**
   - Agent asks: "Prefer true/false or multiple choice? How many questions (3–10)?"
   - Student selects: e.g., "5 multiple choice"
   - Agent stores: `topic`, `format`, `num_questions`

4. **Material Retrieval (Qdrant)**
   - Search: topic embeddings in `course_materials` collection
   - Filter: `course_id == student's course`
   - Retrieve: top-k=10 chunks (more breadth for question variety)
   - Threshold: min similarity 0.65

5. **Quiz Validation**
   - If insufficient materials (k < 3): Agent suggests alternative topics
   - If materials adequate: Proceed to generation

6. **Question Generation**
   - System prompt:
     You are an expert quiz designer for university students.
     Generate {num_questions} {format} questions based on the provided course materials.
     
     Requirements:
     - Each question must test a distinct learning objective
     - Difficulty progression: first 2 easy, next 2 medium, last 1 hard
     - Distractors must be plausible but clearly incorrect
     - All content MUST come from the provided materials
     - Language: Portuguese (Portugal)
     
     Output format: JSON with exact structure below.
   - User prompt: Concatenate top-k chunks with section labels
   - Temperature: 0.7 (balance diversity and accuracy)

7. **JSON Quiz Construction**
   - Output format:
     {
       "quiz_id": "uuid",
       "course_id": 123,
       "topic": "Redes Neurais",
       "format": "multiple_choice",
       "num_questions": 5,
       "created_at": "2025-12-16T20:30:00Z",
       "materials_used": ["chunk_id_1", "chunk_id_2", ...],
       "questions": [
         {
           "id": 1,
           "type": "multiple_choice",
           "text": "O que é uma rede neural artificial?",
           "options": [
             {"label": "A", "text": "Um modelo computacional..."},
             {"label": "B", "text": "Uma rede de computadores..."},
             {"label": "C", "text": "Uma arquitetura de hardware..."},
             {"label": "D", "text": "Um algoritmo de ordenação..."}
           ],
           "correct_answer": "A",
           "explanation": "Uma rede neural artificial é...",
           "source_chunk": "chunk_id_1"
         },
         ...
       ]
     }

8. **Response Delivery**
   - Agent returns ONLY the JSON quiz object
   - Client renders quiz in interactive format
   - Student completes quiz in Moodle chat or web interface

#### Phase B – Answer Feedback (Detailed)

1. **Answer Submission**
   - Student provides responses: e.g., `[1:A, 2:C, 3:Verdadeiro, ...]`
   - Agent parses answers

2. **Grading**
   - Compare each student answer vs. `correct_answer`
   - Calculate: `score = correct / num_questions`
   - Mark: Green (correct) / Red (incorrect)

3. **Error Analysis**
   - Identify incorrect answers
   - Retrieve source chunks for those questions
   - Categorize errors: "concept misunderstanding", "careless mistake", "knowledge gap"

4. **Formative Feedback Generation**
   - For each incorrect question:
     - Explain the correct answer
     - Show why the wrong answer is incorrect
     - Reference relevant course material
   - Optional: Re-search Qdrant for supplementary explanations
   - Suggest: "Review section 3.2 in lecture slides"

5. **Overall Feedback**
   - Score summary: "3/5 correct (60%)"
   - Strengths: "You understand [concept A] well"
   - Growth areas: "Focus on [concept B] next"
   - Next steps: "Try the advanced quiz" or "Review materials and retry"

6. **Learning Loop**
   - Store: Quiz performance in student profile
   - Recommend: Related topics for further study
   - Option: "Generate another quiz on this topic?" or "Move to [next topic]?"

#### Quiz Prompt Template (pt-PT)

System:
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

---

## Integration Points

### Moodle Plugin Architecture

**Plugin:** `local_gamibot_manager`

#### Event Observers

// File: local/gamibot_manager/classes/observers.php

class event_observers {
    public static function file_uploaded(\core\event\content_uploaded $event) {
        $data = $event->get_data();
        $context = context::instance_by_id($data['contextid']);
        $course_id = $context->get_course_context()->instanceid;
        
        $webhook_payload = [
            'course_id' => $course_id,
            'module_id' => $data['objectid'],
            'filename' => $data['other']['filename'],
            'file_url' => $this->get_file_download_url($data),
            'mimetype' => $data['other']['mimetype'],
            'timestamp' => time()
        ];
        
        // Dispatch to LangFlow ingestion endpoint
        $this->dispatch_webhook('ingestion', $webhook_payload);
    }
}

#### Chat Integration Points

- **Moodle Chat Module:** Custom JavaScript binding to capture student messages
- **LLM Agent Endpoint:** RESTful API accepting chat payload `{course_id, user_id, message}`
- **Response Callback:** Server-to-client WebSocket or polling for agent responses

### Moodle Database Schema Extensions

-- Store quiz metadata and student performance
CREATE TABLE IF NOT EXISTS {local_gamibot_quizzes} (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    quiz_id VARCHAR(36) NOT NULL UNIQUE,
    topic VARCHAR(255),
    num_questions INT,
    score FLOAT,
    created_at TIMESTAMP,
    answered_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES {course}(id),
    FOREIGN KEY (student_id) REFERENCES {user}(id)
);

-- Store chat history for continuity
CREATE TABLE IF NOT EXISTS {local_gamibot_chat} (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(36),
    message_type ENUM('student_query', 'agent_response', 'system_notification'),
    content LONGTEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES {course}(id),
    FOREIGN KEY (user_id) REFERENCES {user}(id)
);

-- Track material ingestion
CREATE TABLE IF NOT EXISTS {local_gamibot_ingestion_log} (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    file_url VARCHAR(500),
    filename VARCHAR(255),
    file_type VARCHAR(10),
    status ENUM('success', 'failed', 'pending'),
    chunks_created INT,
    error_message TEXT,
    created_at TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES {course}(id)
);

### LangFlow Workflow Exports

Each workflow (Ingestion, Summarization, Doubt Clarification, Quiz Generation) is defined as a **LangFlow JSON configuration** that includes:

- Node definitions (Moodle API, Qdrant search, LLM calls)
- Edge connections (control flow, data pipelines)
- Tool bindings (API keys, model selection)
- Error handling and retries

#### Example: Summarization Workflow Node Structure

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

---

## Security and Privacy

### Data Protection

#### Encryption

- **In Transit:** TLS 1.3 for all API calls (Moodle → LangFlow, LangFlow → Qdrant, Qdrant → Client)
- **At Rest:** AES-256 encryption for Qdrant payloads (if sensitive data detected)
- **API Keys:** Stored in environment variables, never in code or logs

#### Access Control

- **Course Isolation:** All Qdrant queries include `course_id` filter; students cannot access other courses' materials
- **Authentication:** Moodle session tokens validated for every API request
- **Role-based:** Instructors can manage ingestion; students can only query own courses

#### Data Retention

| Data Type | Retention | Purging |
|-----------|-----------|---------|
| Course materials (vectors) | Duration of course + 1 year | Manual by instructor |
| Chat history | 6 months | Automatic deletion |
| Quiz performance | 1 academic year | Automatic deletion |
| Ingestion logs | 3 months | Automatic deletion |
| User embeddings | 6 months | Automatic deletion after course end |

### Privacy Considerations

1. **Transparency:** Students informed that AI summarizes their course materials
2. **Opt-out:** Checkbox to exclude student data from LLM training (if using OpenAI API)
3. **No third-party sharing:** Materials not shared with external AI platforms without explicit consent
4. **GDPR compliance:** Export or delete student data on request (within 30 days)

### Model Safety

- **Content filtering:** No generation of harmful, discriminatory, or academic dishonesty content
- **Prompt injection defense:** Validate student input; escape special tokens
- **Hallucination mitigation:** LLM output strictly constrained to retrieved materials (RAG principle)
- **Monitoring:** Log all LLM interactions for audit trail

---

## Deployment Architecture

### Production Environment

┌──────────────────────────────────────────────────────────────┐
│                      Internet / VPN                           │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐          ┌────▼────┐          ┌────▼────┐
   │  Moodle  │          │ LangFlow │          │ Qdrant  │
   │  Server  │◄────────►│  Engine  │◄────────►│   DB    │
   │(PHP/Node)│          │(Node/Py) │          │(Rust)   │
   └──────────┘          └──────────┘          └─────────┘
        │                     │
        └──────────┬──────────┘
                   │
            ┌──────▼──────┐
            │  PostgreSQL │
            │  (Moodle DB)│
            └─────────────┘

### Infrastructure Requirements

#### Moodle Server
- **OS:** Ubuntu 22.04 LTS
- **RAM:** 8 GB minimum
- **Storage:** 100 GB (scalable by course load)
- **PHP:** 8.0+
- **Database:** PostgreSQL 12+

#### LangFlow Engine
- **OS:** Ubuntu 22.04 LTS or Docker container
- **RAM:** 16 GB minimum
- **CPU:** 4 cores (8 recommended)
- **Node.js/Python:** 18+ / 3.10+
- **Storage:** 50 GB (for model caching)

#### Qdrant Vector DB
- **OS:** Ubuntu 22.04 LTS or Docker
- **RAM:** 32 GB minimum (depends on vector collection size)
- **CPU:** 8 cores (16 recommended)
- **Storage:** 500 GB initial (SSD recommended)
- **Replication:** 3+ nodes for HA (production)

### Docker Deployment Example

# docker-compose.yml
version: '3.8'

services:
  moodle:
    image: moodle:4.2
    environment:
      DB_HOST: postgres
      DB_USER: moodle
      DB_PASSWORD: ${MOODLE_DB_PASSWORD}
    ports:
      - "8080:80"
    volumes:
      - ./plugins/local_gamibot_manager:/var/www/html/local/gamibot_manager
    depends_on:
      - postgres

  langflow:
    image: langflowai/langflow:latest
    environment:
      PYTHONUNBUFFERED: 1
      QDRANT_HOST: qdrant
      QDRANT_PORT: 6333
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "7860:7860"
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    environment:
      QDRANT_API_KEY: ${QDRANT_API_KEY}
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: moodle
      POSTGRES_USER: moodle
      POSTGRES_PASSWORD: ${MOODLE_DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  qdrant_storage:
  postgres_data:

### Scaling Considerations

1. **Horizontal scaling (Moodle):** Multiple Moodle instances behind load balancer (nginx)
2. **LangFlow scaling:** Run multiple worker instances; queue jobs with Redis
3. **Qdrant scaling:** Sharded collections by course or time period; replicated across nodes
4. **Caching:** Redis for chat history and frequently accessed summaries

---

## Monitoring and Quality Assurance

### Key Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Query latency (Doubt Clarification) | < 5 sec | Application Insights |
| Quiz generation time | < 15 sec | LangFlow metrics |
| Qdrant search accuracy (NDCG@5) | > 0.8 | Evaluation dataset |
| Student satisfaction (NPS) | > 7/10 | Post-interaction survey |
| System uptime | > 99.5% | Prometheus + Alerting |
| Embedding quality (cosine similarity) | > 0.75 for relevant chunks | Manual audit |

### Testing Strategy

#### Unit Tests
- Moodle plugin webhook parsing
- LangFlow workflow node execution
- Qdrant filter and search logic
- Text extraction (PDF, PPTX, etc.)

#### Integration Tests
- End-to-end ingestion pipeline (file upload → Qdrant)
- Summarization workflow (query → LLM → response)
- Quiz generation and feedback cycle

#### User Acceptance Testing (UAT)
- Pilot with 2–3 courses (50+ students)
- Collect feedback: usability, content accuracy, response quality
- Iterate on prompts and configurations

#### Performance Testing
- Load test: 100 concurrent students querying simultaneously
- Stress test: 1 GB files ingestion
- Soak test: 8-hour continuous operation

---

## Conclusion

This comprehensive platform demonstrates the potential of integrating generative AI into Moodle to enhance personalized learning at scale. The four core workflows—**Data Ingestion**, **Content Summarization**, **Doubt Clarification**, and **Agentic Quiz Generation**—provide students with intelligent, context-aware learning support while maintaining course integrity and data privacy.

### Next Steps

1. **Pilot Deployment:** Launch with 2–3 courses in Spring 2026
2. **Instructor Onboarding:** Training workshops for course integration
3. **Student Feedback Loop:** Continuous iteration based on usage data
4. **Curriculum Alignment:** Ensure workflows support course learning objectives
5. **Expansion:** Add features like adaptive learning paths, peer-to-peer quizzes, and predictive interventions

### References

[1] LangFlow Documentation. (2025). Workflow Orchestration. https://docs.langflow.org/

[2] Qdrant Vector Database. (2025). Similarity Search. https://qdrant.tech/documentation/

[3] Moodle Development. (2025). Plugin Architecture. https://docs.moodle.org/dev/

[4] OpenAI. (2025). Embeddings API. https://platform.openai.com/docs/api-reference/embeddings

[5] Brown, A., et al. (2022). Language Models as Tutors. *AI in Education*, 18(2), 145–167. https://doi.org/10.xxxx/aied.2022
