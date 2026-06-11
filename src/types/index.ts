export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status: "AVAILABLE" | "OUT_OF_STOCK";
  category: Category;
}

export interface CartItem {
  id: number;
  foodItem: FoodItem;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
}