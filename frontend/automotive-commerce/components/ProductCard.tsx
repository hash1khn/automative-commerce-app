import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

// Define the color palette
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const renderStockMessage = (stock: number) => {
    if (stock === 0) {
      return (
        <Text style={styles.stockMessageOut}>Out of Stock</Text>
      );
    } else if (stock <= 10) {
      return (
        <Text style={styles.stockMessageLow}>Only {stock} left!</Text>
      );
    } else {
      return (
        <Text style={styles.stockMessageIn}>In Stock</Text>
      );
    }
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image
        source={product.images[0] ? { uri: product.images[0] } : require('../assets/images/product-placeholder.png')}
        style={styles.productImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.productRating}>⭐ {product.rating.toFixed(1)}</Text>
          {renderStockMessage(product.stock)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.background,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: colors.accent,
  },
  cardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productRating: {
    fontSize: 12,
    color: colors.text,
  },
  stockMessageIn: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  stockMessageLow: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: '600',
  },
  stockMessageOut: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
  },
});

export default ProductCard;