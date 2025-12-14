import { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await axios.post("http://localhost:3001/auth/login", {
      username,
      password
    });

    onLogin(res.data.token, res.data.user);
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Usuário" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
