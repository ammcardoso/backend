# Catálogo de Detecção de Veículos

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL 15
- Docker / Docker Compose

## Pré-requisitos

- Node.js
- Docker
- npm

## Instalação

npm install

## Configuração

Criar o arquivo .env:

...

## Subindo o banco

docker compose up -d

## Migration

npm run prisma:migrate

## Seed

npm run seed

## Prisma Studio

npx prisma studio

## Executando a API

npm run dev

A API estará disponível em:

http://localhost:3001

## Endpoints

### GET /

Retorna o status da API.

### GET /api/vehicles

Retorna todos os veículos.

### GET /api/vehicles/:id

Retorna um veículo pelo ID.

## Exemplos

GET http://localhost:3001/

GET http://localhost:3001/api/vehicles

GET http://localhost:3001/api/vehicles/1