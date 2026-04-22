import { useEffect, useState } from "react";
import { ApiClient, type Product, ApiError } from "./apiClient";

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

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>In stock</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.description ?? "-"}</td>
            <td>${(p.priceCents / 100).toFixed(2)}</td>
            <td>{p.inStock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
