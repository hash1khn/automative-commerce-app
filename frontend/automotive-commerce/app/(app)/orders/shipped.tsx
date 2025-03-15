// app/(main)/orders/shipped.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrderCard from '../../../components/OrderCard';

export default function ShippedOrders() {
  const orders = [
    { id: '3', status: 'shipped', items: ['Engine Oil 5W-30'], date: '2024-03-17', tracking: 'UPS-123456' },
    { id: '4', status: 'shipped', items: ['Air Filter'], date: '2024-03-18', tracking: 'FEDEX-789012' },
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