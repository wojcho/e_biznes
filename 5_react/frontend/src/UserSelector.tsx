import { useNavigate } from "react-router";
import { useShop } from "./ShopContext";

export default function UserSelector() {
  const navigate = useNavigate();
  const { users, selectedUserId, setSelectedUserId, loading, error } = useShop();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value ? Number(e.target.value) : null;
    setSelectedUserId(id);
    if (id !== null) navigate(`/users/${id}`);
    else navigate("/users");
  };

  return (
    <div>
      <label>
        User:
        <select value={selectedUserId ?? ""} onChange={handleChange}>
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </label>
      {loading && <div>Loading users...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
