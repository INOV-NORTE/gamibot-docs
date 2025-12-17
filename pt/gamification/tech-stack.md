---
title: Stack Tecnológica e Configuração
description: Stack tecnológica e instruções de instalação da Gami API.
---

# Stack Tecnológica e Configuração

Esta página descreve a stack tecnológica e as instruções de configuração para a Gami API.

---

## Stack Tecnológica

| Componente | Tecnologia |
|------------|------------|
| **Runtime** | Node.js (TypeScript) |
| **Framework** | Fastify |
| **Base de Dados** | PostgreSQL |
| **ORM** | Prisma |
| **Validação** | Zod |
| **Documentação** | Swagger / OpenAPI |
| **Containerização** | Docker & Docker Compose |

---

## Pré-requisitos

- Node.js v18+
- Docker & Docker Compose

---

## Variáveis de Ambiente

Crie um ficheiro `.env` no diretório raiz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gamibot?schema=public"
```

---

## Instalação

### Docker (Recomendado)

Inicie a API e a base de dados PostgreSQL:

```bash
docker-compose up -d --build
```

A API estará disponível em `http://localhost:3000`.

### Desenvolvimento Local

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Executar Migrações**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

3. **Iniciar Servidor**:
   ```bash
   npm run dev
   ```

---

## Testes

O projeto usa **Vitest** para testes de integração:

```bash
npm test
```

### Suites de Teste

| Suite | Cobertura |
|-------|-----------|
| **Testes de XP** | XP atribuído corretamente com base nas pontuações |
| **Testes de Tópicos** | Progresso calculado com precisão |
| **Testes de Crachás** | Todos os crachás atribuídos quando as condições são cumpridas |
| **Testes de Stats** | Agregação de estatísticas e inicialização |

---

## Próximos Passos

- [Referência da API](/pt/gamification/api-reference) - Autenticação e endpoints
- [Visão Geral da Gami API](/pt/gamification/overview) - Visão geral das funcionalidades
