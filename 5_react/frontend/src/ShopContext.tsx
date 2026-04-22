import { createContext, useContext, type ReactNode } from "react";
import { useShopData } from "./useShopData";
import type { ApiClient } from "./apiClient";

const ShopContext = createContext<ReturnType<typeof useShopData> | null>(null);

export function ShopProvider({ api, children }: { api: ApiClient; children: ReactNode }) {
  const shopData = useShopData(api);
  return <ShopContext.Provider value={shopData}>{children}</ShopContext.Provider>;
}

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
};
