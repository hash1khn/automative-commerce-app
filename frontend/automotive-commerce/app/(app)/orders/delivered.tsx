// app/(main)/orders/delivered.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrderCard from '../../../components/OrderCard';

export default function DeliveredOrders() {
  const orders = [
    { id: '5', status: 'delivered', items: ['Spark Plug Wires'], date: '2024-03-10', rating: 4 },
    { id: '6', status: 'delivered', items: ['Fuel Filter'], date: '2024-03-12', rating: 5 },
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