import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import CartIcon from './CartIcon';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
  primary: '#373D20',
  adminPrimary: '#2A1E5C', // New admin color
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function Header() {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [headerStyles, setHeaderStyles] = useState({
    backgroundColor: colors.primary,
    titleColor: colors.background,
  });

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

  const handleAdminPanelPress = () => {
    router.push({ pathname: '/admin/dashboard' });
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const response = await fetch('https://automative-commerce-app-production.up.railway.app/api/users/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        
        if (data.user?.role === 'admin') {
          setIsAdmin(true);
          setHeaderStyles({
            backgroundColor: colors.adminPrimary,
            titleColor: colors.background
          });
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    if (user) checkAdminStatus();
  }, [user]);

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerStyles.backgroundColor }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: headerStyles.titleColor }]}>
          
          {!isAdmin && 'Automotive Commerce'}
          {isAdmin && 'Admin Mode'}
        </Text>
      </View>

      <View style={styles.iconsContainer}>
        {isAdmin ? (
          <TouchableOpacity 
            style={styles.adminButton}
            onPress={handleAdminPanelPress}
          >
            <Text style={styles.adminButtonText}>Admin Panel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCartPress}>
            <CartIcon />
          </TouchableOpacity>
        )}

        {/* Authentication buttons */}
        {user ? (
          <TouchableOpacity style={styles.button} onPress={logout}>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
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
    marginLeft: 10,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  adminButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.adminPrimary,
    marginRight: 10,
  },
  adminButtonText: {
    color: colors.adminPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});