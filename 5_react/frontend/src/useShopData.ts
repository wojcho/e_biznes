import { useState, useCallback, useEffect } from "react";
import {
  ApiClient,
  type User,
  type Product,
  type BasketItem,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "./apiClient";

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
      const byId = data.reduce(
        (acc, p) => {
          acc[p.id] = p;
          return acc;
        },
        {} as Record<number, Product>,
      );
      setProductsById(byId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Load basket for current user
  const loadBasket = useCallback(
    async (userId: number) => {
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
        const missingIds = Array.from(
          new Set(basketData.map((it) => it.productId)),
        ).filter((id) => !productsById[id]);

        if (missingIds.length > 0) {
          const fetched: Record<number, Product> = {};
          await Promise.all(
            missingIds.map(async (id) => {
              const product = await api.getProduct(id);
              fetched[id] = product;
            }),
          );
          setProductsById((prev) => ({ ...prev, ...fetched }));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        setBasket(null);
      } finally {
        setLoading(false);
      }
    },
    [api, productsById],
  );

  // Checkout
  const checkout = useCallback(
    async (paymentMethod?: string) => {
      if (!selectedUserId) return null;
      try {
        setError(null);
        const result = await api.checkoutBasket(selectedUserId, {
          userId: selectedUserId,
          paymentMethod,
        });
        // Refresh basket after checkout
        await loadBasket(selectedUserId);
        return result;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    },
    [api, selectedUserId, loadBasket],
  );

  // Refresh current basket
  const refreshBasket = useCallback(async () => {
    if (selectedUserId) {
      await loadBasket(selectedUserId);
    }
  }, [selectedUserId, loadBasket]);

  const createProduct = useCallback(
    async (req: CreateProductRequest) => {
      try {
        setError(null);

        const created = await api.createProduct(req);

        setProducts((prev) => [...prev, created]);
        setProductsById((prev) => ({
          ...prev,
          [created.id]: created,
        }));

        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    },
    [api],
  );

  const updateProduct = useCallback(
    async (id: number, req: UpdateProductRequest) => {
      try {
        setError(null);

        const updated = await api.updateProduct(id, req);

        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));

        setProductsById((prev) => ({
          ...prev,
          [id]: updated,
        }));

        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    },
    [api],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        setError(null);

        await api.deleteProduct(id);

        setProducts((prev) => prev.filter((p) => p.id !== id));

        setProductsById((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [api],
  );

  const addToBasket = useCallback(
    async (productId: number, quantity = 1) => {
      if (!selectedUserId) return;

      try {
        setError(null);

        const updated = await api.addToBasket(selectedUserId, {
          productId,
          quantity,
        });

        setBasket(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [api, selectedUserId],
  );

  const removeFromBasket = useCallback(
    async (productId: number, quantity = 1) => {
      if (!selectedUserId) return;

      try {
        setError(null);

        await api.removeFromBasket(selectedUserId, {
          productId,
          quantity,
        });

        await loadBasket(selectedUserId);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [api, selectedUserId, loadBasket],
  );

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
    refreshBasket,

    createProduct,
    updateProduct,
    deleteProduct,

    addToBasket,
    removeFromBasket,

    checkout,
  };
}
