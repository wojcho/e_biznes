import { useState } from "react";

import { Alert, Button, Chip, Stack, Typography } from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";

import type { PaymentResponse } from "./apiClient";
import { useShop } from "./ShopContext";

export default function Payments() {
  const { checkout, selectedUserId } = useShop();

  const [result, setResult] = useState<PaymentResponse | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!selectedUserId) return;

    setLoading(true);

    try {
      const response = await checkout("card");

      if (response) {
        setResult(response);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Checkout</Typography>

      <Button
        variant="contained"
        startIcon={<CreditCardIcon />}
        onClick={handleCheckout}
        disabled={loading || !selectedUserId}
      >
        Checkout with Card
      </Button>

      {result && (
        <Alert severity={result.success ? "success" : "error"}>
          <Stack spacing={1}>
            <Typography>{result.message}</Typography>

            {result.totalCents != null && (
              <Chip
                color="success"
                label={`Total $${(result.totalCents / 100).toFixed(2)}`}
              />
            )}
          </Stack>
        </Alert>
      )}
    </Stack>
  );
}
