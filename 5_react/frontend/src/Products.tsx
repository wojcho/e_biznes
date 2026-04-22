import { useEffect, useState } from "react";
import { ApiClient, type Product, ApiError } from "./apiClient";
import ItemTable from "./ItemTable";

export default function Products({ api }: { api: ApiClient }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .listProducts()
      .then((ps) => {
        if (!mounted) return;
        setProducts(ps);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
        else setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [api]);

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

  return <ItemTable rows={rows} isForBasket />;
}
