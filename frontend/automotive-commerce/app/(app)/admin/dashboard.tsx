// app/(app)/admin/dashboard.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';

const colors = {
  primary: '#2A1E5C', // Admin primary color
  secondary: '#4B38B3',
  accent: '#7C6BDF',
  background: '#F5F5F5',
  text: '#333333',
  error: '#FF0000',
};

export default function AdminDashboard() {
  const router = useRouter();

  const adminCards = [
    {
      title: 'Manage Orders',
      description: 'View and update customer orders',
      icon: <FontAwesome name="shopping-bag" size={30} color={colors.primary} />,
      onPress: () => router.push({ pathname: '/(app)/admin/orders' }),
    },
    {
      title: 'Manage Products',
      description: 'Add, edit or remove products',
      icon: <MaterialIcons name="inventory" size={30} color={colors.primary} />,
      onPress: () => router.push({ pathname: '/(app)/admin/products' }),
    },
    {
      title: 'Support Tickets',
      description: 'View and respond to customer issues',
      icon: <Feather name="help-circle" size={30} color={colors.primary} />,
      onPress: () => router.push({ pathname: '/(app)/admin/tickets' }),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      
      <View style={styles.cardsContainer}>
        {adminCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={card.onPress}
          >
            <View style={styles.iconContainer}>
              {card.icon}
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#F0EBFF',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
  },
});