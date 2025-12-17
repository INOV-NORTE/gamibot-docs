---
title: Tecnologias
description: Tecnologias base e dependências chave usadas na plataforma GamiBot.
---

# Tecnologias Base

Esta página descreve a stack tecnológica e as dependências chave que alimentam a plataforma GamiBot.

---

## Stack Tecnológica

| Componente | Tecnologia | Propósito |
|------------|------------|-----------|
| **LMS** | Moodle (plugins PHP personalizados) | Gestão de cursos e recursos |
| **Orquestração** | LangFlow | Design de fluxos de trabalho e orquestração de agentes |
| **Base de Dados Vetorial** | Qdrant | Pesquisa semântica e armazenamento vetorial |
| **Embeddings** | Configurável (OpenAI, local, etc.) | Converter texto em vetores densos |
| **LLM** | GPT-4, Claude 3, ou alternativas locais | Raciocínio e geração de agentes |
| **ORM** | Prisma | Abstração de base de dados |
| **Backend** | Node.js + Express ou Python | Camada API e handlers de webhooks |
| **Processamento de Ficheiros** | Unstructured, PyPDF2, python-pptx | Extrair texto de diversos formatos |

---

## Dependências Principais

### Plugins Moodle

- **`local_gamibot_manager`** - Dispatcher de webhooks para eventos de upload de ficheiros

### Integração LangFlow

- Integração Qdrant incluída para operações vetoriais
- Conectores LLM para múltiplos fornecedores (OpenAI, Anthropic, modelos locais)

### Operações Vetoriais

- **Biblioteca cliente Qdrant** - SDK Python ou Node.js para operações vetoriais
- Coleções suportam sharding e replicação para escalabilidade

### Bibliotecas de Extração de Texto

| Formato | Biblioteca | Notas |
|---------|------------|-------|
| **PDF** | PyPDF2, pdfplumber | Fallback OCR disponível |
| **PowerPoint** | python-pptx | Extrai slides + notas do orador |
| **ePub** | ebooklib | Suporte a parsing de capítulos |
| **Word** | python-docx | Suporte completo a documentos |
| **Texto Simples** | Nativo | Codificação UTF-8 |

---

## Modelos de Embedding

A plataforma suporta modelos de embedding configuráveis:

### OpenAI Embeddings

```json
{
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "max_tokens": 8191
}
```

### Alternativas Locais

- **Sentence Transformers** - Opção auto-hospedada para privacidade
- **all-MiniLM-L6-v2** - Embeddings leves e eficientes
- **BGE** - Suporte multilingue

---

## Opções de Fornecedor LLM

### Fornecedores Cloud

| Fornecedor | Modelo | Melhor Para |
|------------|--------|-------------|
| OpenAI | GPT-4, GPT-4o | Propósito geral, alta qualidade |
| Anthropic | Claude 3 Opus/Sonnet | Contexto longo, segurança |
| Google | Gemini | Multimodal, custo-benefício |

### Local/Auto-Hospedado

| Modelo | Framework | Notas |
|--------|-----------|-------|
| Llama 3 | Ollama, vLLM | Open source, privacidade |
| Mistral | Ollama, vLLM | Eficiente, multilingue |
| Phi-3 | Ollama | Pequeno, rápido |

---

## Requisitos de Infraestrutura

Consulte a página [Arquitetura de Implantação](/pt/deployment/architecture) para especificações detalhadas de infraestrutura.
