import { useState } from "react";
import type { Product, UpdateProductRequest } from "./apiClient";

type Props = {
  product: Product;
  onSave: (req: UpdateProductRequest) => Promise<void> | void;
  onCancel: () => void;
};

export default function EditProductForm({ product, onSave, onCancel }: Props) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(
    product.description === "-" ? "" : product.description,
  );
  const [price, setPrice] = useState(product.priceCents?.toString() ?? "");
  const [stock, setStock] = useState(product.inStock.toString());

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await onSave({
      name,
      description,
      priceCents: Number(price),
      inStock: Number(stock),
    });
  }

  return (
    <form onSubmit={submit}>
      <h3>Edit product #{product.id}</h3>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (cents)"
      />

      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
      />

      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
