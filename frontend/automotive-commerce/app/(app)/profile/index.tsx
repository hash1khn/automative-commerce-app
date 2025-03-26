import React, { useEffect, useState, ReactNode } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { FontAwesome, MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

interface StatusButtonProps {
  title: string;
  count: number;
  icon: ReactNode;
  onPress: () => void;
}

const StatusButton = ({ title, count, icon, onPress }: StatusButtonProps) => (
  <TouchableOpacity style={styles.statusButton} onPress={onPress}>
    <View style={styles.statusIconContainer}>
      {icon}
    </View>
    <Text style={styles.statusCount}>{count}</Text>
    <Text style={styles.statusTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    user: {
      name: '',
      email: '',
      phone: '',
      role: '',
      verified: false,
    },
    orderStatusCounts: {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const response = await fetch('https://automative-commerce-app-production.up.railway.app/api/users/me', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        
        if (!response.ok) throw new Error('Failed to fetch profile');
        
        const data = await response.json();
        
        setProfileData({
          user: {
            name: data.name || data.user?.name || '',
            email: data.email || data.user?.email || '',
            phone: data.phone || data.user?.phone || '',
            role: data.role || data.user?.role || '',
            verified: data.verified || data.user?.verified || false
          },
          orderStatusCounts: {
            processing: data.processing || data.orderStatusCounts?.processing || 0,
            shipped: data.shipped || data.orderStatusCounts?.shipped || 0,
            delivered: data.delivered || data.orderStatusCounts?.delivered || 0,
            cancelled: data.cancelled || data.orderStatusCounts?.cancelled || 0
          }
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={require('../../../assets/images/placeholder.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{profileData?.user?.name || 'Guest'}</Text>
        <Text style={styles.userEmail}>{profileData?.user?.email || 'No email'}</Text>
        <Text style={styles.userPhone}>{profileData?.user?.phone || 'No phone'}</Text>
      </View>
      <View style={styles.statusContainer}>
        <StatusButton
          title="To Ship"
          count={profileData.orderStatusCounts.processing}
          icon={<FontAwesome name="truck" size={24} color={colors.primary} />}
          onPress={() => router.push(`/orders?status=processing`)}
        />
        <StatusButton
          title="To Receive"
          count={profileData.orderStatusCounts.shipped}
          icon={<MaterialIcons name="local-shipping" size={24} color={colors.primary} />}
          onPress={() => router.push(`/orders?status=shipped`)}
        />
        <StatusButton
          title="To Review"
          count={profileData.orderStatusCounts.delivered}
          icon={<Feather name="package" size={24} color={colors.primary} />}
          onPress={() => router.push(`/orders?status=delivered`)}
        />
        <StatusButton
          title="Returns & Cancellations"
          count={profileData.orderStatusCounts.cancelled}
          icon={<AntDesign name="closecircleo" size={24} color={colors.primary} />}
          onPress={() => router.push(`/orders?status=cancelled`)}
        />
      </View>
      <View style={styles.supportSection}>
        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => router.push('/tickets/new-ticket')}
        >
          <MaterialIcons name="support-agent" size={24} color="white" />
          <Text style={styles.supportButtonText}>Create Support Ticket</Text>
        </TouchableOpacity>
      </View>
      <Footer></Footer>
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
    marginBottom: 15,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  verificationBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  verificationText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  statusIconContainer: {
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  statusTitle: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 5,
  },
  statusCount: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: colors.text,
    fontSize: 16,
  },
  infoValue: {
    color: colors.primary,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  supportSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  supportButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  supportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});