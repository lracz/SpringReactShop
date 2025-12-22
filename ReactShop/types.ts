export interface Product {
  id: string | number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface User {
  id: string | number; 
  username: string;
  role: 'user' | 'admin';
  token?: string;
}
export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}