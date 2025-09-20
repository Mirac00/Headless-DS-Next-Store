'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product, User } from '@/types';

interface MyStoreContextType {
  cart: Product[];
  addProductsToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
  loggedInUserData: User | null;
  setLoggedInUserData: (user: User | null) => void;
  pageLoading: boolean; // Added pageLoading
  setPageLoading: (status: boolean) => void;
  renderProductPrice: (product: Product) => JSX.Element;
  loader: boolean;
  setLoader: (status: boolean) => void;
  setUserLogout: () => void;
}

const MyStoreContext = createContext<MyStoreContextType | undefined>(undefined);

export const myStoreHook = () => {
  const context = useContext(MyStoreContext);
  if (!context) {
    throw new Error('myStoreHook must be used within MyStoreProvider');
  }
  return context;
};

export const MyStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]') as Product[];
    setCart(storedCart);
    const storedUser = JSON.parse(localStorage.getItem('user_data') || 'null') as User | null;
    setLoggedInUserData(storedUser);
    setIsAuthenticated(!!storedUser);
  }, []);

  const addProductsToCart = (product: Product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (product: Product) => {
    const updatedCart = cart.filter((item) => item.id !== product.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  const setUserLogout = () => {
    setLoggedInUserData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_token');
  };

  const renderProductPrice = (product: Product) => {
    if (product.sale_price) {
      return (
        <>
          <span className="text-muted text-decoration-line-through">
            ${product.regular_price}
          </span>
          <span className="text-danger"> ${product.sale_price}</span>
        </>
      );
    }
    return <>${product.regular_price || product.price || '0'}</>;
  };

  return (
    <MyStoreContext.Provider
      value={{
        cart,
        addProductsToCart,
        removeFromCart,
        clearCart,
        isAuthenticated,
        setIsAuthenticated,
        loggedInUserData,
        setLoggedInUserData,
        pageLoading,
        setPageLoading,
        renderProductPrice,
        loader,
        setLoader,
        setUserLogout,
      }}
    >
      {children}
    </MyStoreContext.Provider>
  );
};