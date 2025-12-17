---
title: Data Ingestion Pipeline
description: How Gamibot automatically ingests and processes course materials from Moodle.
---

# Data Ingestion Pipeline

**Trigger:** File uploaded to Moodle course resource/activity  
**Duration:** 5–30 seconds (depends on file size)  
**Scope:** Supports PDF, Word (.docx), PPT (.pptx), ePub, plain text

---

## Process Overview

The data ingestion pipeline automatically processes files uploaded to Moodle courses, converting them into searchable vector embeddings stored in Qdrant.

```
Moodle Upload → Webhook → Text Extraction → Chunking → Embedding → Qdrant Storage
```

---

## Detailed Steps

### 1. Webhook Trigger

When a file is uploaded to Moodle, an event observer fires:

- **Event:** `\core\event\content_uploaded`
- **Payload includes:**
  - `course_id` - The course identifier
  - `module_id` - The module/activity ID
  - `section_id` - The course section
  - `file_url` - Download URL for the file
  - `filename` - Original filename
  - `mimetype` - File type
- **Security:** HMAC secret validation

### 2. Validation

Before processing, the system validates:

- ✅ Webhook signature is valid
- ✅ File type is supported (whitelist: PDF, DOCX, PPTX, EPUB, TXT)
- ✅ Course exists in the system

### 3. File Retrieval

- Download file from Moodle file storage (authenticated request)
- Handle timeouts (files >100MB logged as warning)
- Temporary storage for processing

### 4. Content Extraction

Different extractors for each file type:

| Format | Library | Features |
|--------|---------|----------|
| **PDF** | PyPDF2, pdfplumber | Text + OCR fallback |
| **DOCX** | python-docx | Full document support |
| **PPTX** | python-pptx | Slides + speaker notes |
| **EPUB** | ebooklib | Chapter parsing |
| **TXT** | Native | UTF-8 direct read |

### 5. Content Segmentation

Text is split into chunks for optimal retrieval:

- **Splitter:** Recursive character splitter
- **Chunk size:** 1024 tokens
- **Overlap:** 200 tokens
- **Goal:** Preserve semantic coherence within chunks

### 6. Embedding Generation

Each chunk is converted to a vector:

```json
{
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "batch_size": 25
}
```

### 7. Qdrant Upsert

Vectors are stored with rich metadata:

```json
{
  "collection": "course_materials",
  "vector_id": "SHA256(course_id + module_id + chunk_index)",
  "payload": {
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
}
```

---

## Error Handling

| Error | Recovery Strategy |
|-------|-------------------|
| File not found | Log and notify admin; skip ingestion |
| Unsupported type | Log warning; skip file |
| Extraction fails | Fallback to filename indexing; alert instructor |
| Embedding API down | Queue for retry (exponential backoff) |
| Qdrant unavailable | Store in staging DB; sync on recovery |

---

## Metadata Schema

```json
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
```

---

## Next Steps

- [Content Summarization](/en/workflows/summarization) - How students get summaries
- [Moodle Plugin](/en/integration/moodle-plugin) - Plugin architecture details
