// app/(main)/orders/_layout.tsx
import { Slot, useSegments, useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export default function OrdersLayout() {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1] || 'processing';

  const tabs = [
    { id: 'processing', title: 'To Ship' },
    { id: 'shipped', title: 'To Receive' },
    { id: 'delivered', title: 'To Review' },
    { id: 'cancelled', title: 'Cancellations' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              currentRoute === tab.id && styles.activeTab
            ]}
            onPress={() => router.push(`/orders/${tab.id}`)}
          >
            <Text style={[
              styles.tabText,
              currentRoute === tab.id && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Slot /> {/* This renders the current child route */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.accent,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 14,
  },
  activeTabText: {
    color: colors.background,
  },
});