// app/(tabs)/home.tsx
import { View, FlatList  } from 'react-native';
import { Link } from 'expo-router';
import ProductCard from '../../components/ProductCard';

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
  // Add more products here
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, paddingHorizontal: 15 }}>
      {/* <ProductHeader /> Add a header component for filters/search */}
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <Link href={`../product/${item.id}`}>
            <ProductCard
              product={item}
              onPress={() => console.log('Product Card Pressed')}
            />
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Grid layout (optional)
      />
    </View>
  );
}