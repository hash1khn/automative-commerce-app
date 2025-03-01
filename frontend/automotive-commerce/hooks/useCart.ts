import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi} from '../utils/cartApis';

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
  totalItems: number;
  totalPrice: number;
}
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzMwMjVkMThlODczZGQxYjgzZmM3OSIsImVtYWlsIjoia3phaXRlY2hAZ21haWwuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzQwODMzNDIyLCJleHAiOjE3NDEwOTI2MjJ9.iy9WNuq82lR5KZ-OJtm9H2vvKPv95HhiVFrW6Gmjmh4';


// Get current cart
export const useCart = () => {
  return useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartApi.getCart({
        headers: { Authorization: AUTH_TOKEN },
      });
      return response.data;
    },
  });
};

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await cartApi.addToCart(productId, quantity);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await cartApi.updateCart(productId, quantity);
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
      const response = await cartApi.removeFromCart(productId);
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
      const response = await cartApi.clearCart();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
