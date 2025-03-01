// app/index.tsx
import { Link } from 'expo-router';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Automotive E-Commerce</Text>
      <Link href="/(app)/home" asChild>
        <Button title="Go to Home" />
      </Link>
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
});