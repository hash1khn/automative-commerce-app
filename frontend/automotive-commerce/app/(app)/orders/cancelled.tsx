// app/(main)/orders/cancelled.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrderCard from '../../../components/OrderCard';

export default function CancelledOrders() {
  const orders = [
    { id: '7', status: 'cancelled', items: ['Radiator Coolant'], date: '2024-03-05', reason: 'Out of stock' },
    { id: '8', status: 'cancelled', items: ['Timing Belt'], date: '2024-03-08', reason: 'Customer request' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});