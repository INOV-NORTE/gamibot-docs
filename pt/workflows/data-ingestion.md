---
title: Pipeline de Ingestão de Dados
description: Como o Gamibot ingere e processa automaticamente materiais de curso do Moodle.
---

# Pipeline de Ingestão de Dados

**Gatilho:** Ficheiro carregado para recurso/atividade de curso Moodle  
**Duração:** 5–30 segundos (depende do tamanho do ficheiro)  
**Âmbito:** Suporta PDF, Word (.docx), PPT (.pptx), ePub, texto simples

---

## Visão Geral do Processo

O pipeline de ingestão de dados processa automaticamente ficheiros carregados para cursos Moodle, convertendo-os em embeddings vetoriais pesquisáveis armazenados no Qdrant.

```
Upload Moodle → Webhook → Extração de Texto → Segmentação → Embedding → Armazenamento Qdrant
```

---

## Passos Detalhados

### 1. Gatilho de Webhook

Quando um ficheiro é carregado para o Moodle, um observador de eventos dispara:

- **Evento:** `\core\event\content_uploaded`
- **Payload inclui:**
  - `course_id` - O identificador do curso
  - `module_id` - O ID do módulo/atividade
  - `section_id` - A secção do curso
  - `file_url` - URL de download do ficheiro
  - `filename` - Nome original do ficheiro
  - `mimetype` - Tipo de ficheiro
- **Segurança:** Validação de segredo HMAC

### 2. Validação

Antes de processar, o sistema valida:

- ✅ Assinatura do webhook é válida
- ✅ Tipo de ficheiro é suportado (lista branca: PDF, DOCX, PPTX, EPUB, TXT)
- ✅ Curso existe no sistema

### 3. Recuperação de Ficheiro

- Download do ficheiro do armazenamento de ficheiros Moodle (pedido autenticado)
- Gestão de timeouts (ficheiros >100MB registados como aviso)
- Armazenamento temporário para processamento

### 4. Extração de Conteúdo

Diferentes extratores para cada tipo de ficheiro:

| Formato | Biblioteca | Funcionalidades |
|---------|------------|-----------------|
| **PDF** | PyPDF2, pdfplumber | Texto + fallback OCR |
| **DOCX** | python-docx | Suporte completo a documentos |
| **PPTX** | python-pptx | Slides + notas do orador |
| **EPUB** | ebooklib | Parsing de capítulos |
| **TXT** | Nativo | Leitura direta UTF-8 |

### 5. Segmentação de Conteúdo

O texto é dividido em chunks para recuperação ótima:

- **Splitter:** Divisor recursivo de caracteres
- **Tamanho do chunk:** 1024 tokens
- **Sobreposição:** 200 tokens
- **Objetivo:** Preservar coerência semântica dentro dos chunks

### 6. Geração de Embedding

Cada chunk é convertido num vetor:

```json
{
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "batch_size": 25
}
```

### 7. Upsert no Qdrant

Vetores são armazenados com metadados ricos:

```json
{
  "collection": "course_materials",
  "vector_id": "SHA256(course_id + module_id + chunk_index)",
  "payload": {
    "course_id": 123,
    "module_id": 456,
    "section_id": 789,
    "filename": "aula_01.pdf",
    "file_type": "pdf",
    "chunk_index": 2,
    "source": "moodle",
    "uploaded_date": "2025-12-16T20:00:00Z",
    "chunk_text": "..."
  }
}
```

---

## Gestão de Erros

| Erro | Estratégia de Recuperação |
|------|---------------------------|
| Ficheiro não encontrado | Registar e notificar admin; saltar ingestão |
| Tipo não suportado | Registar aviso; saltar ficheiro |
| Extração falha | Fallback para indexação por nome de ficheiro; alertar instrutor |
| API de embedding indisponível | Colocar em fila para retry (backoff exponencial) |
| Qdrant indisponível | Armazenar em BD de staging; sincronizar na recuperação |

---

## Próximos Passos

- [Sumarização de Conteúdo](/pt/workflows/summarization) - Como os alunos obtêm resumos
- [Plugin Moodle](/pt/integration/moodle-plugin) - Detalhes da arquitetura do plugin
