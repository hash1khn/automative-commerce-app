import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Automotive E-Commerce</Text>
        <Link href="/(app)/home" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 24,
    elevation: 4, // Android shadow
    shadowColor: colors.primary, // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
