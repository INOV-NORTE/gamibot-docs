---
title: API Reference
description: Gami API authentication and endpoint documentation.
---

# API Reference

This page describes the authentication and endpoint documentation for the Gami API.

---

## Interactive Documentation

Swagger documentation is available at:

👉 `http://localhost:3000/documentation`

---

## Authentication

All API requests (except `/health` and `/documentation`) require authentication headers:

| Header | Description |
|--------|-------------|
| `x-moodle-api-key` | Your Moodle Instance API Key |
| `x-moodle-api-secret` | Your Moodle Instance API Secret |

These credentials authenticate the Moodle instance making the request, ensuring multi-tenancy security.

### Example Request

```bash
curl -X GET "http://localhost:3000/api/stats/user/123/course/456" \
  -H "x-moodle-api-key: your-api-key" \
  -H "x-moodle-api-secret: your-api-secret"
```

---

## Health Check

```
GET /health
```

Returns API health status. Does not require authentication.

---

## Core Endpoints

### User Statistics

```
GET /api/stats/user/{userId}/course/{courseId}
```

Returns user statistics for a specific course, including:
- Total XP
- Badge progress
- Topic completions
- Engagement stats

### Conversation Tracking

```
POST /api/conversations
```

Records a conversation and processes gamification rewards:
- XP allocation
- Topic progress updates
- Badge checks

### Badge Management

```
GET /api/badges/user/{userId}/course/{courseId}
```

Returns all badges and their status for a user in a course.

---

## Next Steps

- [Gami API Overview](/en/gamification/overview) - Features overview
- [Moodle Plugin](/en/integration/moodle-plugin) - Integration with Moodle
