---
title: Esquema de Base de Dados
description: Extensões do esquema de base de dados para o plugin Moodle GamiBot.
---

# Extensões do Esquema de Base de Dados

O plugin GamiBot estende a base de dados Moodle com tabelas personalizadas para rastrear quizzes, histórico de chat e logs de ingestão.

---

## Visão Geral

| Tabela | Propósito |
|--------|-----------|
| `local_gamibot_quizzes` | Armazenar metadados de quiz e desempenho do aluno |
| `local_gamibot_chat` | Armazenar histórico de chat para continuidade |
| `local_gamibot_ingestion_log` | Rastrear estado de ingestão de materiais |

---

## Tabela de Metadados de Quiz

Armazena quizzes gerados e desempenho dos alunos:

```sql
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
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGINT | Chave primária |
| `course_id` | BIGINT | Referência ao curso Moodle |
| `student_id` | BIGINT | Referência ao utilizador Moodle |
| `quiz_id` | VARCHAR(36) | Identificador único do quiz (UUID) |
| `topic` | VARCHAR(255) | Tópico do quiz |
| `num_questions` | INT | Número de perguntas |
| `score` | FLOAT | Pontuação final (0.0 - 1.0) |
| `created_at` | TIMESTAMP | Hora de criação do quiz |
| `answered_at` | TIMESTAMP | Hora de conclusão do quiz |

---

## Tabela de Histórico de Chat

Armazena histórico de conversação para continuidade de contexto:

```sql
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
```

### Tipos de Mensagem

| Tipo | Descrição |
|------|-----------|
| `student_query` | Pergunta do aluno |
| `agent_response` | Resposta do agente IA |
| `system_notification` | Mensagens do sistema (erros, confirmações) |

---

## Tabela de Log de Ingestão

Rastreia o estado da ingestão de materiais:

```sql
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
```

### Valores de Estado

| Estado | Descrição |
|--------|-----------|
| `pending` | Em fila para processamento |
| `success` | Ingerido com sucesso |
| `failed` | Ingestão falhou |

---

## Índices

Para desempenho ótimo de consultas:

```sql
-- Consultas de quiz por aluno
CREATE INDEX idx_quizzes_student ON {local_gamibot_quizzes} (student_id, course_id);

-- Consultas de chat por sessão
CREATE INDEX idx_chat_session ON {local_gamibot_chat} (session_id, created_at);

-- Consultas de estado de ingestão
CREATE INDEX idx_ingestion_status ON {local_gamibot_ingestion_log} (course_id, status);
```

---

## Próximos Passos

- [Fluxos LangFlow](/pt/integration/langflow) - Exportações de fluxos de trabalho
- [Segurança e Privacidade](/pt/deployment/security) - Proteção de dados
