import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

export default function HomePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Welcome</Typography>

      <Typography color="text.secondary">
        Choose a section to manage products or users.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button component={RouterLink} to="/products" variant="contained">
          Products
        </Button>

        <Button component={RouterLink} to="/users" variant="outlined">
          Users
        </Button>
      </Stack>
    </Stack>
  );
}
