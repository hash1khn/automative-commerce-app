// components/Footer.tsx
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Footer() {
  return (
    <View style={styles.container}>
      <Link href="/(app)/home" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="home-outline" size={24} color="#373D20" />
        </TouchableOpacity>
      </Link>
      
      <Link href="/(app)/profile" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="person-outline" size={24} color="#373D20" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 4,
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});