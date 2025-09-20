import axios from "axios";
import * as CryptoJS from "crypto-js";
import { Product, User, Order } from "@/types";

// API configuration
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "";
const PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL || "";
const API_URL = `${PROJECT_URL}wp-json/wc/v3`;
const WP_USER_API_URL = `${PROJECT_URL}wp-json/wp/v2/users`;

// Debug environment variables
console.log('Environment variables:', {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  PROJECT_URL,
  API_URL
});

// Interface for OAuth parameters with index signature
interface OAuthParams {
  [key: string]: string | number | undefined;
  oauth_consumer_key?: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: number;
  oauth_version: string;
  oauth_signature?: string;
  customer?: string | number;
}

// Generate OAuth signature
const generateOAuthSignature = (url: string, method = 'GET', params: Partial<OAuthParams> = {}): OAuthParams => {
  console.log('Generating OAuth signature for URL:', url);
  const nonce = Math.random().toString(36).substring(2);
  const timestamp = Math.floor(Date.now() / 1000);

  const oauthParams: OAuthParams = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: params.oauth_nonce ?? nonce,
    oauth_signature_method: params.oauth_signature_method ?? 'HMAC-SHA1',
    oauth_timestamp: params.oauth_timestamp ?? timestamp,
    oauth_version: params.oauth_version ?? '1.0',
    ...params,
  };

  const allParams: OAuthParams = { ...oauthParams, ...params };

  const paramString = Object.keys(allParams)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key] ?? "")}`)
    .join('&');

  const baseUrl = url.split('?')[0];
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(CONSUMER_SECRET)}&`;

  const signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(CryptoJS.enc.Base64);

  const finalParams = { ...oauthParams, oauth_signature: encodeURIComponent(signature) };
  console.log('OAuth params:', finalParams);
  return finalParams;
};

// Axios instance for WooCommerce API
const api = axios.create({
  baseURL: API_URL,
});

// Get products with pagination (POPRAWIONE: parametry query włączone do sygnatury)
export const getProducts = async (page: number = 1, perPage: number = 20): Promise<{
  products: Product[];
  total: number;
  totalPages: number;
} | null> => {
  try {
    // Definiuj parametry query jako obiekt (włączane do sygnatury)
    const queryParams: Partial<OAuthParams> = {
      per_page: perPage.toString(),
      page: page.toString(),
      orderby: 'id',
      order: 'asc'
    };

    const url = `${API_URL}/products`; // Bez query w URL - dodane poniżej
    console.log('Fetching products from URL:', url, 'with params:', queryParams);

    // Generuj sygnaturę z query params
    const oauthParams = generateOAuthSignature(url, 'GET', queryParams);

    const response = await api.get<Product[]>("/products", { 
      params: { 
        ...oauthParams, 
        ...queryParams  // Dodaj query params do requestu
      } 
    });
    
    // Pobierz totals z headers (standard WP REST API)
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
    
    console.log('Products response:', { products: response.data, total, totalPages });
    return {
      products: response.data,
      total,
      totalPages
    };
  } catch (error: any) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw error;
  }
};

// Get all products (legacy, without pagination)
export const getAllProducts = async (): Promise<Product[] | null> => {
  try {
    console.log('Fetching products from URL:', `${API_URL}/products`);
    const url = `${API_URL}/products`;
    const oauthParams = generateOAuthSignature(url);
    const response = await api.get<Product[]>("/products", { params: oauthParams });
    console.log('Products response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error.response?.data || error.message);
    throw error;
  }
};

// Get single product by ID
export const getSingleProductData = async (productID: number): Promise<Product | null> => {
  try {
    const url = `${API_URL}/products/${productID}`;
    const oauthParams = generateOAuthSignature(url);
    const response = await api.get<Product>(`/products/${productID}`, {
      params: oauthParams,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching single product:', error.response?.data || error.message);
    throw error;
  }
};

// Register a new user
export const registerStoreUser = async (userInfo: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<User | null> => {
  try {
    const response = await axios.post<User>(
      WP_USER_API_URL,
      userInfo,
      {
        headers: {
          Authorization: "Basic " + btoa("admin:admin"),
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error registering user:', error.response?.data || error.message);
    throw error;
  }
};

// Login user
export const loginUser = async (userInfo: {
  username: string;
  password: string;
}): Promise<User & { token: string; user_email: string; user_nicename: string } | null> => {
  try {
    const response = await axios.post<
      User & { token: string; user_email: string; user_nicename: string }
    >(`${PROJECT_URL}wp-json/jwt-auth/v1/token`, userInfo);
    return response.data;
  } catch (error: any) {
    console.error('Error logging in user:', error.response?.data || error.message);
    throw error;
  }
};

// Get logged-in user data
export const getLoggedInUserData = async (token: string): Promise<User | null> => {
  try {
    const response = await axios.get<User>(`${WP_USER_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching logged-in user data:', error.response?.data || error.message);
    throw error;
  }
};

// Create an order
export const createAnOrder = async (orderInfo: {
  customer_id: string;
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
}): Promise<any> => {
  try {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]") as Product[];
    if (!cartItems.length) {
      console.error("Cart is empty");
      return false;
    }

    const lineItems = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const data = {
      ...orderInfo,
      line_items: lineItems,
    };

    const url = `${API_URL}/orders`;
    const oauthParams = generateOAuthSignature(url, "POST");
    const oauthHeader = Object.keys(oauthParams)
      .map((key) => `${key}="${encodeURIComponent(oauthParams[key] ?? "")}"`)
      .join(", ");

    const response = await api.post("/orders", data, {
      headers: {
        Authorization: `OAuth ${oauthHeader}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userid: number): Promise<Order[] | null> => {
  try {
    const url = `${API_URL}/orders`;
    const oauthParams = generateOAuthSignature(url, "GET", { customer: userid });
    const response = await api.get<Order[]>("/orders", {
      params: { ...oauthParams, customer: userid },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching orders by user ID:', error.response?.data || error.message);
    throw error;
  }
};

// Get single order data
export const getSingleOrderData = async (orderId: number): Promise<Order | null> => {
  try {
    const url = `${API_URL}/orders/${orderId}`;
    const oauthParams = generateOAuthSignature(url);
    const response = await api.get<Order>(`/orders/${orderId}`, {
      params: oauthParams,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching single order data:', error.response?.data || error.message);
    throw error;
  }
};

// Delete order by ID
export const deleteOrderById = async (orderId: number): Promise<void> => {
  try {
    const url = `${API_URL}/orders/${orderId}`;
    const oauthParams = generateOAuthSignature(url, "DELETE");
    const oauthHeader = Object.keys(oauthParams)
      .map((key) => `${key}="${encodeURIComponent(oauthParams[key] ?? "")}"`)
      .join(", ");

    await api.delete(`/orders/${orderId}`, {
      headers: {
        Authorization: `OAuth ${oauthHeader}`,
      },
    });
  } catch (error: any) {
    console.error('Error deleting order:', error.response?.data || error.message);
    throw error;
  }
};