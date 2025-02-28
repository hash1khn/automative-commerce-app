// app/(tabs)/home.tsx
import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { Link } from 'expo-router';
import ProductCard from '../../components/ProductCard';
import Header from '../../components/Header';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

const API_URL = 'http://localhost:5000/api/products/get-all-products';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product[]>(API_URL, {
          headers: {
            'Cache-Control': 'no-cache', // Disable caching
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        const cleanedProducts = response.data.map((product) => ({
          ...product,
          images: product.images?.map((image) => image.replace(/"|<.*?>/g, '')).filter(Boolean) || [],
        }));
        setProducts(cleanedProducts);
      } catch (error) {
        setError('Failed to load products');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}>
          <Text>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            <Link href={`/product/${item._id}`} asChild>
              <ProductCard product={item} />
            </Link>
          </View>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        numColumns={1}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  productWrapper: {
    marginBottom: 5,
  },
});