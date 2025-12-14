const { io } = require("socket.io-client");

// COLE AQUI O TOKEN DE UM USUÁRIO
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJib2IiLCJpYXQiOjE3NjU3MDM5MjUsImV4cCI6MTc2NTczMjcyNX0.NN8cwjY4Dfs8XW_7jhb82rlCEGSntBAMiSRvkCq5Z80";

const socket = io("http://localhost:3002", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Conectado ao chat-service");

  // enviar mensagem após conectar
  socket.emit("private_message", {
    to: 4, // ID do outro usuário
    content: "Olá! Isso é uma mensagem de teste"
  });
});

socket.on("private_message", (msg) => {
  console.log("Mensagem recebida:", msg);
});

socket.on("connect_error", (err) => {
  console.error("Erro:", err.message);
});
