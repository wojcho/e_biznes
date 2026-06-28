import { useState } from "react";
import { useShop } from "./ShopContext";

export default function CreateProductForm() {
  const { createProduct } = useShop();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await createProduct({
      name,
      description,
      priceCents: Number(price),
      inStock: Number(stock),
    });

    setName("");
    setDescription("");
    setPrice("");
    setStock("");
  }

  return (
    <form onSubmit={submit}>
      <h3>Create product</h3>

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

      <button type="submit">Create</button>
    </form>
  );
}
