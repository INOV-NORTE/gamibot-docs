---
title: Visão Geral da Gami API
description: Visão geral da camada de gamificação Gami API que melhora o GamiBot com XP, crachás e rastreio de progresso.
---

# Gami API

**Gami API** é um serviço backend que fornece a camada de gamificação para o GamiBot. Melhora Sistemas de Gestão de Aprendizagem como o Moodle com funcionalidades de gamificação conversacional, permitindo que os utilizadores ganhem XP e crachás através de interações com cursos.

---

## Funcionalidades Principais

### Modos Conversacionais

A API suporta três modos de interação:

| Modo | Descrição |
|------|-----------|
| **Clarify** | Fazer perguntas sobre tópicos |
| **Quiz** | Realizar quizzes para testar conhecimentos e ganhar XP |
| **Summarize** | Obter resumos de tópicos do curso |

### Sistema de Gamificação

#### Rastreio de XP

Os utilizadores ganham XP com base no seu desempenho nos quizzes:

| Pontuação Quiz | XP Ganho |
|----------------|----------|
| 0-20 | 0 XP |
| 21-40 | 5 XP |
| 41-60 | 10 XP |
| 61-80 | 15 XP |
| 81-100 | 20 XP |

#### Progresso de Tópicos

O desempenho nos quizzes também avança o progresso do tópico:

- **Pontuação 61-80**: +20% de progresso
- **Pontuação 81-100**: +40% de progresso
- Tópicos marcados como **Concluídos** a 100%

#### Crachás

Crachás automáticos recompensam várias conquistas:

| Crachá | Condição | Níveis |
|--------|----------|--------|
| **Sabes tudo** | Pontuação Quiz ≥ 90 | 1x, 3x, 7x |
| **Diamante bruto** | Pontuação Quiz 60-89 | 1x, 3x, 7x |
| **Acumulador** | XP Total do Curso | 100, 200, 300 XP |
| **Corta palavras** | Conversas de resumo | 3, 7, 11 |
| **Quizzólogo** | Conversas de quiz | 3, 7, 11 |
| **Analista de matéria** | Conversas de esclarecimento | 3, 7, 11 |
| **Sempre na conversa** | Total de conversas | 5, 10, 20 |

---

## Estatísticas do Utilizador

Para cada inscrição em curso, o sistema rastreia:

- **XP Total** - Soma de todo o XP ganho
- **Crachás** - Lista de crachás e progresso atual
- **Conclusões de Tópicos** - % de progresso para cada tópico
- **Estatísticas de Engagement** - Contagens de conversas por modo e tempo gasto

---

## Próximos Passos

- [Stack Tecnológica](/pt/gamification/tech-stack) - Tecnologias e configuração da API
- [Referência da API](/pt/gamification/api-reference) - Autenticação e endpoints
