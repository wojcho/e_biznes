import { Routes, Route, Link, useNavigate, useParams } from "react-router";
import Products from "./Products";
import UserSelector from "./UserSelector";
import Basket from "./Basket";
import Payments from "./Payments";
import type { ApiClient } from "./apiClient";

export default function App({ api }: { api: ApiClient }) {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/users">Users</Link>
      </nav>
      <hr />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>Welcome</h2>
              <p>Select a route: Products or Users.</p>
            </div>
          }
        />
        <Route path="/products" element={<Products api={api} />} />
        <Route
          path="/users"
          element={<UsersIndex api={api} />}
        />
        <Route
          path="/users/:id"
          element={<UserPage api={api} />}
        />
      </Routes>
    </div>
  );
}

function UsersIndex({ api }: { api: ApiClient }) {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Users</h2>
      <UserSelector
        api={api}
        value={null}
        onChange={(id) => {
          if (id == null) return;
          navigate(`/users/${id}`);
        }}
      />
    </div>
  );
}

function UserPage({ api }: { api: ApiClient }) {
  const { id } = useParams<{ id: string }>();
  const userId = id ? Number(id) : null;
  if (!userId) return <div>Invalid user id.</div>;
  return (
    <div>
      <h2>User {userId}</h2>
      <Basket api={api} userId={userId} />
      <Payments api={api} userId={userId} />
    </div>
  );
}
