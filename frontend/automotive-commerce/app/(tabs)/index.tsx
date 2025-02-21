import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';

const products = [
  {
    id: 1,
    name: 'Advanced Spark Plug',
    price: 19.99,
    stock: 100,
    category: 'Engine',
    image: 'https://via.placeholder.com/150?text=Spark+Plug',
  },
  {
    id: 2,
    name: 'Premium Brake Pads',
    price: 49.99,
    stock: 80,
    category: 'Brakes',
    image: 'https://via.placeholder.com/150?text=Brake+Pads',
  },
  {
    id: 3,
    name: 'Oil Filter',
    price: 14.99,
    stock: 50,
    category: 'Engine',
    image: 'https://via.placeholder.com/150?text=Oil+Filter',
  },
  {
    id: 4,
    name: 'Car Battery',
    price: 99.99,
    stock: 30,
    category: 'Electrical',
    image: 'https://via.placeholder.com/150?text=Car+Battery',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            {/* ✅ Fix: Use asChild to prevent ref issues */}
            <Link href={`../product/${item.id}`} asChild>
              <ProductCard product={item} />
            </Link>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  productWrapper: {
    marginBottom: 15,
  },
});
