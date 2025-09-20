// Product type for WooCommerce products
export interface Product {
  id: number;
  name: string;
  description: string;
  regular_price: string;
  sale_price?: string;
  price?: string;
  images: { src: string }[];
  categories: { name: string }[];
  quantity: number;
}

// User type for authenticated user
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Order type for WooCommerce orders
export interface Order {
  id: number;
  date_created: string;
  status: string;
  total: string;
  currency_symbol: string;
  line_items: { id: number; name: string; quantity: number }[];
}