// components/Header.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Automotive Commerce</Text>
      
      <View style={styles.iconsContainer}>
        {/* Cart Icon */}
        <CartIcon />

        {/* Login Button */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#A03048',
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  buttonText: {
    color: '#A03048',
    fontWeight: 'bold',
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});