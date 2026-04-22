import { useEffect, useState } from "react";
import { ApiClient, type BasketItem, type PaymentResponse, ApiError, type User } from "./apiClient";

export function Payments({ api }: { api: ApiClient }) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [basket, setBasket] = useState<BasketItem[] | null>(null);
  const [loadingBasket, setLoadingBasket] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .listUsers()
      .then((u) => {
        if (!mounted) return;
        setUsers(u);
        if (u.length > 0) setSelectedUserId((id) => id ?? u[0].id);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
        else setError(String(err));
      });
    return () => {
      mounted = false;
    };
  }, [api]);

  useEffect(() => {
    if (selectedUserId == null) {
      setBasket(null);
      return;
    }
    setLoadingBasket(true);
    setError(null);
    api
      .listBasket(selectedUserId)
      .then((b) => setBasket(b))
      .catch((err: unknown) => {
        if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
        else setError(String(err));
        setBasket(null);
      })
      .finally(() => setLoadingBasket(false));
  }, [api, selectedUserId]);

  const runCheckout = async (paymentMethod?: string) => {
    if (selectedUserId == null) {
      setError("No user selected");
      return;
    }
    setError(null);
    setCheckoutResult(null);
    try {
      const res = await api.checkoutBasket(selectedUserId, {
        userId: selectedUserId,
        paymentMethod,
      });
      setCheckoutResult(res);
      // refresh basket after checkout
      const refreshed = await api.listBasket(selectedUserId);
      setBasket(refreshed);
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
      else setError(String(err));
    }
  };

  return (
    <div>
      <div>
        <label>
          User:{" "}
          <select
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">select user</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </label>
      </div>

      {loadingBasket && <div>Loading basket…</div>}
      {error && <div>Error: {error}</div>}

      {!loadingBasket && basket && (
        <>
          <h3>Basket</h3>
          {basket.length === 0 ? (
            <div>Basket is empty.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {basket.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.productId}</td>
                    <td>
                      {it.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div>
            <button onClick={() => runCheckout("card")} disabled={basket.length === 0}>
              Checkout (card)
            </button>
          </div>
        </>
      )}

      {checkoutResult && (
        <div>
          <strong>{checkoutResult.success ? "Success" : "Failed"}:</strong> {checkoutResult.message}
          {checkoutResult.totalCents != null && (
            <div>Total: ${(checkoutResult.totalCents / 100).toFixed(2)}</div>
          )}
        </div>
      )}
    </div>
  );
}
