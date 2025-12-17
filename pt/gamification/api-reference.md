---
title: Referência da API
description: Documentação de autenticação e endpoints da Gami API.
---

# Referência da API

Esta página descreve a autenticação e documentação de endpoints para a Gami API.

---

## Documentação Interativa

Documentação Swagger disponível em:

👉 **[http://localhost:3000/documentation](http://localhost:3000/documentation)**

---

## Autenticação

Todos os pedidos API (exceto `/health` e `/documentation`) requerem headers de autenticação:

| Header | Descrição |
|--------|-----------|
| `x-moodle-api-key` | Chave API da Instância Moodle |
| `x-moodle-api-secret` | Segredo API da Instância Moodle |

Estas credenciais autenticam a instância Moodle que faz o pedido, garantindo segurança multi-tenancy.

### Exemplo de Pedido

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

Retorna o estado de saúde da API. Não requer autenticação.

---

## Endpoints Principais

### Estatísticas do Utilizador

```
GET /api/stats/user/{userId}/course/{courseId}
```

Retorna estatísticas do utilizador para um curso específico, incluindo:
- XP Total
- Progresso de crachás
- Conclusões de tópicos
- Estatísticas de engagement

### Rastreio de Conversas

```
POST /api/conversations
```

Regista uma conversa e processa recompensas de gamificação:
- Atribuição de XP
- Atualizações de progresso de tópicos
- Verificações de crachás

### Gestão de Crachás

```
GET /api/badges/user/{userId}/course/{courseId}
```

Retorna todos os crachás e o seu estado para um utilizador num curso.

---

## Próximos Passos

- [Visão Geral da Gami API](/pt/gamification/overview) - Visão geral das funcionalidades
- [Plugin Moodle](/pt/integration/moodle-plugin) - Integração com Moodle
