type Row = {
  id: number;
  name: string;
  description: string;
  priceCents: number | null;
  inStockOrQuantity: number;
};

export default function ItemTable({
  rows,
  isForBasket = false,
}: {
  rows: Row[];
  isForBasket?: boolean;
}) {
  if (!rows || rows.length === 0) return <div>No items.</div>;
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>{isForBasket ? "Quantity" : "In stock"}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.name}</td>
            <td>{r.description ?? "-"}</td>
            <td>{r.priceCents != null ? `$${(r.priceCents / 100).toFixed(2)}` : "-"}</td>
            <td>{r.inStockOrQuantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
