import { useEffect, useState } from "react";
import { ApiClient, type BasketItem, type Product, ApiError } from "./apiClient";
import ItemTable from "./ItemTable";

export default function Basket({
  api,
  userId,
}: {
  api: ApiClient;
  userId: number;
}) {
  const [basket, setBasket] = useState<BasketItem[] | null>(null);
  const [productsById, setProductsById] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId == null) {
      setBasket(null);
      setProductsById({});
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .listBasket(userId)
      .then(async (b) => {
        if (!mounted) return;
        setBasket(b);
        // gather unique product ids missing from cache
        const missingIds = Array.from(new Set(b.map((it) => it.productId))).filter(
          (id) => !productsById[id]
        );
        // fetch missing products in parallel
        const fetched: Record<number, Product> = {};
        await Promise.all(
          missingIds.map(async (id) => {
            const p = await api.getProduct(id);
            fetched[id] = p;
          })
        );
        if (!mounted) return;
        setProductsById((prev) => ({ ...prev, ...fetched }));
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
        else setError(String(err));
        setBasket(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [api, userId]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const b = await api.listBasket(userId);
      setBasket(b);
      const missing = Array.from(new Set(b.map((it) => it.productId))).filter(
        (id) => !productsById[id]
      );
      const fetched: Record<number, Product> = {};
      await Promise.all(
        missing.map(async (id) => {
          const p = await api.getProduct(id);
          fetched[id] = p;
        })
      );
      setProductsById((prev) => ({ ...prev, ...fetched }));
    } catch (err: unknown) {
      if (err instanceof ApiError) setError(`${err.message} (status ${err.status})`);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading basket…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!basket) return <div>No basket.</div>;

  const rows = basket.map((it) => {
    const product = productsById[it.productId];
    return {
      id: it.productId,
      name: product?.name ?? `#${it.productId}`,
      description: product?.description ?? "-",
      priceCents: product?.priceCents ?? null,
      inStockOrQuantity: it.quantity,
    };
  });

  return (
    <div>
      <h3>Basket</h3>
      {basket.length === 0 ? (
        <div>Basket is empty.</div>
      ) : (
        <ItemTable rows={rows} isForBasket />
      )}
      <div>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    </div>
  );
}
