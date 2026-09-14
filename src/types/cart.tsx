import type { User } from "./user";
export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  products: CartProduct[];
}
export interface EnrichedCart extends Cart {
  user: User | undefined;
}
