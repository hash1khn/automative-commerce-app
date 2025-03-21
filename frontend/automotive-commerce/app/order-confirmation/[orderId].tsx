import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useRouter

export default function OrderConfirmation() {
  const { orderId } = useLocalSearchParams(); // Get the orderId from the route params
  const router = useRouter(); // Initialize the router

  const handleGoBackToHome = () => {
    router.push('/'); // Navigate back to the home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Confirmation</Text>
      <Text style={styles.orderId}>Your order ID is: {orderId}</Text>
      <Text style={styles.orderId}>Check your email for more details!</Text>

      {/* Add a "Go Back to Home" button */}
      <TouchableOpacity style={styles.button} onPress={handleGoBackToHome}>
        <Text style={styles.buttonText}>Go Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderId: {
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#373D20', // Use your app's primary color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
});