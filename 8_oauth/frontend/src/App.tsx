import React, { useState } from "react";

type Status = {
  code?: number;
  message: string;
  data?: any;
};

export const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState<number>(1);
  const [status, setStatus] = useState<Status>({ message: "Not requested" });

  const serviceBase = "http://localhost:4567";
  const apiPublicRoute = "/api-public";
  const apiPrivateRoute = "/api"

  const handleLogin: React.SubmitEventHandler<HTMLFormElement> = async(e: React.SubmitEvent<HTMLFormElement>) => { // https://stackoverflow.com/questions/68326000/cant-assign-submit-event-type#68326023
    e.preventDefault();
    setStatus({ message: "Logging in..." });
    try {
      const res = await fetch(`${serviceBase}${apiPublicRoute}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // send cookie
      });
      const body = await res.json();
      if (!res.ok) {
        setStatus({ code: res.status, message: body?.message ?? "Login failed" });
        setLoggedIn(false);
        return;
      }
      setStatus({ code: res.status, message: body?.message ?? "Logged in" });
      setLoggedIn(true);
    } catch (err) {
      setStatus({ message: "Network error" });
      setLoggedIn(false);
    }
  }

  const fetchItem = async (requestedId: number) => {
    setStatus({ message: `Fetching item ${requestedId}…` });
    try {
      const res = await fetch(`${serviceBase}${apiPrivateRoute}/items/${requestedId}`, {
        method: "GET",
        credentials: "include", // send cookie
      });
      const body = await res.json();
      if (!res.ok) {
        setStatus({ code: res.status, message: body?.message ?? "Error" });
        return;
      }
      setStatus({ code: res.status, message: "OK", data: body });
    } catch (err) {
      setStatus({ message: "Network error" });
    }
  }

  return (
    <main>
      <section>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username{" "}
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password{" "}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
        <div>
          <strong>Status:</strong> {status.message} {status.code ? `(${status.code})` : ""}
        </div>
      </section>

      {loggedIn && (
        <section>
          <h2>Items</h2>
          <div>
            <label>
              ID{" "}
              <input
                type="number"
                value={id}
                onChange={(e) => setId(Number(e.target.value))}
                min={1}
              />
            </label>
            <button onClick={() => fetchItem(id)}>
              Get Item
            </button>
            <button
              onClick={() => {
                const next = id + 1;
                setId(next);
                fetchItem(next);
              }}
            >
              Next Item
            </button>
          </div>

          <div>
            <strong>Last response:</strong>
            <pre>
              {status.data ? JSON.stringify(status.data, null, 2) : status.message}
            </pre>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
