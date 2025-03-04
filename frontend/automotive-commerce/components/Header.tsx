import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import CartIcon from './CartIcon';
import { useAuth } from '../context/AuthContext';

// Define the color palette
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function Header() {
  const { user, logout } = useAuth();

  console.log('User state:', user); // Debugging

  const handleCartPress = () => {
    const currentUser = user || null; // Fallback to null if user is undefined
    if (!currentUser) {
      console.log('Redirecting to login...'); // Debugging
      router.push('/(auth)/login');
      return;
    }
    console.log('Redirecting to cart...'); // Debugging
    router.push('/cart');
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Automotive Commerce</Text>
      
      <View style={styles.iconsContainer}>
        {/* Cart Icon */}
        <TouchableOpacity onPress={handleCartPress}>
          <CartIcon />
        </TouchableOpacity>

        {/* Show Login or Logout based on auth state */}
        {user ? (
          <TouchableOpacity 
            style={styles.button} 
            onPress={logout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});