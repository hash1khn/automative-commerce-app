// components/ProductCard.tsx
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

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

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image
        source={product.images[0] ? { uri: product.images[0] } : require('../assets/images/product-placeholder.png')}
        style={styles.productImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productRating}>⭐ {product.rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 10,
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#007BFF',
    marginVertical: 5,
  },
  productRating: {
    fontSize: 12,
    color: '#666',
  },
});

export default ProductCard;