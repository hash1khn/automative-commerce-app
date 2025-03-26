import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios'; // Import the API instance
import Toast from 'react-native-toast-message'; // Import Toast

// Define the color palette
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false); // To disable button during API call

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^\+92\d{10}$/; // Ensure phone starts with +92 and has 10 digits
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    const { name, email, phone, password, confirmPassword } = formData;

    // Field presence check
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required',
        visibilityTime: 3000,
      });
      return;
    }

    // Password match check
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
        visibilityTime: 3000,
      });
      return;
    }

    // Phone number validation
    if (!isValidPhoneNumber(phone)) {
      Alert.alert(
        'Invalid Phone Number',
        'Phone number must start with +92 followed by 10 digits\nExample: +921234567890'
      );
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone Number',
        text2: 'Phone number must start with +92 followed by 10 digits',
        visibilityTime: 3000,
      });
      return;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address',
        visibilityTime: 3000,
      });
      return;
    }

    // Password strength check
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 8 characters long',
        visibilityTime: 3000,
      });
      return;
    }

    const userData = {
      name,
      email,
      phone,
      password,
    };

    try {
      setLoading(true);
      const response = await axios.post('https://automative-commerce-app-production.up.railway.app/api/auth/signup', userData);

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully! Please login.');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created successfully! Please login.',
          visibilityTime: 3000,
        });
        router.replace('/(auth)/check-email');
      }
    } catch (err) {
      // Enhanced error handling
      let errorMessage = 'Registration failed. Please try again.';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      Alert.alert('Registration Failed', errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to get started</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={colors.text}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.text}
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={colors.text}
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={colors.text}
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
        />

        {/* Register Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast /> {/* Add the Toast component here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkText: {
    color: colors.text,
  },
  link: {
    color: colors.secondary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});