import React, { useEffect, useState } from "react";

type Status = {
  code?: number;
  message: string;
  data?: any;
};

export const App = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState<number>(1);
  const [status, setStatus] = useState<Status>({ message: "Not requested" });

  const serviceBase = "http://localhost:4567";
  const apiPublicRoute = "/api-public";
  const apiPrivateRoute = "/api"

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          `${serviceBase}${apiPublicRoute}/session`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          return;
        }

        const body = await res.json();

        if (body.authenticated) {
          setLoggedIn(true);
          setStatus({
            code: 200,
            message: "Logged in",
          });
        }
      } catch {
        // ignore
      }
    };

    checkSession();
  }, []);

  const handleLogin: React.SubmitEventHandler<HTMLFormElement> = async(e: React.SubmitEvent<HTMLFormElement>) => { // https://stackoverflow.com/questions/68326000/cant-assign-submit-event-type#68326023
    e.preventDefault();
    setStatus({ message: "Logging in..." });
    try {
      const res = await fetch(`${serviceBase}${apiPublicRoute}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
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

  const handleRegister: React.SubmitEventHandler<HTMLFormElement> = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ message: "Registering..." });
    try {
      const res = await fetch(`${serviceBase}${apiPublicRoute}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: registerUsername, password: registerPassword }),
        credentials: "include", // send cookie
      });
      const body = await res.json();
      if (!res.ok) {
        setStatus({ code: res.status, message: body?.message ?? "Register failed" });
        return;
      }
      setStatus({ code: res.status, message: body?.message ?? "Registered" });
    } catch (err) {
      setStatus({ message: "Network error" });
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
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div>
            <label>
              Username{" "}
              <input
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password{" "}
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Register</button>
        </form>
      </section>

      <section>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username{" "}
              <input
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password{" "}
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </section>

      <section>
        <h2>Google Login</h2>

        <a href={`${serviceBase}${apiPublicRoute}/oauth/google`}>
          Login with Google
        </a>
      </section>

      <section>
        <h2>Status</h2>
        {status.message} {status.code ? `(${status.code})` : ""}

        <button
          onClick={async () => {
            await fetch(`${serviceBase}/api-public/logout`, {
              method: "POST",
              credentials: "include",
            });

            setLoggedIn(false);
            setStatus({ message: "Logged out" });
          }}
        >
          Logout
        </button>
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
