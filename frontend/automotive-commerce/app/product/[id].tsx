// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
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

const API_URL = 'http://localhost:5000/api/products'; // Update to match your single product endpoint

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product>(`${API_URL}/${id}`);
        setProduct(response.data);
      } catch (error: any) {
        setError(error.message || 'Unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {product && (
        <View>
          <Image
            style={styles.productImage}
            source={{ uri: product.images[0]?.replace(/"|<.*?>/g, '') }}
          />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.productRating}>⭐ {product.rating.toFixed(1)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#008000',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  productRating: {
    fontSize: 18,
    color: '#FF9900',
    fontWeight: 'bold',
  },
});