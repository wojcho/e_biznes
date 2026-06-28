export type Row = {
  id: number;
  name: string;
  description: string;
  priceCents: number | null;
  inStockOrQuantity: number;
};

type Props = {
  rows: Row[];
  isForBasket?: boolean;

  onDelete?: (id: number) => void | Promise<void>;

  onEdit?: (id: number) => void;

  onAddToBasket?: (id: number, quantity?: number) => void | Promise<void>;
};

export default function ItemTable({
  rows,
  isForBasket = false,
  onDelete,
  onEdit,
  onAddToBasket,
}: Props) {
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
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.name}</td>
            <td>{r.description ?? "-"}</td>
            <td>
              {r.priceCents != null
                ? `$${(r.priceCents / 100).toFixed(2)}`
                : "-"}
            </td>
            <td>{r.inStockOrQuantity}</td>
            <td>
              {!isForBasket && onAddToBasket && (
                <button onClick={() => onAddToBasket(r.id)}>
                  Add to Basket
                </button>
              )}

              {!isForBasket && onEdit && (
                <button onClick={() => onEdit(r.id)}>Edit</button>
              )}

              {onDelete && (
                <button onClick={() => onDelete(r.id)}>Delete</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
