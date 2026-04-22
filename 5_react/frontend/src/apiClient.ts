import axios, { type AxiosInstance, type AxiosResponse } from "axios";

export type Product = {
  id: number;
  name: string;
  description?: string;
  priceCents: number;
  inStock: number;
};

export type CreateProductRequest = {
  name: string;
  description?: string | null;
  priceCents: number;
  inStock?: number;
};

export type UpdateProductRequest = {
  name?: string | null;
  description?: string | null;
  priceCents?: number | null;
  inStock?: number | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
};

export type BasketItem = {
  productId: number;
  quantity: number;
};

export type PaymentRequest = {
  userId: number;
  paymentMethod?: string;
};

export type PaymentResponse = {
  success: boolean;
  message: string;
  totalCents?: number;
};

type FetchOptions = {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private client: AxiosInstance;

  constructor(options?: FetchOptions) {
    this.baseUrl = options?.baseUrl?.replace(/\/+$/, "") ?? "";
    this.defaultHeaders = options?.defaultHeaders ?? { "Content-Type": "application/json" };
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: this.defaultHeaders,
    });
  }

  private async request<T>(
    path: string,
    method: string = "GET",
    body?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    try {
      const resp: AxiosResponse<T> = await this.client.request<T>({
        url: path,
        method,
        data: body === undefined ? undefined : body,
        headers: { ...(headers ?? {}) },
        validateStatus: () => true, // handle errors manually to create ApiError with body
      });

      // axios will parse JSON automatically; resp.data may be string or object depending on server
      if (resp.status >= 200 && resp.status < 300) {
        return resp.data as T;
      } else {
        // include parsed body if available
        throw new ApiError(resp.statusText || `HTTP ${resp.status}`, resp.status, resp.data);
      }
    } catch (err: any) {
      // If axios throws (network error, timeout), normalize to ApiError
      if (err instanceof ApiError) throw err;
      if (err.isAxiosError) {
        const status = err.response?.status ?? 0;
        const body = err.response?.data;
        const msg = err.message || `Network error`;
        throw new ApiError(msg, status, body);
      }
      throw err;
    }
  }

  // Products
  listProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products", "GET");
  }

  createProduct(req: CreateProductRequest): Promise<Product> {
    return this.request<Product>("/products", "POST", req);
  }

  getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`, "GET");
  }

  updateProduct(id: number, req: UpdateProductRequest): Promise<Product> {
    return this.request<Product>(`/products/${id}`, "PUT", req);
  }

  deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/products/${id}`, "DELETE");
  }

  // Users
  createUser(req: CreateUserRequest): Promise<User> {
    return this.request<User>("/users", "POST", req);
  }

  listUsers(): Promise<User[]> {
    return this.request<User[]>("/users", "GET");
  }

  getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`, "GET");
  }

  deleteUser(id: number): Promise<void> {
    return this.request<void>(`/users/${id}`, "DELETE");
  }

  // Basket
  listBasket(userId: number): Promise<BasketItem[]> {
    return this.request<BasketItem[]>(`/users/${userId}/basket`, "GET");
  }

  addToBasket(userId: number, item: BasketItem): Promise<BasketItem[]> {
    return this.request<BasketItem[]>(`/users/${userId}/basket`, "POST", item);
  }

  removeFromBasket(userId: number, item: BasketItem): Promise<BasketItem | void> {
    return this.request<BasketItem | void>(`/users/${userId}/basket`, "DELETE", item);
  }

  checkoutBasket(userId: number, req: PaymentRequest): Promise<PaymentResponse> {
    return this.request<PaymentResponse>(`/users/${userId}/basket/checkout`, "POST", req);
  }
}
