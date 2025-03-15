// components/OrderCard.tsx
import { View, Text, StyleSheet } from 'react-native';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function OrderCard({ order }) {
  const statusLabels = {
    processing: 'To Ship',
    shipped: 'To Receive',
    delivered: 'To Review',
    cancelled: 'Cancelled',
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id}</Text>
        <Text style={styles.status}>{statusLabels[order.status]}</Text>
      </View>
      <Text style={styles.date}>Order Date: {order.date}</Text>
      <View style={styles.itemsContainer}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.item}>• {item}</Text>
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