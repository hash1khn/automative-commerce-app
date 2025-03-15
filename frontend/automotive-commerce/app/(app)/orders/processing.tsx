// app/(main)/orders/processing.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import OrderCard from '../../../components/OrderCard';

export default function ProcessingOrders() {
  const orders = [
    { id: '1', status: 'processing', items: ['Spark Plug Kit'], date: '2024-03-15' },
    { id: '2', status: 'processing', items: ['Brake Pads Set'], date: '2024-03-16' },
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