import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

export type Row = {
  id: number;
  name: string;
  description: string;
  priceCents: number | null;
  inStockOrQuantity: number;
  basketQty?: number;
};

type Props = {
  rows: Row[];
  isForBasket?: boolean;

  onDelete?: (id: number) => void | Promise<void>;
  onEdit?: (id: number) => void;
  onAddToBasket?: (id: number, quantity?: number) => void | Promise<void>;

  isAddToBasketDisabled?: boolean;
};

export default function ItemTable({
  rows,
  isForBasket = false,
  onDelete,
  onEdit,
  onAddToBasket,
  isAddToBasketDisabled,
}: Props) {
  if (rows.length === 0) {
    return <Typography color="text.secondary">No items.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={80}>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">
              {isForBasket ? "Quantity" : "Stock"}
            </TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow hover key={row.id}>
              <TableCell>{row.id}</TableCell>

              <TableCell>{row.name}</TableCell>

              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {row.description}
                </Typography>
              </TableCell>

              <TableCell align="right">
                {row.priceCents == null
                  ? "-"
                  : `$${(row.priceCents / 100).toFixed(2)}`}
              </TableCell>

              <TableCell align="center">
                <Chip
                  size="small"
                  label={row.inStockOrQuantity}
                  color={
                    isForBasket
                      ? "primary"
                      : row.inStockOrQuantity > 0
                        ? "success"
                        : "error"
                  }
                />
              </TableCell>

              <TableCell align="right">
                {!isForBasket && onAddToBasket && (
                  <>
                    <Tooltip
                      title={
                        isAddToBasketDisabled
                          ? "Select a user first"
                          : "Add to basket"
                      }
                    >
                      <span>
                        <IconButton
                          color="primary"
                          disabled={isAddToBasketDisabled}
                          onClick={() => onAddToBasket(row.id)}
                        >
                          <AddShoppingCartIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    {row.basketQty != null && row.basketQty > 0 && (
                      <Chip
                        size="small"
                        label={`In basket: ${row.basketQty}`}
                        color="warning"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </>
                )}

                {!isForBasket && onEdit && (
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => onEdit(row.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {onDelete && (
                  <Tooltip title={isForBasket ? "Remove" : "Delete"}>
                    <IconButton color="error" onClick={() => onDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
