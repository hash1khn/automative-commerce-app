import React, { forwardRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

// ✅ Fix: Wrap ProductCard with forwardRef to accept refs
const ProductCard = forwardRef<View, ProductCardProps>(({ product, onPress }, ref) => {
  return (
    <TouchableOpacity ref={ref} style={styles.cardContainer} onPress={onPress}>
      <Image
        source={{ uri: product.image || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productStock}>
          Stock: {product.stock} | Category: {product.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// ✅ Fix: Add displayName to prevent debug issues
ProductCard.displayName = 'ProductCard';

export default ProductCard;

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
    color: '#A03048',
    marginVertical: 5,
  },
  productStock: {
    fontSize: 12,
    color: '#666',
  },
});
