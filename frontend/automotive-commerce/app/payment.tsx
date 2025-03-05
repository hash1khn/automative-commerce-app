import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView 
  } from 'react-native';
  import Header from '../components/Header';
  import { useState } from 'react';
  
  const colors = {
    primary: '#373D20',
    secondary: '#717744',
    accent: '#BCBD8B',
    background: '#F5F5F5',
    text: '#766153',
    error: '#FF0000',
  };
  
  export default function PaymentScreen() {
    // For now, use placeholder values; replace these with backend data later.
    const shippingAddress = "1234 Main St, Springfield, USA";
    const totalPayment = 123.45;
  
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
  
    const handlePayment = () => {
      if (!cardHolderName.trim() || !cardNumber.trim() || !cvv.trim()) {
        alert('Please enter card holder name, card number, and CVV');
        return;
      }
      // Payment processing logic goes here.
      alert('Payment processed successfully!');
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.content}>
          {/* Shipping Address */}
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>{shippingAddress}</Text>
          {/* Total Payment */}
          <Text style={styles.sectionTitle}>Total Payment</Text>
          <Text style={styles.totalText}>${totalPayment.toFixed(2)}</Text>
          {/* Card Details */}
          <Text style={styles.sectionTitle}>Card Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Card Holder Name"
            placeholderTextColor={colors.text}
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Card Number"
            placeholderTextColor={colors.text}
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <TextInput
            style={[styles.input, styles.cvvInput]}
            placeholder="Enter CVV"
            placeholderTextColor={colors.text}
            keyboardType="number-pad"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
          />
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay Now</Text>
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
    content: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    addressText: {
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.accent,
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.secondary,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.background,
      marginBottom: 20,
    },
    cvvInput: {
      marginTop: 0,
    },
    payButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    payButtonText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  