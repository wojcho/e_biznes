import { useMemo, useState } from "react";

import { Alert, Box, Button, CircularProgress, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "./apiClient";

import ItemTable from "./ItemTable";
import ProductDialog from "./ProductDialog";
import { useShop } from "./ShopContext";

export default function Products() {
  const {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addToBasket,
  } = useShop();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const rows = useMemo(
    () =>
      products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? "-",
        priceCents: p.priceCents,
        inStockOrQuantity: p.inStock,
      })),
    [products],
  );

  function openCreateDialog() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEditDialog(id: number) {
    const product = products.find((p) => p.id === id);

    if (!product) return;

    setEditing(product);
    setDialogOpen(true);
  }

  async function handleSubmit(
    request: CreateProductRequest | UpdateProductRequest,
  ) {
    if (editing) {
      await updateProduct(editing.id, request as UpdateProductRequest);
    } else {
      await createProduct(request as CreateProductRequest);
    }
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          New Product
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadProducts}
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

      {!loading && (
        <ItemTable
          rows={rows}
          onDelete={deleteProduct}
          onAddToBasket={addToBasket}
          onEdit={openEditDialog}
        />
      )}

      <ProductDialog
        open={dialogOpen}
        product={editing}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </Stack>
  );
}
