import { useShop } from "./ShopContext";
import ItemTable from "./ItemTable";
import CreateProductForm from "./CreateProductForm";
import { useState } from "react";
import EditProductForm from "./EditProductForm";
import type { Product } from "./apiClient";

export default function Products() {
  const {
    products,
    loading,
    error,
    loadProducts,
    updateProduct,
    deleteProduct,
    addToBasket,
  } = useShop();
  const [editing, setEditing] = useState<Product | null>(null);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products || products.length === 0) return <div>No products found.</div>;

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "-",
    priceCents: p.priceCents,
    inStockOrQuantity: p.inStock,
  }));

  return (
    <div>
      <ItemTable
        rows={rows}
        onDelete={deleteProduct}
        onAddToBasket={addToBasket}
        onEdit={(id) => {
          const product = products.find((p) => p.id === id);
          if (product) setEditing(product);
        }}
      />
      <CreateProductForm />
      {editing && (
        <EditProductForm
          product={editing}
          onSave={async (req) => {
            await updateProduct(editing.id, req);
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      )}
      <button onClick={loadProducts}>Refresh products</button>
    </div>
  );
}
