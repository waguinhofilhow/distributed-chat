const { saveMessage } = require("../services/messageService");
const pool = require("../db");

describe("Chat-service - Persistência de mensagens", () => {
  let senderId;
  let receiverId;

  beforeAll(async () => {
    // cria usuário remetente
    const sender = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
      ["sender_test", "hash_fake"]
    );

    // cria usuário destinatário
    const receiver = await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
      ["receiver_test", "hash_fake"]
    );

    senderId = sender.rows[0].id;
    receiverId = receiver.rows[0].id;
  });

  afterAll(async () => {
    // limpa mensagens
    await pool.query(
      "DELETE FROM messages WHERE sender_id = $1 OR receiver_id = $2",
      [senderId, receiverId]
    );

    // limpa usuários
    await pool.query(
      "DELETE FROM users WHERE id = $1 OR id = $2",
      [senderId, receiverId]
    );

    await pool.end();
  });

  test("Deve salvar uma mensagem corretamente no banco", async () => {
    const msg = await saveMessage(
      senderId,
      receiverId,
      "Olá, teste unitário!"
    );

    expect(msg).toHaveProperty("id");
    expect(msg.sender_id).toBe(senderId);
    expect(msg.receiver_id).toBe(receiverId);
    expect(msg.content).toBe("Olá, teste unitário!");
  });
});
