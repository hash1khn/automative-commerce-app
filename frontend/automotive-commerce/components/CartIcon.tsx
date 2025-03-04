// components/CartIcon.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useCart } from '../hooks/useCart';
import { MaterialIcons } from '@expo/vector-icons';

export default function CartIcon() {
  const { data: cart } = useCart();
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Link href="/cart" asChild>
      <TouchableOpacity style={{ position: 'relative', marginRight: 8 }}>
        {/* Wrap content in a single View */}
        <View>
          <MaterialIcons name="shopping-cart" size={28} color="white" />
          {itemCount > 0 && (
            <View style={{
              position: 'absolute',
              right: -6,
              top: -6,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                {itemCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
}