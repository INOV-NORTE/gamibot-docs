---
title: Architecture
description: Deployment architecture and infrastructure requirements for Gamibot.
---

# Deployment Architecture

This page describes the production deployment architecture and infrastructure requirements for the Gamibot platform.

---

## Production Environment

```
┌──────────────────────────────────────────────────────────────┐
│                      Internet / VPN                           │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐          ┌────▼────┐          ┌────▼────┐
   │  Moodle  │          │ LangFlow │          │ Qdrant  │
   │  Server  │◄────────►│  Engine  │◄────────►│   DB    │
   │(PHP/Node)│          │(Node/Py) │          │(Rust)   │
   └──────────┘          └──────────┘          └─────────┘
        │                     │
        └──────────┬──────────┘
                   │
            ┌──────▼──────┐
            │  PostgreSQL │
            │  (Moodle DB)│
            └─────────────┘
```

---

## Infrastructure Requirements

### Moodle Server

| Requirement | Specification |
|-------------|---------------|
| **OS** | Ubuntu 22.04 LTS |
| **RAM** | 8 GB minimum |
| **Storage** | 100 GB (scalable by course load) |
| **PHP** | 8.0+ |
| **Database** | PostgreSQL 12+ |

### LangFlow Engine

| Requirement | Specification |
|-------------|---------------|
| **OS** | Ubuntu 22.04 LTS or Docker container |
| **RAM** | 16 GB minimum |
| **CPU** | 4 cores (8 recommended) |
| **Runtime** | Node.js 18+ / Python 3.10+ |
| **Storage** | 50 GB (for model caching) |

### Qdrant Vector DB

| Requirement | Specification |
|-------------|---------------|
| **OS** | Ubuntu 22.04 LTS or Docker |
| **RAM** | 32 GB minimum (depends on vector collection size) |
| **CPU** | 8 cores (16 recommended) |
| **Storage** | 500 GB initial (SSD recommended) |
| **Replication** | 3+ nodes for HA (production) |

---

## Docker Deployment

### docker-compose.yml

```yaml
version: '3.8'

services:
  moodle:
    image: moodle:4.2
    environment:
      DB_HOST: postgres
      DB_USER: moodle
      DB_PASSWORD: ${MOODLE_DB_PASSWORD}
    ports:
      - "8080:80"
    volumes:
      - ./plugins/local_gamibot_manager:/var/www/html/local/gamibot_manager
    depends_on:
      - postgres

  langflow:
    image: langflowai/langflow:latest
    environment:
      PYTHONUNBUFFERED: 1
      QDRANT_HOST: qdrant
      QDRANT_PORT: 6333
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "7860:7860"
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant:latest
    environment:
      QDRANT_API_KEY: ${QDRANT_API_KEY}
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: moodle
      POSTGRES_USER: moodle
      POSTGRES_PASSWORD: ${MOODLE_DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  qdrant_storage:
  postgres_data:
```

### Environment Variables

Create a `.env` file:

```bash
# Database
MOODLE_DB_PASSWORD=secure_password_here

# LLM Provider
OPENAI_API_KEY=sk-...

# Vector Database
QDRANT_API_KEY=your_qdrant_api_key
```

### Starting the Stack

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f langflow
```

---

## Scaling Considerations

### Horizontal Scaling

| Component | Strategy |
|-----------|----------|
| **Moodle** | Multiple instances behind load balancer (nginx) |
| **LangFlow** | Multiple worker instances; queue jobs with Redis |
| **Qdrant** | Sharded collections by course or time period; replicated across nodes |
| **Caching** | Redis for chat history and frequently accessed summaries |

### Load Balancer Configuration

```nginx
# nginx.conf
upstream moodle_servers {
    server moodle1:80 weight=1;
    server moodle2:80 weight=1;
    server moodle3:80 weight=1;
}

upstream langflow_workers {
    server langflow1:7860;
    server langflow2:7860;
    server langflow3:7860;
}

server {
    listen 80;
    server_name moodle.example.com;

    location / {
        proxy_pass http://moodle_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Kubernetes Deployment

For larger deployments, use Kubernetes:

```yaml
# qdrant-deployment.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: qdrant
spec:
  serviceName: qdrant
  replicas: 3
  selector:
    matchLabels:
      app: qdrant
  template:
    metadata:
      labels:
        app: qdrant
    spec:
      containers:
      - name: qdrant
        image: qdrant/qdrant:latest
        ports:
        - containerPort: 6333
        volumeMounts:
        - name: storage
          mountPath: /qdrant/storage
  volumeClaimTemplates:
  - metadata:
      name: storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 100Gi
```

---

## Backup Strategy

### Qdrant Snapshots

```bash
# Create snapshot
curl -X POST "http://localhost:6333/collections/course_materials/snapshots"

# List snapshots
curl "http://localhost:6333/collections/course_materials/snapshots"

# Restore from snapshot
curl -X PUT "http://localhost:6333/collections/course_materials/snapshots/recover" \
  -H "Content-Type: application/json" \
  -d '{"location": "snapshot_name"}'
```

### PostgreSQL Backup

```bash
# Daily backup
pg_dump -h localhost -U moodle moodle > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U moodle moodle < backup_20251216.sql
```

---

## Next Steps

- [Security & Privacy](/en/deployment/security) - Data protection measures
- [Monitoring](/en/deployment/monitoring) - Health checks and metrics
