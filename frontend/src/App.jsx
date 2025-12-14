import { useState } from "react";
import Login from "./Login";
import Chat from "./Chat";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  if (!token || !user) {
    return (
      <Login
        onLogin={(t, u) => {
          setToken(t);
          setUser(u);
        }}
      />
    );
  }

  return <Chat token={token} user={user} />;
}
