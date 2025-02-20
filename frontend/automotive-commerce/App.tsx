// App.tsx
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      {/* The Router will render based on the file structure */}
    </CartProvider>
  );
}