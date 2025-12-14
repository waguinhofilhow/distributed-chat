const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

// Configuração do Pool usando variáveis de ambiente
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "1",
  database: process.env.DB_NAME || "chatdb",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432
});

app.use(cors());
app.use(express.json());

// rotas
app.use("/auth", require("./routes/auth"));

// rota para listar usuários
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// 🔹 SÓ escuta se rodar diretamente (npm start / node index.js)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Auth-service rodando na porta ${PORT}`);
  });
}

// Exporta app e pool para testes unitários
module.exports = { app, pool };
