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
  const { selectedUserId, users, setSelectedUserId } = useShop();

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

          {/* Selected-user-dependent UI */}
          {selectedUserId ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to={`/users/${selectedUserId}`}
              >
                Basket
              </Button>

              <Button color="inherit" onClick={() => setSelectedUserId(null)}>
                <Chip
                  label={selectedUser?.name ?? "User"}
                  size="small"
                  color="secondary"
                  sx={{ mr: 1 }}
                />
                Log out
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/users">
              Log in
            </Button>
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
