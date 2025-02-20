import { View, Text, FlatList } from 'react-native';
import { Link } from 'expo-router';

const products = [
  { id: 1, name: 'Spark Plug', price: 20 },
  { id: 2, name: 'Brake Pads', price: 50 },
];

export default function HomeScreen() {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <Link href={`../product/${item.id}`}> 
          <View>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </View>
        </Link>
      )}
    />
  );
}