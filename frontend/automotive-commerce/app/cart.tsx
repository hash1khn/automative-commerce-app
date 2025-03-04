import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useCart, useUpdateCart, useRemoveFromCart, useClearCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { router } from 'expo-router'; // Import router for navigation

export default function CartScreen() {
  const { user } = useAuth(); // Get the user state
  const { data: cart, isLoading, isError } = useCart();
  const { mutate: updateCart } = useUpdateCart();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();

  // Redirect to login if no user is logged in
  if (!user) {
    router.replace('/(auth)/login'); // Use replace to prevent going back to the cart screen
    return null; // Return null to prevent rendering the rest of the component
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load cart</Text>
      </View>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.product._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.product.images[0] }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.productName}>{item.product.name}</Text>
              <Text style={styles.productPrice}>
                ${item.product.price.toFixed(2)}
              </Text>
              
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => updateCart({
                    productId: item.product._id,
                    quantity: Math.max(1, item.quantity - 1)
                  })}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.quantity}>{item.quantity}</Text>
                
                <TouchableOpacity
                  onPress={() => updateCart({
                    productId: item.product._id,
                    quantity: item.quantity + 1
                  })}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                onPress={() => removeFromCart(item.product._id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => clearCart()}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
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
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#008000',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#A03048',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});