import { Stack, Typography } from "@mui/material";
import Products from "./Products";

export default function ProductsPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Products</Typography>

      <Products />
    </Stack>
  );
}
