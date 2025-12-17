---
title: Esclarecimento de Dúvidas
description: Como o Gamibot responde a perguntas dos alunos usando contexto específico do curso.
---

# Fluxo de Esclarecimento de Dúvidas

**Gatilho:** Aluno publica uma pergunta específica sobre conteúdo do curso  
**Duração:** 2–5 segundos  
**Exemplo:** "Qual é a diferença entre supervised e unsupervised learning?"

---

## Visão Geral do Processo

O fluxo de esclarecimento de dúvidas fornece respostas contextuais às perguntas dos alunos, extraindo exclusivamente dos materiais do seu curso.

```
Pergunta do Aluno → Deteção de Intenção → Pesquisa Qdrant → Explicação LLM → Resposta
```

---

## Passos Detalhados

### 1. Receção da Pergunta

O aluno faz uma pergunta específica no chat:

- **Contexto fornecido:**
  - `course_id` - Curso inscrito do aluno
  - `student_id` - Para rastreio de personalização
  - `student_level` (opcional) - "beginner", "intermediate", "advanced"

### 2. Deteção de Intenção

O sistema analisa a pergunta:

- Analisar para tópico, conceito e indicadores de dificuldade
- Sinalizar se a pergunta está fora do âmbito (administrativa, não académica)
- Identificar conceitos chave para pesquisa direcionada

### 3. Pesquisa Qdrant

Recuperar materiais de curso relevantes:

```json
{
  "filter": { "course_id": "<curso do aluno>" },
  "query": "<pergunta original + expansão semântica>",
  "top_k": 5,
  "include": ["chunk_text", "filename", "section_id"]
}
```

### 4. Gestão de Resultados

| Cenário | Resposta |
|---------|----------|
| **Sem resultados (k=0)** | "Não encontrei materiais específicos sobre isto no seu curso. Por favor consulte o seu docente ou a secção [X] do manual." |
| **Resultados fracos (k<3, similaridade<0.6)** | Resposta parcial + aviso sobre materiais limitados |
| **Resultados fortes (k≥3, similaridade≥0.7)** | Explicação completa dos materiais do curso |

### 5. Prompt de Esclarecimento

**Prompt de Sistema (pt-PT):**

```
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
```

### 6. Explicação LLM

Parâmetros de geração priorizam precisão:

| Parâmetro | Valor | Justificação |
|-----------|-------|--------------|
| **Modelo** | GPT-4 ou Claude 3 | Alta precisão |
| **Temperature** | 0.3 | Priorizar precisão sobre criatividade |
| **Formato** | Passo-a-passo | Estrutura de explicação clara |

### 7. Melhoria Metacognitiva

Cada resposta termina com:

- "Esta resposta esclareceu a sua dúvida? Perguntas de seguimento são bem-vindas."
- Pergunta + resposta registadas para melhoria curricular

---

## Exemplo de Interação

::: info Pergunta do Aluno
"Qual é a diferença entre supervised e unsupervised learning?"
:::

**Resposta de Exemplo:**

> ## Resposta Direta
> 
> A principal diferença está na presença de rótulos: no supervised learning, os dados de treino têm rótulos conhecidos; no unsupervised learning, não existem rótulos.
> 
> ## Explicação Passo-a-Passo
> 
> 1. **Supervised Learning:** O modelo aprende a partir de exemplos rotulados (input → output conhecido)
> 2. **Unsupervised Learning:** O modelo identifica padrões sem orientação prévia
> 3. **Objetivo:** Supervisado prevê; não-supervisado agrupa ou reduz dimensões
> 4. **Exemplos:** Classificação de spam (supervisado) vs. segmentação de clientes (não-supervisado)
> 
> ## Exemplo do Curso
> 
> Na aula 3, vimos o algoritmo k-means (não-supervisado) para agrupar dados de estudantes por comportamento.
> 
> ## Dica de Estudo
> 
> Reveja a secção 2.3 do material "ML_Fundamentals.pdf" para mais exemplos práticos.
> 
> ---
> *Esta resposta esclareceu a sua dúvida? Perguntas de seguimento são bem-vindas!*

---

## Respostas Adaptativas

O sistema ajusta explicações com base no nível do aluno:

| Nível | Adaptação |
|-------|-----------|
| **Iniciante** | Vocabulário mais simples, mais analogias, explicações mais longas |
| **Intermédio** | Linguagem académica padrão, detalhe equilibrado |
| **Avançado** | Terminologia técnica, explicações concisas, referências a literatura |

---

## Próximos Passos

- [Geração de Quizzes](/pt/workflows/quiz-generation) - Avaliações adaptativas
- [Integração LangFlow](/pt/integration/langflow) - Configuração de fluxos de trabalho
