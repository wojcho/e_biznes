import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from "./apiClient";

type Props = {
  open: boolean;
  product?: Product | null;

  onClose: () => void;

  onSubmit: (
    request: CreateProductRequest | UpdateProductRequest,
  ) => Promise<void>;
};

export default function ProductDialog({
  open,
  product,
  onClose,
  onSubmit,
}: Props) {
  const editing = product != null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setPrice(product?.priceCents?.toString() ?? "");
    setStock(product?.inStock?.toString() ?? "");
  }, [open, product]);

  const valid = useMemo(() => {
    if (!name.trim()) return false;

    const p = Number(price);
    const s = Number(stock);

    return Number.isFinite(p) && Number.isFinite(s) && p >= 0 && s >= 0;
  }, [name, price, stock]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      priceCents: Number(price),
      inStock: Number(stock),
    });

    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{editing ? "Edit Product" : "Create Product"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />

            <TextField
              label="Price (cents)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button type="submit" variant="contained" disabled={!valid}>
            {editing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
