---
title: Arquitetura
description: Arquitetura de implantação e requisitos de infraestrutura para o Gamibot.
---

# Arquitetura de Implantação

Esta página descreve a arquitetura de implantação em produção e os requisitos de infraestrutura para a plataforma Gamibot.

---

## Ambiente de Produção

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

## Requisitos de Infraestrutura

### Servidor Moodle

| Requisito | Especificação |
|-----------|---------------|
| **SO** | Ubuntu 22.04 LTS |
| **RAM** | 8 GB mínimo |
| **Armazenamento** | 100 GB (escalável por carga de curso) |
| **PHP** | 8.0+ |
| **Base de Dados** | PostgreSQL 12+ |

### Motor LangFlow

| Requisito | Especificação |
|-----------|---------------|
| **SO** | Ubuntu 22.04 LTS ou container Docker |
| **RAM** | 16 GB mínimo |
| **CPU** | 4 cores (8 recomendado) |
| **Runtime** | Node.js 18+ / Python 3.10+ |
| **Armazenamento** | 50 GB (para cache de modelos) |

### Base de Dados Vetorial Qdrant

| Requisito | Especificação |
|-----------|---------------|
| **SO** | Ubuntu 22.04 LTS ou Docker |
| **RAM** | 32 GB mínimo (depende do tamanho da coleção vetorial) |
| **CPU** | 8 cores (16 recomendado) |
| **Armazenamento** | 500 GB inicial (SSD recomendado) |
| **Replicação** | 3+ nós para HA (produção) |

---

## Implantação Docker

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

### Iniciar a Stack

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f langflow
```

---

## Considerações de Escalabilidade

| Componente | Estratégia |
|------------|------------|
| **Moodle** | Múltiplas instâncias atrás de load balancer (nginx) |
| **LangFlow** | Múltiplas instâncias worker; jobs em fila com Redis |
| **Qdrant** | Coleções particionadas por curso ou período; replicadas entre nós |
| **Caching** | Redis para histórico de chat e resumos frequentes |

---

## Próximos Passos

- [Segurança e Privacidade](/pt/deployment/security) - Medidas de proteção de dados
- [Monitorização](/pt/deployment/monitoring) - Verificações de saúde e métricas
