const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "segredo123"; // depois colocamos em .env

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: "Usuário já existe" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0)
    return res.status(401).json({ error: "Usuário não encontrado" });

  const user = result.rows[0];

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok)
    return res.status(401).json({ error: "Senha inválida" });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    SECRET,
    { expiresIn: "8h" }
  );

  res.json({
  token,
  user: {
    id: user.id,
    username: user.username
  }
});
});

module.exports = router;
