import { useEffect, useState } from "react";
import { ApiClient, type User, ApiError } from "./apiClient";

export default function UserSelector({
  api,
  value,
  onChange,
}: {
  api: ApiClient;
  value: number | null;
  onChange: (id: number | null) => void;
}) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .listUsers()
      .then((u) => {
        if (!mounted) return;
        setUsers(u);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
        else setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [api, onChange]);

  return (
    <div>
      <label>
        <div>
          User:
        </div>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Select User</option>
          {users?.map((u) => (
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
