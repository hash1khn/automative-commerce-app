import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number; 
}

// Fetch cart
export const useCart = () => {
  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/cart/get-cart'); // Token auto-attached
      return response.data;
    },
  });
};

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await api.post('/cart/add-to-cart', { productId, quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Update cart item quantity
export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await api.put('/cart/update-cart', { productId, quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete('/cart/remove-from-cart', {
        data: { productId }, // Send productId in the request body
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};


// Clear entire cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete('/cart/clear-cart');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
