# Gami API

Gami API is a backend service designed to enhance Learning Management Systems (LMS) like Moodle with conversational gamification features. It enables users to interact with course content through chat and quizzes, earning XP and badges along the way.

## 🚀 Features

### Conversational Interface
- **Modes**:
  - `clarify`: Ask questions about topics.
  - `quiz`: Take quizzes to test knowledge and earn XP.
  - `summarize`: Get summaries of topics.

### Gamification System
Rewarding user engagement and performance is at the core of GamiBot.

#### XP Tracking
Users earn XP based on their performance in `quiz` mode conversations:
- **0-20 Score**: 0 XP
- **21-40 Score**: 5 XP
- **41-60 Score**: 10 XP
- **61-80 Score**: 15 XP
- **81-100 Score**: 20 XP

#### Topic Progress
- **61-80 Score**: +20% progress on the topic.
- **81-100 Score**: +40% progress on the topic.
- Topics are marked **Completed** when progress reaches 100%.

#### Badges
Automated badges are awarded for various achievements:

| Badge | Condition | Levels |
| :--- | :--- | :--- |
| **Sabes tudo** | Quiz Score ≥ 90 | Lvl 1 (1x), Lvl 2 (3x), Lvl 3 (7x) |
| **Diamante bruto** | Quiz Score 60-89 | Lvl 1 (1x), Lvl 2 (3x), Lvl 3 (7x) |
| **Acumulador** | Total Course XP | Lvl 1 (100xp), Lvl 2 (200xp), Lvl 3 (300xp) |
| **Corta palavras** | `summarize` conversations | Lvl 1 (3), Lvl 2 (7), Lvl 3 (11) |
| **Quizzólogo** | `quiz` conversations | Lvl 1 (3), Lvl 2 (7), Lvl 3 (11) |
| **Analista de matéria** | `clarify` conversations | Lvl 1 (3), Lvl 2 (7), Lvl 3 (11) |
| **Sempre na conversa** | Total conversations | Lvl 1 (5), Lvl 2 (10), Lvl 3 (20) |

### User Statistics
For each course enrollment, the system tracks and aggregates:
- **Total XP**: Sum of all XP earned.
- **Badges**: List of badges and current progress.
- **Topic Completions**: Progress % for each topic.
- **Engagement Stats**:
  - Count of conversations by mode (Clarify, Quiz, Summarize).
  - Total time spent in conversations.

## 🛠️ Tech Stack

- **Runtime**: Node.js (TypeScript)
- **Framework**: Fastify
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: Swagger / OpenAPI
- **Containerization**: Docker & Docker Compose

## 📦 Setup & Installation

### Prerequisites
- Node.js v18+
- Docker & Docker Compose

### Environment Variables
Create a `.env` file in the root directory (copy `.env.example` if available, or use the template below):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gamibot?schema=public"
```

### Running with Docker (Recommended)
This will start both the API and the PostgreSQL database.

```bash
docker-compose up -d --build
```
The API will be available at `http://localhost:3000`.

### Running Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Database** (if not using Docker for DB):
    Ensure you have a Postgres instance running and update `DATABASE_URL`.

3.  **Run Migrations**:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

4.  **Start Server**:
    ```bash
    npm run dev
    ```

## 📖 API Documentation

Interactive Swagger documentation is available at:
👉 **[http://localhost:3000/documentation](http://localhost:3000/documentation)**

### Authentication
All API requests (except `/health` and `/documentation`) must include the following headers:
- `x-moodle-api-key`: Your Moodle Instance API Key
- `x-moodle-api-secret`: Your Moodle Instance API Secret

These credentials authenticate the Moodle instance making the request, ensuring multi-tenancy security.

## ✅ Verification & Testing

The project uses **Vitest** for integration testing, covering various logic scenarios such as XP tracking, topic progress, and badge automation.

To run the integration tests:

```bash
npm test
```

### Test Suites
- **XP Tests**: Verifies that XP is awarded correctly based on quiz scores and accumulated properly.
- **Topic Tests**: Ensures topic progress is calculated accurately and topics are marked as completed when reaching 100%.
- **Badge Tests**: Validates that all badges (Sabes tudo, Diamante bruto, Acumulador, etc.) are awarded when conditions are met.
- **Stats Tests**: Verifies the aggregation of user statistics and the lazy initialization of enrollments.
