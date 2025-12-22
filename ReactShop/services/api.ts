import { Product, User, CartItem } from '../types';

// Default to localhost:5000
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface OrderPayload {
  userId: string;
  items: CartItem[];
  total: number;
  shipping: {
    fullName: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
}

// Helper to handle headers and auth
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const storedUser = localStorage.getItem('rs_current_user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
  }
  return headers;
};

export const ApiService = {
  /**
   * Fetch all products
   * GET /api/products
   */
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  /**
   * Create or update a product
   * POST /api/products or PUT /api/products/:id
   */
  async saveProduct(product: Product): Promise<void> {
    const method = product.id ? 'PUT' : 'POST';
    const url = product.id
      ? `${API_URL}/products/${product.id}`
      : `${API_URL}/products`;

    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(product),
    });

    if (!res.ok) throw new Error('Failed to save product');
  },

  /**
   * Delete a product
   * DELETE /api/products/:id
   */
  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error('Failed to delete product');
  },

  /**
   * Authenticate user
   * POST /api/auth/login
   */
  async login(username: string, password: string): Promise<User | null> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      // Handle 401 Unauthorized specifically if needed
      return null;
    }

    const data = await res.json();
    return data;
  },

  /**
   * Register new user
   * POST /api/auth/register
   */
  async register(username: string, password: string): Promise<User> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Registration failed');

    const user = await res.json();
    return user.user ? user.user : user;
  },

  /**
   * Submit an order
   * POST /api/orders
   */
  async createOrder(order: OrderPayload): Promise<{ success: boolean; orderId: string }> {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error('Failed to create order');

    const data = await res.json();
    return { success: true, orderId: data.orderId };
  }
};