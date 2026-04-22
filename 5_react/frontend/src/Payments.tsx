import { useState } from "react";
import { ApiClient, type PaymentResponse, ApiError } from "./apiClient";

export default function Payments({ api, userId }: { api: ApiClient; userId: number }) {
  const [checkoutResult, setCheckoutResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheckout = async (userId: number, paymentMethod?: string) => {
    setError(null);
    setCheckoutResult(null);
    try {
      const res = await api.checkoutBasket(userId, { userId, paymentMethod });
      setCheckoutResult(res);
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
      else setError(String(err));
    }
  };

  return (
    <div>
      <button onClick={() => runCheckout(userId, "card")}>Checkout</button>

      {error && <div>Error: {error}</div>}

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
