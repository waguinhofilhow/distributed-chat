const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const verifyToken = require("./utils/auth");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const usersOnline = {}; // userId -> socketId

// Middleware de autenticação WebSocket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const user = verifyToken(token);

  if (!user) return next(new Error("Token inválido"));

  socket.user = user;
  next();
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  usersOnline[userId] = socket.id;

  console.log(`Usuário ${userId} conectado`);

  // 🔔 avisa todos os clientes quem está online
  io.emit("users_online", Object.keys(usersOnline));

  socket.on("private_message", async ({ to, content }) => {
    const { saveMessage } = require("./services/messageService");

    await saveMessage(userId, to, content);

    // enviar em tempo real
    if (usersOnline[to]) {
      io.to(usersOnline[to]).emit("private_message", {
        from: userId,
        content
      });
    }
  });

  socket.on("disconnect", () => {
    delete usersOnline[userId];
    console.log(`Usuário ${userId} desconectado`);

    // 🔔 atualiza lista de online
    io.emit("users_online", Object.keys(usersOnline));
  });
});

// Endpoint REST para histórico
app.get("/history/:u1/:u2", async (req, res) => {
  const { u1, u2 } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE (sender_id=$1 AND receiver_id=$2)
          OR (sender_id=$2 AND receiver_id=$1)
       ORDER BY timestamp ASC`,
      [u1, u2]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

// 🔹 Porta configurável via .env
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Chat-service rodando na porta ${PORT}`);
});

// Exporta para testes e integração
module.exports = { app, server, io, usersOnline, pool };
