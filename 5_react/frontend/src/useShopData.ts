import { useState, useCallback, useEffect } from "react";
import { ApiClient, type User, type Product, type BasketItem } from "./apiClient";

export function useShopData(api: ApiClient) {
  // Shared state
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [basket, setBasket] = useState<BasketItem[] | null>(null);
  const [productsById, setProductsById] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all users once
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Load all products once
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listProducts();
      setProducts(data);
      // Build lookup table
      const byId = data.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<number, Product>);
      setProductsById(byId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Load basket for current user
  const loadBasket = useCallback(async (userId: number) => {
    if (!userId) {
      setBasket(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const basketData = await api.listBasket(userId);
      setBasket(basketData);

      // Load any missing products
      const missingIds = Array.from(new Set(basketData.map((it) => it.productId)))
        .filter((id) => !productsById[id]);

      if (missingIds.length > 0) {
        const fetched: Record<number, Product> = {};
        await Promise.all(
          missingIds.map(async (id) => {
            const product = await api.getProduct(id);
            fetched[id] = product;
          })
        );
        setProductsById((prev) => ({ ...prev, ...fetched }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setBasket(null);
    } finally {
      setLoading(false);
    }
  }, [api, productsById]);

  // Checkout
  const checkout = useCallback(async (paymentMethod?: string) => {
    if (!selectedUserId) return null;
    try {
      setError(null);
      const result = await api.checkoutBasket(selectedUserId, { userId: selectedUserId, paymentMethod });
      // Refresh basket after checkout
      await loadBasket(selectedUserId);
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      return null;
    }
  }, [api, selectedUserId, loadBasket]);

  // Refresh current basket
  const refreshBasket = useCallback(async () => {
    if (selectedUserId) {
      await loadBasket(selectedUserId);
    }
  }, [selectedUserId, loadBasket]);

  // Effects
  useEffect(() => {
    loadUsers();
    loadProducts();
  }, [loadUsers, loadProducts]);

  useEffect(() => {
    if (selectedUserId) {
      loadBasket(selectedUserId);
    } else {
      setBasket(null);
    }
  }, [selectedUserId, loadBasket]);

  return {
    // State
    selectedUserId,
    setSelectedUserId,
    users,
    products,
    basket,
    productsById,
    loading,
    error,

    // Actions
    loadUsers,
    loadProducts,
    loadBasket,
    checkout,
    refreshBasket,
  };
}
