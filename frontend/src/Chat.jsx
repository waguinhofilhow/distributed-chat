import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export default function Chat({ token, user }) {
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [to, setTo] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  // URLs dos serviços via .env
  const AUTH_URL = import.meta.env.VITE_AUTH_URL;
  const CHAT_URL = import.meta.env.VITE_CHAT_URL;

  // 🔌 Conexão WebSocket
  useEffect(() => {
    const s = io(CHAT_URL, { auth: { token } });

    s.on("private_message", (m) => {
      setMessages(prev => [...prev, m]);
    });

    s.on("users_online", (users) => {
      setOnlineUsers(users.map(u => Number(u)));
    });

    setSocket(s);
    return () => s.disconnect();
  }, [token]);

  // 👥 Carregar TODOS os usuários
  useEffect(() => {
    async function loadUsers() {
      const res = await axios.get(`${AUTH_URL}/users`);

      const map = {};
      res.data.forEach(u => {
        map[u.id] = u.username;
      });

      setUsersMap(map);
      setAllUsers(res.data);
    }

    loadUsers();
  }, []);

  // 📜 Histórico
  async function loadHistory(otherUserId) {
    if (!otherUserId) return;

    const res = await axios.get(
      `${CHAT_URL}/history/${user.id}/${otherUserId}`
    );

    const formatted = res.data.map(m => ({
      from: m.sender_id,
      content: m.content
    }));

    setMessages(formatted);
  }

  // ✉️ Enviar mensagem
  function send() {
    if (!msg || !to || !socket) return;

    socket.emit("private_message", { to, content: msg });

    setMessages(prev => [...prev, { from: user.id, content: msg }]);
    setMsg("");
  }

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      {/* COLUNA ESQUERDA */}
      <div style={{ width: 220 }}>
        <h3>Usuário</h3>
        <div>{user.username}</div>

        <h4>Usuários</h4>
        <ul>
          {allUsers
            .filter(u => u.id !== user.id)
            .map(u => {
              const isOnline = onlineUsers.includes(u.id);
              return (
                <li
                  key={u.id}
                  style={{ cursor: "pointer", color: isOnline ? "green" : "gray" }}
                  onClick={() => {
                    setTo(u.id);
                    loadHistory(u.id);
                  }}
                >
                  {u.username} {isOnline ? "🟢" : "⚪"}
                </li>
              );
            })}
        </ul>
      </div>

      {/* COLUNA DIREITA */}
      <div style={{ flex: 1 }}>
        <h3>
          {to
            ? `Chat com ${usersMap[to]} ${onlineUsers.includes(to) ? "🟢" : "⚪"}`
            : "Selecione um usuário"}
        </h3>

        <div
          style={{
            border: "1px solid #ccc",
            height: 300,
            overflow: "auto",
            padding: 10,
            marginBottom: 10
          }}
        >
          {messages.map((m, i) => (
            <div key={i}>
              <b>{m.from === user.id ? "eu" : usersMap[m.from] || "Usuário"}:</b>{" "}
              {m.content}
            </div>
          ))}
        </div>

        <input
          placeholder="Mensagem"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          style={{ width: "80%" }}
        />
        <button onClick={send}>Enviar</button>
      </div>
    </div>
  );
}
