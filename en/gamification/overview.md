---
title: Gami API Overview
description: Overview of the Gami API gamification layer that enhances GamiBot with XP, badges, and progress tracking.
---

# Gami API

**Gami API** is a backend service that provides the gamification layer for GamiBot. It enhances Learning Management Systems like Moodle with conversational gamification features, enabling users to earn XP and badges through course interactions.

---

## Key Features

### Conversational Modes

The API supports three interaction modes:

| Mode | Description |
|------|-------------|
| **Clarify** | Ask questions about topics |
| **Quiz** | Take quizzes to test knowledge and earn XP |
| **Summarize** | Get summaries of course topics |

### Gamification System

#### XP Tracking

Users earn XP based on their quiz performance:

| Quiz Score | XP Earned |
|------------|-----------|
| 0-20 | 0 XP |
| 21-40 | 5 XP |
| 41-60 | 10 XP |
| 61-80 | 15 XP |
| 81-100 | 20 XP |

#### Topic Progress

Quiz performance also advances topic progress:

- **61-80 Score**: +20% progress
- **81-100 Score**: +40% progress
- Topics marked **Completed** at 100%

#### Badges

Automated badges reward various achievements:

| Badge | Condition | Levels |
|-------|-----------|--------|
| **Sabes tudo** | Quiz Score ≥ 90 | 1x, 3x, 7x |
| **Diamante bruto** | Quiz Score 60-89 | 1x, 3x, 7x |
| **Acumulador** | Total Course XP | 100, 200, 300 XP |
| **Corta palavras** | Summarize conversations | 3, 7, 11 |
| **Quizzólogo** | Quiz conversations | 3, 7, 11 |
| **Analista de matéria** | Clarify conversations | 3, 7, 11 |
| **Sempre na conversa** | Total conversations | 5, 10, 20 |

---

## User Statistics

For each course enrollment, the system tracks:

- **Total XP** - Sum of all XP earned
- **Badges** - List of badges and current progress
- **Topic Completions** - Progress % for each topic
- **Engagement Stats** - Conversation counts by mode and time spent

---

## Next Steps

- [Tech Stack](/en/gamification/tech-stack) - API technologies and setup
- [API Reference](/en/gamification/api-reference) - Authentication and endpoints
