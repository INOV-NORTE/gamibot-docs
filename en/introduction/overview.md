---
title: Overview
description: Executive summary and system architecture of the Gamibot AI-enhanced Moodle learning platform.
---

# System Overview

**Organization:** Pedagogical Innovation Center (CIP), Polytechnic of Porto (IPP)  
**Status:** Active Development

---

## Executive Summary

This documentation covers an AI-enhanced Moodle learning platform that integrates Large Language Model (LLM) agents with vector database technology to deliver personalized learning experiences. The system consists of four primary workflows:

1. **Data Ingestion** - Automatic processing of course materials
2. **Content Summarization** - RAG-powered summaries for students
3. **Doubt Clarification** - AI-assisted question answering
4. **Agentic Quiz Generation** - Adaptive assessments with feedback

### Platform Capabilities

The platform enables:

- ✅ Automatic ingestion of diverse course materials (PDFs, PPTs, ePub, text documents)
- ✅ Real-time retrieval-augmented generation (RAG) for personalized summaries
- ✅ Intelligent doubt clarification based on course context
- ✅ Adaptive quiz generation with formative feedback

---

## System Architecture

The platform operates as a distributed system with three main components:

| Component | Description |
|-----------|-------------|
| **Moodle LMS** | Learning Management System hosting course content and student data |
| **LangFlow Orchestration Layer** | Workflow automation and LLM agent orchestration |
| **Vector Database (Qdrant)** | Semantic search and retrieval of ingested materials |

### Architectural Diagram

```
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
```

### Data Flow Principles

- **Course-scoped filtering:** All Qdrant queries are filtered by `course_id` to ensure student access only to their own course materials
- **Metadata preservation:** File origin, section, module, and mimetype are retained for context
- **Agentic orchestration:** LLM agents control workflow logic, tool invocation, and decision-making
- **Fallback strategies:** When insufficient materials exist, agents provide educational guidance

---

## Next Steps

Ready to explore the platform? Start with:

- [Core Technologies](/en/introduction/technologies) - Learn about the technology stack
- [Data Ingestion](/en/workflows/data-ingestion) - Understand how content is processed
- [Moodle Integration](/en/integration/moodle-plugin) - See how it connects to Moodle
