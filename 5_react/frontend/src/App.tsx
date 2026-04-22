import { Routes, Route, Link, useParams } from "react-router";
import Products from "./Products";
import UserSelector from "./UserSelector";
import Basket from "./Basket";
import Payments from "./Payments";
import type { ApiClient } from "./apiClient";
import { ShopProvider } from "./ShopContext";

export default function App({ api }: { api: ApiClient }) {
  return (
    <ShopProvider api={api}>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/users">Users</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersIndex />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
      </div>
    </ShopProvider>
  );
}

function HomePage() {
  return (<div>
    <h2>Welcome</h2>
    <p>
      Select a route: {" "}
      <Link to="/products">Products</Link>
      {" "} or {" "}
      <Link to="/users">Users</Link>
      .
    </p>
  </div>);
}

function ProductsPage() {
  return (
    <div>
      <h2>Products</h2>
      <Products/>
    </div>
  );
}

function UsersIndex() {
  return (
    <div>
      <h2>Users</h2>
      <UserSelector/>
    </div>
  );
}

function UserPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? Number(id) : null;
  if (!userId) return <div>Invalid user id.</div>;
  return (
    <div>
      <h2>User {userId}</h2>
      <Basket />
      <Payments />
    </div>
  );
}
