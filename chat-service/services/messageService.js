const pool = require("../db");

async function saveMessage(senderId, receiverId, content) {
  const result = await pool.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, sender_id, receiver_id, content`,
    [senderId, receiverId, content]
  );

  return result.rows[0];
}

module.exports = {
  saveMessage
};
