import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { Link } from 'expo-router';
import ProductCard from '../../../components/ProductCard';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  averageRating: number;
  images: string[];
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
});

const API_URL = 'http://localhost:5000/api/products/get-all-products';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load products: ${response.status}`);
        }

        const data = await response.json();
        
        // The API returns the products array directly
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of products');
        }

        // Clean image URLs if needed (your images look fine already)
        const cleanedProducts = data.map((product: Product) => ({
          ...product,
          images: product.images || [] // Ensure images is always an array
        }));

        setProducts(cleanedProducts);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
        setError(errorMessage);
        console.error('Fetch Error:', error);
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
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centered}>
          <Text>No products available</Text>
        </View>
        <Footer />
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
      <Footer />
    </SafeAreaView>
  );
}