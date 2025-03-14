import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  // Dummy user data
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    profileImage: 'https://via.placeholder.com/150',
    address: '123 Main St, Springfield, USA',
    orderHistory: [
      { id: 1, item: 'Advanced Spark Plug', date: '2025-01-15', amount: '$19.99' },
      { id: 2, item: 'Premium Brake Pads', date: '2025-02-10', amount: '$49.99' },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.sectionContent}>{user.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {user.orderHistory.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <Text style={styles.orderText}>{order.item}</Text>
            <Text style={styles.orderText}>{order.date}</Text>
            <Text style={styles.orderText}>{order.amount}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
  orderItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  orderText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#A03048',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
