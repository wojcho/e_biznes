import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link as RouterLink, Route, Routes } from "react-router";

import type { ApiClient } from "./apiClient";
import { ShopProvider } from "./ShopContext";
import HomePage from "./HomePage";
import ProductsPage from "./ProductsPage";
import UserPage from "./UserPage";
import UsersIndex from "./UsersIndex";

export default function App({ api }: { api: ApiClient }) {
  return (
    <ShopProvider api={api}>
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
    </ShopProvider>
  );
}
