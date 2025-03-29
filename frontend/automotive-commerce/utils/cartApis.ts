// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const cartApi = {
  addToCart: (productId: string, quantity: number, config = {}) =>
    api.post('/cart/add-to-cart', { productId, quantity }, config),

  updateCart: (productId: string, quantity: number, config = {}) =>
    api.put('/cart/update-cart', { productId, quantity }, config),

  getCart: (config = {}) => api.get('/cart/get-cart', config),

  removeFromCart: (productId: string, config = {}) =>
    api.delete(`/cart/remove-from-cart/${productId}`, config),

  clearCart: (config = {}) => api.delete('/cart/clear', config),
};
