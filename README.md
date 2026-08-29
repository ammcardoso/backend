# API de Detecção de Veículos 

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (Versão 16+)
- [npm](https://www.npmjs.com/) 
- [Docker](https://www.docker.com/) 
- [Docker Compose](https://docs.docker.com/compose/)

---

## Configuração do Ambiente

**1. Clone o repositório e instale as dependências:**
```bash
# Clone o repositório
git clone https://github.com/ammcardoso/backend.git

# Acesse a pasta do projeto
cd backend

# Instale as dependências
npm install
```

**2. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com as credenciais do banco de dados (use o exemplo abaixo):

```env
# Configurações do container PostgreSQL
POSTGRES_USER=seu_user_aqui
POSTGRES_PASSWORD=sua_senha_aqui
POSTGRES_DB=seu_banco_aqui

# URL de conexão do Prisma
DATABASE_URL="postgresql://seu_user_aqui:sua_senha_aqui@localhost:5432/seu_banco_aqui?schema=public"
```

---

## Banco de Dados e Prisma

**1. Subindo o banco de dados via Docker:**
```bash
docker compose up -d
```

**2. Executando as Migrations (criação das tabelas):**
```bash
npm run prisma:migrate
```

**3. Populando o banco com dados iniciais (Seed):**
```bash
npm run seed
```

**4. (Opcional) Visualizando os dados no Prisma Studio:**
```bash
npx prisma studio
```
> O Prisma Studio abrirá no seu navegador em `http://localhost:5555`.

---

## Executando a API

Para iniciar o servidor em ambiente de desenvolvimento:

```bash
npm run dev
```

A API estará disponível no endereço: **`http://localhost:3001`**

---

## Endpoints da API

Abaixo estão as rotas disponíveis na aplicação:

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/` | Retorna o status da API. |
| `GET` | `/api/vehicles` | Retorna os detalhes das passagens dos veículos. |
| `GET` | `/api/vehicles/:id` | Retorna os detalhes  das passagens dos veículos pelo `ID`. |

### Exemplos de Requisição

Você pode testar as rotas diretamente no navegador, via Postman/Insomnia ou usando o `curl`:

**Status da API:**
```bash
curl -X GET http://localhost:3001/
```

**Listar todos os veículos:**
```bash
curl -X GET http://localhost:3001/api/vehicles
```

**Buscar um veículo pelo ID (ex: 1):**
```bash
curl -X GET http://localhost:3001/api/vehicles/1
```

---
*Desenvolvido por Adriana Cardoso para fins acadêmicos.*
