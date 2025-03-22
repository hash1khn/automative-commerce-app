import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import OrderCard from '../../../components/OrderCard';
import { useAuth } from '../../../context/AuthContext'; // Import your auth context

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

type ProcessingOrdersProps = {
  orders: Order[]; // Properly typed orders prop
  onOrderCancelled: (orderId: string) => void; // Callback to update the parent state
};

export default function ProcessingOrders({ orders = [], onOrderCancelled }: ProcessingOrdersProps) {
  const { token } = useAuth(); // Get the auth token

  const handleCancelOrder = async (orderId: string) => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:5000/api/orders/${orderId}/update-order-status`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'cancelled' }),
              });

              if (!response.ok) {
                throw new Error('Failed to cancel order');
              }

              Alert.alert('Success', 'Your order has been cancelled.');
              onOrderCancelled(orderId); // Notify the parent component to update the state
            } catch (error) {
              console.error('Error cancelling order:', error);
              Alert.alert('Error', 'Failed to cancel the order. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders are currently being processed.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onCancelOrder={handleCancelOrder}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#766153',
    textAlign: 'center',
    marginTop: 20,
  },
});