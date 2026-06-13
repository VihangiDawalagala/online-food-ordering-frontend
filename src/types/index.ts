export interface AuthResponse {
  id: number;
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

export interface CreateFoodRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status: "AVAILABLE" | "OUT_OF_STOCK";
  category: {
    id: number;
  };
}

export interface CartItem {
  id: number;
  foodItem: FoodItem;
  quantity: number;
}

export interface Cart {
  id: number;
  cartItems: CartItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  foodItem: FoodItem;
}

export interface Payment {
  id: number;
  amount: number;
  status: string;
}

export interface Order {
  id: number;
  orderDate: string;
  status: string;
  orderItems: OrderItem[];
  payment?: Payment;
}