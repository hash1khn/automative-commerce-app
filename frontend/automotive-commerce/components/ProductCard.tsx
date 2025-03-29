import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

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
  description?: string;  // Made optional since not in your sample
  averageRating: number;
  images: string[];
  stock: number;
  createdAt?: string;    // Made optional
  updatedAt?: string;    // Made optional
}

interface ProductCardProps {
  product: Product;      // Made required since you always pass it
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const rating = product.averageRating?.toFixed(1) || '0.0';
  const price = product.price?.toFixed(2);
  const stock = product.stock || 0;

  const renderStockMessage = (stock: number) => {
    if (stock === 0) {
      return <Text style={styles.stockMessageOut}>Out of Stock</Text>;
    } else if (stock <= 10) {
      return <Text style={styles.stockMessageLow}>Only {stock} left!</Text>;
    }
    return <Text style={styles.stockMessageIn}>In Stock</Text>;
  };

  return (
    <View style={styles.cardContainer}>
      <Link href={`/product/${product._id}`} asChild>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={{
              uri: product.images?.[0] || 'https://via.placeholder.com/150',
            }}
            style={styles.productImage}
            onError={(e) => console.log('Image error:', e.nativeEvent.error)}
          />
          <View style={styles.cardContent}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${price}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.productRating}>⭐ {rating}</Text>
              {renderStockMessage(stock)}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
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
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: colors.accent,
  },
  cardContent: {
    paddingHorizontal: 4,
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