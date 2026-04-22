import { useState } from "react";
import { useShop } from "./ShopContext";
import type { PaymentResponse } from "./apiClient";

export default function Payments() {
  const { checkout, selectedUserId } = useShop();
  const [checkoutResult, setCheckoutResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheckout = async (paymentMethod = "card") => {
    if (!selectedUserId) return;
    setError(null);
    const result = await checkout(paymentMethod);
    if (result) setCheckoutResult(result);
  };

  return (
    <div>
      <button onClick={() => runCheckout("card")}>Checkout with Card</button>

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