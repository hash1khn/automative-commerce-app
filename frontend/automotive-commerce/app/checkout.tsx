import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator, 
    Image, 
    TextInput, 
    SafeAreaView 
  } from 'react-native';
  import { useCart } from '../hooks/useCart';
  import { useState } from 'react';
  import Header from '../components/Header';
  import { router } from 'expo-router';
  
  const colors = {
    primary: '#373D20',
    secondary: '#717744',
    accent: '#BCBD8B',
    background: '#F5F5F5',
    text: '#766153',
    error: '#FF0000',
  };
  
  export default function CheckoutScreen() {
    const { data: cart, isLoading, isError } = useCart();
    const [shippingAddress, setShippingAddress] = useState('');
    const [promoCode, setPromoCode] = useState('');
  
    if (isLoading) {
      return (
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      );
    }
  
    if (isError) {
      return (
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorText}>Failed to load cart</Text>
        </SafeAreaView>
      );
    }
  
    if (!cart?.items || cart.items.length === 0) {
      return (
        <SafeAreaView style={styles.centered}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </SafeAreaView>
      );
    }
  
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  
    const handleProceedToPayment = () => {
      if (!shippingAddress.trim()) {
        alert('Shipping address is required');
        return;
      }
      // Optionally, promo code logic can be added here
      router.push('/payment');
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.wrapper}>
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
                  <Text style={styles.quantityText}>
                    Quantity: {item.quantity}
                  </Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
  
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.addressLabel}>Shipping Address *</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter your shipping address"
              placeholderTextColor={colors.text}
              value={shippingAddress}
              onChangeText={setShippingAddress}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.promoCodeLabel}>Promo Code (optional)</Text>
            <TextInput
              style={styles.promoCodeInput}
              placeholder="Enter promo code"
              placeholderTextColor={colors.text}
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>
  
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    wrapper: {
      margin: 20, // Adds margins on all four sides
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },
    flatListContent: {
      paddingBottom: 20,
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
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 16,
      backgroundColor: colors.background,
    },
    itemDetails: {
      flex: 1,
      justifyContent: 'center',
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
      marginBottom: 4,
    },
    quantityText: {
      fontSize: 14,
      color: colors.text,
    },
    totalContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.primary,
      backgroundColor: colors.background,
      marginBottom: 20,
    },
    totalText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
      textAlign: 'center',
    },
    inputContainer: {
      marginBottom: 20,
    },
    addressLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    addressInput: {
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    promoCodeLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    promoCodeInput: {
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
    },
    paymentButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      padding: 16,
      alignItems: 'center',
      marginBottom: 20,
      elevation: 2,
    },
    paymentButtonText: {
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
  