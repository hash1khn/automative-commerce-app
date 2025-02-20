import { createContext, useContext, useState, PropsWithChildren } from 'react';

interface CartContextType {
  cartItems: any[];
  addToCart: (item: any) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addToCart = (item: any) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};