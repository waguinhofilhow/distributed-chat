const { io } = require("socket.io-client");

// COLE AQUI O TOKEN DE UM USUÁRIO
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhbGljZSIsImlhdCI6MTc2NTcwMzUzOSwiZXhwIjoxNzY1NzMyMzM5fQ.Ib3qFP1TofUHxYZlUKVlJsuarHTCTQCGSOvcQCOkBOc";

const socket = io("http://localhost:3002", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Conectado ao chat-service");

  // enviar mensagem após conectar
  socket.emit("private_message", {
    to: 5, // ID do outro usuário
    content: "Olá! Isso é uma mensagem de teste"
  });
});

socket.on("private_message", (msg) => {
  console.log("Mensagem recebida:", msg);
});

socket.on("connect_error", (err) => {
  console.error("Erro:", err.message);
});
