import { View, Text, TextInput, Button } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button title="Login" onPress={() => console.log('Login')} />
      <Link href="/auth/register">Register</Link>
    </View>
  );
}