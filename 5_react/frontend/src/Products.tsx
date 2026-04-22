import { useShop } from "./ShopContext";
import ItemTable from "./ItemTable";

export default function Products() {
  const { products, loading, error, loadProducts } = useShop();

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

  return (<div>
    <ItemTable rows={rows} />
    <button onClick={loadProducts}>Refresh products</button>
  </div>);
}
