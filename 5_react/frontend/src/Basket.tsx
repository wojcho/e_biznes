import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import ItemTable from "./ItemTable";
import { useShop } from "./ShopContext";

export default function Basket() {
  const {
    basket,
    productsById,
    loading,
    error,
    refreshBasket,
    removeFromBasket,
  } = useShop();

  const rows =
    basket?.map((item) => {
      const product = productsById[item.productId];

      return {
        id: item.productId,
        name: product?.name ?? `#${item.productId}`,
        description: product?.description ?? "-",
        priceCents: product?.priceCents ?? null,
        inStockOrQuantity: item.quantity,
      };
    }) ?? [];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Basket</Typography>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refreshBasket}
        >
          Refresh
        </Button>
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && basket == null && (
        <Typography color="text.secondary">No basket available.</Typography>
      )}

      {!loading && basket && (
        <ItemTable rows={rows} isForBasket onDelete={removeFromBasket} />
      )}
    </Stack>
  );
}
