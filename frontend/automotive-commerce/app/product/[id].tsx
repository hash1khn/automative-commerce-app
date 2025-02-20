// app/product/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams(); // Use this instead of useParams
  return (
    <View>
      <Text>Product ID: {id}</Text>
    </View>
  );
}