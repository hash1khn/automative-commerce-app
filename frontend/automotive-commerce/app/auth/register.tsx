import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
        />

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={() => console.log('Register')}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity style={styles.linkContainer}>
          <Link href="/auth/login" asChild>
            <Text style={styles.link}>Already have an account? Login</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
    color: '#444',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#A03048',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: '#A03048',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
