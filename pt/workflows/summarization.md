---
title: Sumarização de Conteúdo
description: Como o GamiBot gera resumos personalizados de materiais de curso usando RAG.
---

# Fluxo de Sumarização de Conteúdo

**Gatilho:** Aluno solicita resumo via interface de chat  
**Duração:** 3–8 segundos  
**Exemplo:** "Resumir tópico: Redes Neurais Recorrentes"

---

## Visão Geral do Processo

O fluxo de sumarização usa geração aumentada por recuperação (RAG) para criar resumos personalizados baseados nos materiais do curso do aluno.

```
Consulta do Aluno → Pesquisa Qdrant → Construção de Contexto → Síntese LLM → Resposta
```

---

## Passos Detalhados

### 1. Entrada da Consulta

O aluno submete um pedido em linguagem natural através da interface de chat:

- **Contexto fornecido:**
  - `course_id` - Curso inscrito do aluno
  - `student_id` - Para personalização
  - `language` - Idioma da resposta (ex.: pt-PT)

### 2. Construção de Contexto

O sistema prepara a pesquisa:

- Construir filtro Qdrant: `course_id == curso do aluno`
- Opcional: Restringir por `section_id` ou `module_id` se especificado
- Extrair palavras-chave do tópico da consulta do aluno

### 3. Pesquisa Semântica

Encontrar materiais de curso relevantes:

```json
{
  "collection": "course_materials",
  "query_vector": "<consulta do aluno em embedding>",
  "filter": { "course_id": 123 },
  "top_k": 5,
  "threshold": 0.7
}
```

### 4. Avaliação de Resultados

| Cenário | Ação |
|---------|------|
| `k < 3` resultados | Retornar: "Materiais insuficientes; por favor consulte o instrutor" |
| `k >= 3` resultados | Prosseguir para sumarização |

### 5. Construção do Prompt

O LLM recebe um prompt estruturado:

**Prompt de Sistema:**
```
Você é um assistente educacional para estudantes universitários de língua portuguesa. 
Resuma os seguintes materiais de curso de forma clara e concisa.

Estruture a sua resposta assim:
1. **Definição** – O que é este conceito?
2. **Conceitos principais** – Pontos chave a entender
3. **Exemplos práticos** – Exemplos do mundo real ou do curso
4. **Aplicações** – Como é usado?

Linguagem: Português (Portugal)
Tom: Educacional, acessível
Comprimento: 200–400 palavras
```

### 6. Sumarização LLM

Parâmetros de geração:

| Parâmetro | Valor | Justificação |
|-----------|-------|--------------|
| **Modelo** | GPT-4 ou Claude 3 | Output de alta qualidade |
| **Temperature** | 0.5 | Equilibrar consistência e criatividade |
| **Max tokens** | 600 | Suficiente para resposta estruturada |

### 7. Entrega da Resposta

A resposta é formatada para legibilidade:

- **Formato:** Markdown com títulos e pontos
- **Citação:** "Baseado em materiais de: [nome do ficheiro, secção]"
- **Registo de qualidade:** Scores de similaridade registados para QA

---

## Exemplo de Resposta

::: info Consulta do Aluno
"Resumir tópico: Redes Neurais Recorrentes"
:::

**Resposta de Exemplo:**

> ## Definição
> 
> Redes Neurais Recorrentes (RNNs) são um tipo de rede neural artificial projetada para processar sequências de dados, mantendo uma "memória" interna de informações anteriores.
> 
> ## Conceitos Principais
> 
> - **Estados ocultos:** Armazenam informação das entradas anteriores
> - **Backpropagation Through Time (BPTT):** Algoritmo de treino específico
> - **Vanishing gradient:** Problema comum em sequências longas
> 
> ## Exemplos Práticos
> 
> - Previsão de texto (autocompletar)
> - Tradução automática
> - Análise de sentimento
> 
> ## Aplicações
> 
> RNNs são utilizadas em processamento de linguagem natural, reconhecimento de voz, e análise de séries temporais.
> 
> *Baseado em materiais de: lecture_05_rnn.pdf, Secção 3*

---

## Próximos Passos

- [Esclarecimento de Dúvidas](/pt/workflows/doubt-clarification) - Fluxo de resposta a perguntas
- [Geração de Quizzes](/pt/workflows/quiz-generation) - Avaliações adaptativas
