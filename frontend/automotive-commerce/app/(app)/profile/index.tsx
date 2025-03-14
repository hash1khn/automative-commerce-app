import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Reuse the colors from the ProductCard theme
const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: 'https://via.placeholder.com/150',
    address: '',
    orderHistory: [],
  });

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        // Retrieve the authToken from AsyncStorage
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          console.error('No auth token found');
          return;
        }

        // Make the API request with the authToken in the headers
        const response = await fetch('https://your-api-url.com/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`, // Include the authToken
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User data:', data); // Log the response to the console

        // Update the state with the fetched data
        setUser({
          name: data.name,
          email: data.email,
          profileImage: data.profileImage || 'https://via.placeholder.com/150',
          address: data.address,
          orderHistory: data.orderHistory || [],
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {user.orderHistory.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <Text style={styles.orderText}>{order.item}</Text>
            <Text style={styles.orderText}>{order.date}</Text>
            <Text style={styles.orderText}>{order.amount}</Text>
          </View>
        ))}
      </View> */}

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.background,
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
    borderWidth: 2,
    borderColor: colors.accent,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userEmail: {
    fontSize: 16,
    color: colors.text,
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
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text,
  },
  orderItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    paddingVertical: 10,
  },
  orderText: {
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
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