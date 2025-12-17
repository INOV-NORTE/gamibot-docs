---
title: Visão Geral
description: Resumo executivo e arquitetura do sistema da plataforma de aprendizagem Moodle melhorada com IA Gamibot.
---

# Visão Geral do Sistema

**Organização:** Centro de Inovação Pedagógica (CIP), Politécnico do Porto (IPP)  
**Estado:** Em Desenvolvimento Ativo

---

## Resumo Executivo

Esta documentação cobre uma plataforma de aprendizagem Moodle melhorada com IA que integra agentes de Modelos de Linguagem de Grande Escala (LLM) com tecnologia de base de dados vetorial para proporcionar experiências de aprendizagem personalizadas. O sistema consiste em quatro fluxos de trabalho principais:

1. **Ingestão de Dados** - Processamento automático de materiais de curso
2. **Sumarização de Conteúdo** - Resumos alimentados por RAG para estudantes
3. **Esclarecimento de Dúvidas** - Resposta a perguntas assistida por IA
4. **Geração Agêntica de Quizzes** - Avaliações adaptativas com feedback

### Capacidades da Plataforma

A plataforma permite:

- ✅ Ingestão automática de diversos materiais de curso (PDFs, PPTs, ePub, documentos de texto)
- ✅ Geração aumentada por recuperação (RAG) em tempo real para resumos personalizados
- ✅ Esclarecimento inteligente de dúvidas baseado no contexto do curso
- ✅ Geração de quizzes adaptativos com feedback formativo

---

## Arquitetura do Sistema

A plataforma opera como um sistema distribuído com três componentes principais:

| Componente | Descrição |
|------------|-----------|
| **Moodle LMS** | Sistema de Gestão de Aprendizagem que aloja conteúdo de curso e dados de estudantes |
| **Camada de Orquestração LangFlow** | Automação de fluxos de trabalho e orquestração de agentes LLM |
| **Base de Dados Vetorial (Qdrant)** | Pesquisa semântica e recuperação de materiais ingeridos |

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      Moodle LMS                              │
│                  (Gestão de Cursos)                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Cursos │ Recursos │ Atividades │ Progresso do Aluno    │  │
│  │ Ficheiros │ Metadados │ Avaliação │ Interações        │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                     │
              │ Webhooks            │ Consultas API
              ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Fluxos LangFlow                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ • Pipeline de Ingestão de Dados                        │  │
│  │ • Agente de Sumarização de Conteúdo                    │  │
│  │ • Agente de Esclarecimento de Dúvidas                  │  │
│  │ • Agente de Geração de Quizzes (com ciclo de feedback) │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                     │
              │ Embeddings          │ Consultas Vetoriais
              ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Qdrant Vector DB                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Coleções:                                               │  │
│  │ • course_materials (vetores + metadados)               │  │
│  │ • course_metadata (course_id, section_id, file_type)   │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Princípios de Fluxo de Dados

- **Filtragem por curso:** Todas as consultas Qdrant são filtradas por `course_id` para garantir que os alunos acedam apenas aos materiais do seu próprio curso
- **Preservação de metadados:** Origem do ficheiro, secção, módulo e mimetype são retidos para contexto
- **Orquestração agêntica:** Agentes LLM controlam a lógica do fluxo de trabalho, invocação de ferramentas e tomada de decisões
- **Estratégias de fallback:** Quando materiais insuficientes existem, os agentes fornecem orientação educacional

---

## Próximos Passos

Pronto para explorar a plataforma? Comece com:

- [Tecnologias Base](/pt/introduction/technologies) - Conheça a stack tecnológica
- [Ingestão de Dados](/pt/workflows/data-ingestion) - Entenda como o conteúdo é processado
- [Integração Moodle](/pt/integration/moodle-plugin) - Veja como se conecta ao Moodle
