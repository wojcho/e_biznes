import ItemTable from "./ItemTable";
import { useShop } from "./ShopContext";

export default function Basket() {
  const { basket, productsById, loading, error, refreshBasket } = useShop();

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
      <button onClick={refreshBasket}>Refresh</button>
    </div>
  );
}
