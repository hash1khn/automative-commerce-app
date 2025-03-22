import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../context/AuthContext'; // Import your auth context
import ProcessingOrders from './processing';
import ShippedOrders from './shipped';
import DeliveredOrders from './delivered';
import CancelledOrders from './cancelled';

// Define TypeScript types (same as before)
type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  images: string[];
  averageRating: number;
  reviews: any[];
};

type OrderItem = {
  product: Product;
  quantity: number;
  price: number;
  _id: string;
};

type PaymentDetails = {
  method: string;
  cardType: string;
  last4: string;
  cardHolderName: string;
};

type Order = {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  discount: number;
  taxAmount: number;
  shippingCharge: number;
  shippingAddress: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: string;
  transactionId: string;
  paymentMethod: string;
  paymentTimestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentDetails: PaymentDetails;
};

type OrdersResponse = {
  orders: Order[];
  statusCounts: {
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
};

type ErrorResponse = {
  message: string; // Define the structure of the error response
};

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState<'processing' | 'shipped' | 'delivered' | 'cancelled'>('processing');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = useAuth(); // Get the auth token

  console.log('OrderTabs rendered. Active tab:', activeTab);
  console.log('Auth token:', authToken?.token ? 'Exists' : 'Missing');

  // Fetch user orders with fetch API
  const fetchUserOrders = async () => {
    console.log('Fetching user orders...');
    try {
      const response = await fetch('http://localhost:5000/api/orders/get-user-orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: OrdersResponse = await response.json();
      console.log('API Response:', data);
      setOrders(data.orders); // Set the orders state
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to load orders. Please try again.'); // Set error message
      } else {
        setError('Failed to load orders. Please try again.'); // Fallback for unknown error types
      }
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  // Fetch orders when the component mounts or when authToken changes
  useEffect(() => {
    if (authToken?.token) {
      fetchUserOrders();
    }
  }, [authToken?.token]);

  console.log('Orders state:', { isLoading, error, orders: orders?.length });

  // Filter orders with type safety
  const filteredOrders = orders
    ? orders.filter((order) => order.status === activeTab)
    : [];

  console.log('Filtered orders for', activeTab, ':', filteredOrders);

  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  if (isLoading) {
    console.log('Loading state: Showing ActivityIndicator');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    console.error('Error state:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'processing' && styles.activeTab]}
          onPress={() => {
            console.log('Pressed: To Ship');
            setActiveTab('processing');
          }}
        >
          <Text style={styles.tabText}>To Ship</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'shipped' && styles.activeTab]}
          onPress={() => {
            console.log('Pressed: To Receive');
            setActiveTab('shipped');
          }}
        >
          <Text style={styles.tabText}>To Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]}
          onPress={() => {
            console.log('Pressed: To Review');
            setActiveTab('delivered');
          }}
        >
          <Text style={styles.tabText}>To Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => {
            console.log('Pressed: Cancellations');
            setActiveTab('cancelled');
          }}
        >
          <Text style={styles.tabText}>Cancellations</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {activeTab === 'processing' && <ProcessingOrders orders={filteredOrders} />}
        {activeTab === 'shipped' && <ShippedOrders orders={filteredOrders} />}
        {activeTab === 'delivered' && <DeliveredOrders orders={filteredOrders} />}
        {activeTab === 'cancelled' && <CancelledOrders orders={filteredOrders} />}
      </ScrollView>
    </View>
  );
};

// Keep the same styles as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.accent,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
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
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
});

export default OrderTabs;