import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'expo-router';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  averageRating: number;
};

type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
  to_review: boolean;
};

type Order = {
  _id: string;
  items: OrderItem[];
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
};

export default function DeliveredOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://automative-commerce-app-production.up.railway.app/api/orders/get-user-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      console.log(data);
      // Filter only delivered orders
      const deliveredOrders = data.orders.filter((order: Order) => order.status === 'delivered');
      setOrders(deliveredOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = (productId: string, orderId: string, productName: string) => {
    router.push({
      pathname: '/add-review',
      params: { 
        productId,
        orderId,
        productName
      }
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchOrders} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No delivered orders found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {orders.map((order) => (
        <View key={order._id} style={styles.orderContainer}>
          <Text style={styles.orderDate}>
            Delivered on: {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.shippingAddress}>
            Shipping Address: {order.shippingAddress}
          </Text>
          
          {order.items.map((item) => (
            <View key={item._id} style={styles.itemContainer}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.productDescription}>{item.product.description}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Price: ${item.price.toFixed(2)}</Text>
              
              {!item.to_review && (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => handleAddReview(
                    item.product._id,
                    order._id,
                    item.product.name
                  )}
                >
                  <Text style={styles.reviewButtonText}>Add Review</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  orderContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  orderDate: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 8,
  },
  shippingAddress: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    opacity: 0.8,
  },
  reviewButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});