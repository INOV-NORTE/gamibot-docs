---
title: Database Schema
description: Database schema extensions for the Gamibot Moodle plugin.
---

# Database Schema Extensions

The Gamibot plugin extends the Moodle database with custom tables to track quizzes, chat history, and ingestion logs.

---

## Overview

| Table | Purpose |
|-------|---------|
| `local_gamibot_quizzes` | Store quiz metadata and student performance |
| `local_gamibot_chat` | Store chat history for continuity |
| `local_gamibot_ingestion_log` | Track material ingestion status |

---

## Quiz Metadata Table

Stores generated quizzes and student performance:

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

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGINT | Primary key |
| `course_id` | BIGINT | Reference to Moodle course |
| `student_id` | BIGINT | Reference to Moodle user |
| `quiz_id` | VARCHAR(36) | Unique quiz identifier (UUID) |
| `topic` | VARCHAR(255) | Quiz topic |
| `num_questions` | INT | Number of questions |
| `score` | FLOAT | Final score (0.0 - 1.0) |
| `created_at` | TIMESTAMP | Quiz creation time |
| `answered_at` | TIMESTAMP | Quiz completion time |

---

## Chat History Table

Stores conversation history for context continuity:

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

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGINT | Primary key |
| `course_id` | BIGINT | Reference to Moodle course |
| `user_id` | BIGINT | Reference to Moodle user |
| `session_id` | VARCHAR(36) | Conversation session ID |
| `message_type` | ENUM | Type of message |
| `content` | LONGTEXT | Message content |
| `created_at` | TIMESTAMP | Message timestamp |

### Message Types

| Type | Description |
|------|-------------|
| `student_query` | Question from student |
| `agent_response` | Response from AI agent |
| `system_notification` | System messages (errors, confirmations) |

---

## Ingestion Log Table

Tracks the status of material ingestion:

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

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | BIGINT | Primary key |
| `course_id` | BIGINT | Reference to Moodle course |
| `file_url` | VARCHAR(500) | Original file URL |
| `filename` | VARCHAR(255) | Original filename |
| `file_type` | VARCHAR(10) | File extension |
| `status` | ENUM | Ingestion status |
| `chunks_created` | INT | Number of chunks created |
| `error_message` | TEXT | Error details (if failed) |
| `created_at` | TIMESTAMP | Ingestion timestamp |

### Status Values

| Status | Description |
|--------|-------------|
| `pending` | Queued for processing |
| `success` | Successfully ingested |
| `failed` | Ingestion failed |

---

## Indexes

For optimal query performance:

```sql
-- Quiz queries by student
CREATE INDEX idx_quizzes_student ON {local_gamibot_quizzes} (student_id, course_id);

-- Chat queries by session
CREATE INDEX idx_chat_session ON {local_gamibot_chat} (session_id, created_at);

-- Ingestion status queries
CREATE INDEX idx_ingestion_status ON {local_gamibot_ingestion_log} (course_id, status);
```

---

## Moodle XMLDB

For Moodle compatibility, define tables in `db/install.xml`:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<XMLDB PATH="local/gamibot_manager/db" VERSION="20251216">
  <TABLES>
    <TABLE NAME="local_gamibot_quizzes">
      <FIELDS>
        <FIELD NAME="id" TYPE="int" LENGTH="10" NOTNULL="true" SEQUENCE="true"/>
        <FIELD NAME="course_id" TYPE="int" LENGTH="10" NOTNULL="true"/>
        <FIELD NAME="student_id" TYPE="int" LENGTH="10" NOTNULL="true"/>
        <FIELD NAME="quiz_id" TYPE="char" LENGTH="36" NOTNULL="true"/>
        <FIELD NAME="topic" TYPE="char" LENGTH="255"/>
        <FIELD NAME="num_questions" TYPE="int" LENGTH="5"/>
        <FIELD NAME="score" TYPE="number" LENGTH="5" DECIMALS="2"/>
        <FIELD NAME="created_at" TYPE="int" LENGTH="10"/>
        <FIELD NAME="answered_at" TYPE="int" LENGTH="10"/>
      </FIELDS>
      <KEYS>
        <KEY NAME="primary" TYPE="primary" FIELDS="id"/>
        <KEY NAME="course_fk" TYPE="foreign" FIELDS="course_id" REFTABLE="course" REFFIELDS="id"/>
        <KEY NAME="student_fk" TYPE="foreign" FIELDS="student_id" REFTABLE="user" REFFIELDS="id"/>
      </KEYS>
      <INDEXES>
        <INDEX NAME="quiz_id_unique" UNIQUE="true" FIELDS="quiz_id"/>
      </INDEXES>
    </TABLE>
  </TABLES>
</XMLDB>
```

---

## Next Steps

- [LangFlow Workflows](/en/integration/langflow) - Workflow exports
- [Security & Privacy](/en/deployment/security) - Data protection
