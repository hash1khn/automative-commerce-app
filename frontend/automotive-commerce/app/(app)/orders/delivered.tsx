// app/(main)/orders/delivered.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrderCard from '../../../components/OrderCard';

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

type DeliveredOrdersProps = {
  orders?: Order[];
};

export default function DeliveredOrders({ orders = [] }: DeliveredOrdersProps) {
  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders have been delivered yet.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <OrderCard order={item} />}
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