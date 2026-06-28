import {
  AppBar,
  Button,
  Chip,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, Route, Routes } from "react-router";

import type { ApiClient } from "./apiClient";
import { useShop, ShopProvider } from "./ShopContext";
import HomePage from "./HomePage";
import ProductsPage from "./ProductsPage";
import UserPage from "./UserPage";
import UsersIndex from "./UsersIndex";

function AppShell() {
  const { selectedUserId, users } = useShop();

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;

  return (
    <>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Shop
          </Typography>

          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>

          <Button color="inherit" component={RouterLink} to="/products">
            Products
          </Button>

          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>

          {selectedUser ? (
            <Chip label={selectedUser.name} size="small" color="info" />
          ) : (
            <Chip label="No user selected" size="small" color="warning" />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/users" element={<UsersIndex />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default function App({ api }: { api: ApiClient }) {
  return (
    <ShopProvider api={api}>
      <AppShell />
    </ShopProvider>
  );
}
