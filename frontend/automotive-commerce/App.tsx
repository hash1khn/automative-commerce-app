// App.tsx
import { CartProvider } from './context/CartContext';
import RootProvider from './app/_layout';

export default function App() {
  return (
    <CartProvider>
      <RootProvider/>
    </CartProvider>
  );
}