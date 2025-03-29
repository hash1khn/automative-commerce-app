import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { Link } from 'expo-router';
import ProductCard from '../../../components/ProductCard';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  averageRating: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  stock: number;  
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
          images: product.images
            ?.map((image) => image.replace(/"|<.*?>/g, ''))
            .filter(Boolean) || [],
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
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
});
