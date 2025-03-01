// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const cartApi = {
  addToCart: (productId: string, quantity: number) =>
    api.post('/cart/add-to-cart', { productId, quantity }),
  updateCart: (productId: string, quantity: number) =>
    api.put('/cart/update-cart', { productId, quantity }),
  getCart: () => api.get('/cart/get-cart'),
  removeFromCart: (productId: string) =>
    api.delete(`/cart/remove-from-cart/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};