import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import ProcessingOrders from './processing';
import ShippedOrders from './shipped';
import DeliveredOrders from './delivered';
import CancelledOrders from './cancelled';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

export const OrderTabs = () => {
  const [activeTab, setActiveTab] = useState('processing');
  
  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'processing' && styles.activeTab]}
          onPress={() => setActiveTab('processing')}
        >
          <Text style={styles.tabText}>To Ship</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'shipped' && styles.activeTab]}
          onPress={() => setActiveTab('shipped')}
        >
          <Text style={styles.tabText}>To Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]}
          onPress={() => setActiveTab('delivered')}
        >
          <Text style={styles.tabText}>To Review</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={styles.tabText}>Cancellations</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.content}>
        {activeTab === 'processing' && <ProcessingOrders />}
        {activeTab === 'shipped' && <ShippedOrders />}
        {activeTab === 'delivered' && <DeliveredOrders />}
        {activeTab === 'cancelled' && <CancelledOrders />}
      </ScrollView>
    </View>
  );
};

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
  content: {
    flex: 1,
    padding: 16,
  },
});

export default OrderTabs;