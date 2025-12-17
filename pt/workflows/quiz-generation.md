---
title: Geração de Quizzes
description: Como o Gamibot cria quizzes personalizados com feedback formativo usando uma abordagem agêntica.
---

# Fluxo de Geração Agêntica de Quizzes

**Gatilho:** Aluno solicita um quiz de prática via interação com agente  
**Duração:** Fase A (geração): 5–15 segundos | Fase B (feedback): 2–10 segundos  
**Exemplo:** "Criar um quiz de 5 perguntas sobre Redes Neurais, escolha múltipla"

---

## Visão Geral

A geração de quizzes usa uma **abordagem agêntica** onde um "Agente Quiz Master" de IA orquestra todo o processo, desde a seleção do tópico até à entrega do feedback.

```
Fase A: Intenção do Aluno → Seleção de Tópico → Recuperação de Material → Síntese de Quiz
Fase B: Respostas do Aluno → Classificação → Análise de Erros → Feedback Formativo
```

---

## Fase A: Geração de Quiz

### 1. Inicialização do Agente

O Agente Quiz Master é inicializado com:

- **Papel:** "Agente Quiz Master"
- **Objetivo:** Criar quiz de prática personalizado
- **Ferramentas:** Pesquisa Qdrant, LLM para geração de perguntas
- **Contexto:** `course_id`, `student_id`, `student_quiz_history` (opcional)

### 2. Elicitação do Tópico

Diálogo agente-aluno:

> **Agente:** "Sobre que tópico gostaria de ser testado?"  
> **Aluno:** "Redes Neurais"  
> **Agente:** *Valida se o tópico existe no Qdrant para o curso*

### 3. Seleção do Formato do Quiz

> **Agente:** "Prefere verdadeiro/falso ou escolha múltipla? Quantas perguntas (3–10)?"  
> **Aluno:** "5 escolha múltipla"

O agente armazena: `topic`, `format`, `num_questions`

### 4. Recuperação de Material

Pesquisa Qdrant para conteúdo do quiz:

```json
{
  "collection": "course_materials",
  "query": "<embeddings do tópico>",
  "filter": { "course_id": "<curso do aluno>" },
  "top_k": 10,
  "threshold": 0.65
}
```

::: tip Porquê top_k=10?
Mais chunks recuperados = maior variedade na geração de perguntas
:::

### 5. Validação do Quiz

| Verificação | Ação |
|-------------|------|
| `k < 3` materiais | Agente sugere tópicos alternativos |
| `k >= 3` materiais | Prosseguir para geração de perguntas |

### 6. Geração de Perguntas

**Prompt de Sistema:**

```
Você é um expert em design de testes educacionais para alunos universitários.
Crie {num_questions} questões {format} baseadas nos materiais de aula fornecidos.

Requisitos:
- Cada questão testa um objetivo de aprendizagem distinto
- Progressão de dificuldade: primeiras 2 fáceis, próximas 2 médias, última 1 difícil
- Distratores plausíveis mas claramente incorretos
- TODO conteúdo vem dos materiais fornecidos
- Linguagem: Português (Portugal)

Formato de saída: JSON com estrutura exata abaixo.
```

### 7. Estrutura JSON do Quiz

```json
{
  "quiz_id": "uuid",
  "course_id": 123,
  "topic": "Redes Neurais",
  "format": "multiple_choice",
  "num_questions": 5,
  "created_at": "2025-12-16T20:30:00Z",
  "materials_used": ["chunk_id_1", "chunk_id_2"],
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "difficulty": "easy",
      "text": "O que é uma rede neural artificial?",
      "options": [
        {"label": "A", "text": "Um modelo computacional inspirado no cérebro humano"},
        {"label": "B", "text": "Uma rede de computadores interligados"},
        {"label": "C", "text": "Uma arquitetura de hardware específica"},
        {"label": "D", "text": "Um algoritmo de ordenação de dados"}
      ],
      "correct_answer": "A",
      "explanation": "Uma rede neural artificial é um modelo computacional...",
      "source_chunk": "chunk_id_1"
    }
  ]
}
```

---

## Fase B: Feedback de Respostas

### 1. Submissão de Respostas

O aluno submete respostas:

```json
{
  "quiz_id": "uuid",
  "answers": [
    {"question_id": 1, "answer": "A"},
    {"question_id": 2, "answer": "C"},
    {"question_id": 3, "answer": "B"}
  ]
}
```

### 2. Classificação

Para cada resposta:

- Comparar resposta do aluno vs. `correct_answer`
- Calcular: `score = corretas / num_questions`
- Marcar: ✅ (correta) / ❌ (incorreta)

### 3. Análise de Erros

Para respostas incorretas:

| Tipo de Erro | Descrição |
|--------------|-----------|
| **Mal-entendido do conceito** | Confusão fundamental sobre o tópico |
| **Erro por distração** | Compreensão correta, seleção incorreta |
| **Lacuna de conhecimento** | Tópico não totalmente estudado |

### 4. Geração de Feedback Formativo

Para cada pergunta incorreta:

```
❌ Pergunta 2: Incorreta

**Sua resposta:** C - "Uma técnica de compressão"
**Resposta correta:** A - "Um método de regularização"

**Explicação:** Dropout é uma técnica de regularização que 
aleatoriamente desativa neurónios durante o treino para 
prevenir overfitting. Não está relacionado com compressão de dados.

**Reveja:** Secção 3.2 em "aula_04_regularizacao.pdf"
```

### 5. Feedback Geral

```
📊 Resultado: 3/5 corretas (60%)

✅ **Pontos fortes:**
   Você demonstra boa compreensão de conceitos básicos de redes neurais.

📚 **Áreas a melhorar:**
   Foque em técnicas de regularização e otimização.

🎯 **Próximos passos:**
   • Reveja os materiais sobre regularização
   • Tente outro quiz sobre este tópico
   • Avance para "Redes Convolucionais"
```

### 6. Ciclo de Aprendizagem

- Armazenar desempenho do quiz no perfil do aluno
- Recomendar tópicos relacionados para estudo adicional
- Oferecer opções:
  - "Gerar outro quiz sobre este tópico?"
  - "Avançar para [próximo tópico]?"

---

## Próximos Passos

- [Plugin Moodle](/pt/integration/moodle-plugin) - Arquitetura de integração
- [Monitorização](/pt/deployment/monitoring) - Rastrear métricas de desempenho de quizzes
