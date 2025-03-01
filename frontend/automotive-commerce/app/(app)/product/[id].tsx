// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAddToCart } from '../../../hooks/useCart';

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

const API_URL = 'http://localhost:5000/api/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: addToCart, isPending } = useAddToCart(); // Use `isPending` instead of `isLoading`

  const handleAddToCart = () => {
    addToCart({ productId: id as string, quantity: 1 });
  };

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
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {product && (
        <>
          <View style={styles.productHeader}>
            <Image
              style={styles.productImage}
              source={{ uri: product.images[0]?.replace(/"|<.*?>/g, '') }}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>$ {product.price.toFixed(2)}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.productRating}>⭐ {product.rating.toFixed(1)}</Text>
              <Text style={styles.ratingText}>Based on 45 reviews</Text>
            </View>
            <TouchableOpacity
              style={[styles.addToCartButton, isPending && styles.disabledButton]}
              onPress={handleAddToCart}
              disabled={isPending}
            >
              <Text style={styles.addToCartText}>
                {isPending ? 'Adding to Cart...' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  productHeader: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 16,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productRating: {
    fontSize: 18,
    color: '#FF9900',
    fontWeight: 'bold',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Grayed out when disabled
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});