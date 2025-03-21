import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

// Define color constants
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

// Define types for cart items
type CartItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
};

// Define types for cart data
type CartData = {
  items: CartItem[];
};

// Define props for CheckoutSection
type CheckoutSectionProps = {
  onProceed: (address: string) => void;
  setDiscount: (discount: number) => void;
  setTotal: (total: number) => void;
};

// Define props for PaymentSection
type PaymentSectionProps = {
  shippingAddress: string;
  total: number;
};

// Define type for card details
type CardDetails = {
  name: string;
  number: string;
  cvv: string;
};

// CheckoutSection Component
const CheckoutSection = ({ onProceed, setDiscount, setTotal }: CheckoutSectionProps) => {
  const { data: cart, isLoading, isError } = useCart();
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [verifying, setVerifying] = useState(false);
  const authToken = useAuth();
  console.log('this is auth',authToken)
  

  // Calculate total with discount
  const calculateTotal = (): number => {
    if (!cart?.items) return 0;
    const subtotal = cart.items.reduce(
      (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
      0
    );

    let discountAmount = 0;
    if (promoDiscount < 1) {
      discountAmount = subtotal * promoDiscount; // Percentage discount
    } else {
      discountAmount = promoDiscount; // Flat discount
    }

    setDiscount(discountAmount);
    const total = subtotal - discountAmount;
    setTotal(total);
    return total;
  };

  const handleVerifyPromo = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }

    try {
      setVerifying(true);
      // const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/orders/validate-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.token}`
        },
        body: JSON.stringify({ promoCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setPromoDiscount(data.discount);
      } else {
        alert(data.message || 'Invalid promo code');
        setPromoDiscount(0);
      }
    } catch (error) {
      console.error('Promo code validation failed:', error);
      alert('Failed to validate promo code');
      setPromoDiscount(0);
    } finally {
      setVerifying(false);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color={colors.primary} />;
  if (isError) return <Text style={styles.errorText}>Failed to load cart</Text>;
  if (!cart?.items?.length) return <Text style={styles.emptyText}>Your cart is empty</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item: CartItem) => item.product._id}
        renderItem={({ item }: { item: CartItem }) => (
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
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: ${calculateTotal().toFixed(2)}
        </Text>
        {promoDiscount > 0 && (
          <Text style={styles.discountText}>
            Discount: -${(calculateTotal() - cart.items.reduce(
              (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
              0
            )).toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Shipping Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          placeholderTextColor={colors.text}
          value={shippingAddress}
          onChangeText={(text: string) => setShippingAddress(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Promo Code</Text>
        <View style={styles.promoInputContainer}>
          <TextInput
            style={styles.promoCodeInput}
            placeholder="Enter promo code"
            placeholderTextColor={colors.text}
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerifyPromo}
            disabled={verifying}
          >
            {verifying ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => shippingAddress ? onProceed(shippingAddress) : alert('Address required')}
      >
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// PaymentSection Component
const PaymentSection = ({ shippingAddress, total }: PaymentSectionProps) => {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    name: '',
    number: '',
    cvv: ''
  });

  const handlePayment = (): void => {
    if (!cardDetails.name || !cardDetails.number || !cardDetails.cvv) {
      alert('Please fill all card details');
      return;
    }
    alert(`Payment of $${total} successful!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressText}>{shippingAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Total</Text>
        <Text style={styles.totalText}>${total.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Cardholder Name"
          value={cardDetails.name}
          onChangeText={(text: string) => setCardDetails(prev => ({ ...prev, name: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="number-pad"
          value={cardDetails.number}
          onChangeText={(text: string) => setCardDetails(prev => ({ ...prev, number: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          keyboardType="number-pad"
          secureTextEntry
          value={cardDetails.cvv}
          onChangeText={(text: string) => setCardDetails(prev => ({ ...prev, cvv: text }))}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Main CombinedCheckout Component
export default function CombinedCheckout() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const handleProceed = (address: string): void => {
    setShippingAddress(address);
    setCurrentStep(2);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      {currentStep === 1 ? (
        <CheckoutSection
          onProceed={handleProceed}
          setDiscount={setDiscount}
          setTotal={setTotal}
        />
      ) : (
        <PaymentSection
          shippingAddress={shippingAddress}
          total={total}
        />
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.accent,
    borderRadius: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  productPrice: {
    fontSize: 16,
    color: colors.secondary,
  },
  quantityText: {
    fontSize: 14,
    color: colors.text,
  },
  totalContainer: {
    paddingVertical: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 18,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.accent,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.text,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  promoCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  discountText: {
    fontSize: 16,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 5,
  },
});