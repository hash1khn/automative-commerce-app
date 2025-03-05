import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useCart, useUpdateCart, useRemoveFromCart, useClearCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
  import Header from '../components/Header';


// Define the color palette
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function CartScreen() {
  const { user } = useAuth();
  const { data: cart, isLoading, isError } = useCart();
  const { mutate: updateCart } = useUpdateCart();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();

  if (!user) {
    router.replace('/(auth)/login');
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
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
      <Header />

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
              <Text style={styles.productPrice}>${item.product.price.toFixed(2)}</Text>

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
          onPress={() => router.push('/checkout')}
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
    padding: 20,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: colors.background,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '500',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.background,
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  removeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.error,
    borderRadius: 6,
  },
  removeText: {
    color: colors.background,
    fontWeight: '500',
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    backgroundColor: colors.background,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
  },
  checkoutText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptyText: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '500',
  },
});