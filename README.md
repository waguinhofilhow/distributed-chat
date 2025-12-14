# Projeto Chat Distribuído

Plataforma de comunicação em tempo real com múltiplos usuários, usando arquitetura distribuída com microsserviços.

---

## Estrutura do Projeto

projeto-chat/ 
├─ auth-service/ # Serviço de autenticação e usuários 
├─ chat-service/ # Serviço de mensagens / chat em tempo real 
├─ frontend/ # Interface do usuário 
└─ README.md

---

## Requisitos

- Node.js >= 18
- PostgreSQL
- NPM ou Yarn

---

## Configuração do Banco de Dados

1. Crie um banco PostgreSQL chamado `chatdb` (ou o nome que preferir, ajustando o `.env`).
2. Crie as tabelas necessárias:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL
   );

   CREATE TABLE messages (
     id SERIAL PRIMARY KEY,
     sender_id INTEGER REFERENCES users(id),
     receiver_id INTEGER REFERENCES users(id),
     content TEXT NOT NULL,
     timestamp TIMESTAMP DEFAULT NOW()
   );

---

## Instalação

Para cada serviço e frontend:

# Auth Service
cd auth-service
npm install

# Chat Service
cd ../chat-service
npm install

# Frontend
cd ../frontend
npm install

---

## Execução

# Auth Service

cd auth-service
npm run dev   # ou npm start

# Chat Service

cd chat-service
npm run dev   # ou npm start

# Frontend

cd frontend
npm run dev

O frontend será servido normalmente em http://localhost:5173/ (ou porta configurada pelo Vite).

---

## Testes Unitários

Auth Service: validação de credenciais, criação de usuário.

Chat Service: persistência de mensagens no banco.

# Auth Service
cd auth-service
npm test

# Chat Service
cd ../chat-service
npm test

---

## Observações

Todos os serviços usam .env para configuração de banco e porta.

Para rodar corretamente, cada serviço precisa do banco configurado conforme .env.

O frontend é simples, mas funcional, exibindo histórico de mensagens, usuários online e offline.

Desenvolvido por Wagner Augusto
