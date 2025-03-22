import { View, Text, StyleSheet } from 'react-native';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

// Define the type for the order prop (if using TypeScript)
type Order = {
  _id: string; // Use _id instead of id if your API returns _id
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string; // Use createdAt instead of date if your API returns createdAt
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
};

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  const statusLabels = {
    processing: 'To Ship',
    shipped: 'To Receive',
    delivered: 'To Review',
    cancelled: 'Cancelled',
  };

  // Format the date (if needed)
  const formattedDate = new Date(order.createdAt).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order._id.slice(-6)}</Text> {/* Use a short ID for display */}
        <Text style={styles.status}>{statusLabels[order.status]}</Text>
      </View>
      <Text style={styles.date}>Order Date: {formattedDate}</Text>
      <View style={styles.itemsContainer}>
        {order.items.map((item) => (
          <Text key={item.product.name} style={styles.item}>
            • {item.product.name} (x{item.quantity})
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  status: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 8,
  },
  itemsContainer: {
    marginLeft: 8,
  },
  item: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
});