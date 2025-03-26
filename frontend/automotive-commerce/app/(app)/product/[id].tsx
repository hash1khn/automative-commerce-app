// app/product/[id].tsx
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useAddToCart } from '../../../hooks/useCart';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';

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

const API_URL = 'https://automative-commerce-app-production.up.railway.app/api/products';
const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { mutate: addToCart, isPending } = useAddToCart();

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

  // Handle scroll events to update active dot indicator
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  // Render each image in the carousel
  const renderImageItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <View style={styles.imageSlide}>
        <Image
          style={styles.productImage}
          source={{ uri: item.replace(/"|<.*?>/g, '') }}
          resizeMode="contain"
        />
      </View>
    );
  };

  // Scroll to specific image index
  const scrollToIndex = (index: number) => {
    if (flatListRef.current && product?.images.length) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  // Render pagination dots
  const renderPaginationDots = () => {
    if (!product?.images || product.images.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {product.images.map((_, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    );
  };

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
    if (stock === 0 || !stock) {
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
          {/* Image Carousel */}
          <View style={styles.productHeader}>
            <FlatList
              ref={flatListRef}
              data={product.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={renderImageItem}
              onScroll={handleScroll}
              keyExtractor={(item, index) => `image-${index}`}
            />
            {renderPaginationDots()}
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

// Updated styles with image slider additions
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
    borderRadius: 12,
    position: 'relative',
  },
  imageSlide: {
    width: width - 32, // Account for container padding
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '90%',
    height: '90%',
    borderRadius: 8,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: colors.secondary,
    opacity: 0.5,
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