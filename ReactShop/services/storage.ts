import { Product, User } from '../types';

const PRODUCTS_KEY = 'rs_products';
const USERS_KEY = 'rs_users';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    description: 'High-fidelity audio with active noise cancellation.',
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 249.50,
    description: 'Track your fitness and stay connected on the go.',
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    name: 'Ergonomic Chair',
    price: 350.00,
    description: 'Comfortable office chair with lumbar support.',
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 120.00,
    description: 'Clicky switches for the ultimate typing experience.',
    imageUrl: 'https://picsum.photos/400/300?random=4'
  }
];

export const StorageService = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(stored);
  },

  saveProduct: (product: Product): void => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  deleteProduct: (id: string): void => {
    const products = StorageService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveUser: (user: User): void => {
    const users = StorageService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Mock order processing
  processOrder: async (userId: string, items: any[], total: number): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Order processed for user ${userId}:`, items, `Total: ${total}`);
        resolve(true);
      }, 1500);
    });
  }
};
