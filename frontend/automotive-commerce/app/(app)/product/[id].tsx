// app/product/[id].tsx
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAddToCart } from '../../../hooks/useCart';
import { useAuth } from '../../../context/AuthContext';


interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  averageRating: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  stock: number; // Add this line
}

const API_URL = 'http://localhost:5000/api/products';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth(); // Get auth state
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { mutate: addToCart, isPending } = useAddToCart(); // Use `isPending` instead of `isLoading`

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    addToCart({ productId: id as string, quantity: 1 });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product>(`${API_URL}/${id}`);
        console.log(response.data);
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
        <ActivityIndicator size="large" color={colors.primary} />
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

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Loading product details...</Text>
      </View>
    );
  }


  const renderStockMessage = (stock: number) => {
    if (stock === 0) {
      return (
        <Text style={styles.stockMessageOut}>
          Out of Stock
        </Text>
      );
    } else if (stock <= 10) {
      return (
        <Text style={styles.stockMessageLow}>
          Only {stock} pieces remaining!
        </Text>
      );
    } else {
      return (
        <Text style={styles.stockMessageIn}>
          In Stock
        </Text>
      );
    }
  };

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
            <Text style={styles.productPrice}>$ {product?.price ? product.price.toFixed(2) : 'N/A'}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.productRating}>⭐ {product?.averageRating ? product.averageRating.toFixed(1) : 'N/A'}</Text>
              <Text style={styles.ratingText}>Based on 45 reviews</Text>
            </View>

            {/* Stock Information */}
            <View style={styles.stockContainer}>
              {renderStockMessage(product.stock)}
            </View>

            {/* Add to Cart Button - Only show if product is in stock */}
            {product.stock > 0 && (
              <TouchableOpacity
                style={[styles.addToCartButton, isPending && styles.disabledButton]}
                onPress={handleAddToCart}
                disabled={isPending}
              >
                <Text style={styles.addToCartText}>
                  {isPending ? 'Adding to Cart...' : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      {showLoginPrompt && (
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>
            Please login to add items to your cart
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowLoginPrompt(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
// Add these color constants at the top of your file
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

// Update the styles with the new color palette
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
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
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
  stockContainer: {
    marginBottom: 16,
  },
  stockMessageIn: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  stockMessageLow: {
    fontSize: 16,
    color: '#FFA500', // Orange color for low stock
    fontWeight: 'bold',
  },
  stockMessageOut: {
    fontSize: 16,
    color: colors.error,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  productPrice: {
    fontSize: 20,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productRating: {
    fontSize: 18,
    color: colors.secondary,
    fontWeight: 'bold',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: colors.text,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  addToCartText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  loginPrompt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  loginPromptText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: colors.text,
  },
  loginButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: colors.background,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  cancelButtonText: {
    color: colors.text,
    textAlign: 'center',
  },
});

// Update the ActivityIndicator color
