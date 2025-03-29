// app/(admin)/orders/index.tsx
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Order = {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    items: Array<{
        _id: string;
        product: {
            _id: string;
            name: string;
            price: number;
            images: string[];
        };
        quantity: number;
        price: number;
    }>;
    totalPrice: number;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'successful' | 'failed';
    paymentMethod: string;
    paymentDetails: {
        method: string;
        cardType?: string;
        last4?: string;
        cardHolderName?: string;
    };
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
};

const AllOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter, searchQuery]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const authToken = await AsyncStorage.getItem('authToken');

            const response = await fetch('http://localhost:5000/api/orders/all-orders', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch orders');

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let result = [...orders];

        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order =>
                order.user.name.toLowerCase().includes(query) ||
                order.user.email.toLowerCase().includes(query) ||
                order._id.toLowerCase().includes(query) ||
                order.items.some(item => item.product.name.toLowerCase().includes(query))
            );
        }

        setFilteredOrders(result);
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');

            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/update-order-status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status');
            }

            // Optimistically update the local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus as Order['status'] } : order
                )
            );

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update order');
            // Revert the optimistic update if needed
            fetchOrders();
        }
    };


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return '#F59E0B'; // amber
            case 'shipped': return '#3B82F6'; // blue
            case 'delivered': return '#10B981'; // green
            case 'cancelled': return '#EF4444'; // red
            default: return '#6B7280'; // gray
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                </View>
            </View>

            <Text style={styles.customerName}>{item.user.name} ({item.user.email})</Text>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>

            <View style={styles.paymentInfo}>
                <FontAwesome name="credit-card" size={16} color="#4B5563" />
                <Text style={styles.paymentText}>
                    {item.paymentDetails.cardType || 'Card'} •••• {item.paymentDetails.last4} ({item.paymentStatus})
                </Text>
            </View>

            <Text style={styles.shippingText}>Shipping: {item.shippingAddress}</Text>

            <View style={styles.itemsContainer}>
                {item.items.map((orderItem) => (
                    <View key={orderItem._id} style={styles.itemRow}>
                        <Image
                            source={{ uri: orderItem.product.images[0] }}
                            style={styles.productImage}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={styles.productName}>{orderItem.product.name}</Text>
                            <Text style={styles.productPrice}>
                                ${orderItem.price.toFixed(2)} × {orderItem.quantity} = ${(orderItem.price * orderItem.quantity).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalPrice}>Total: ${item.totalPrice.toFixed(2)}</Text>

                <View style={styles.actionButtons}>
                    {item.status === 'processing' && (
                        <>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                                onPress={() => updateOrderStatus(item._id, 'shipped')}
                            >
                                <Text style={styles.actionButtonText}>Mark as Shipped</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                                onPress={() => updateOrderStatus(item._id, 'cancelled')}
                            >
                                <Text style={styles.actionButtonText}>Cancel Order</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {item.status === 'shipped' && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                            onPress={() => updateOrderStatus(item._id, 'delivered')}
                        >
                            <Text style={styles.actionButtonText}>Mark as Delivered</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading orders...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchOrders}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>All Orders</Text>
                <Text style={styles.orderCount}>{filteredOrders.length} orders found</Text>
            </View>

            <View style={styles.filterContainer}>
                <View style={styles.statusFilter}>
                    <TouchableOpacity
                        style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
                        onPress={() => setStatusFilter('all')}
                    >
                        <Text style={styles.filterText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, statusFilter === 'processing' && styles.activeFilter]}
                        onPress={() => setStatusFilter('processing')}
                    >
                        <Text style={styles.filterText}>Processing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, statusFilter === 'shipped' && styles.activeFilter]}
                        onPress={() => setStatusFilter('shipped')}
                    >
                        <Text style={styles.filterText}>Shipped</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, statusFilter === 'delivered' && styles.activeFilter]}
                        onPress={() => setStatusFilter('delivered')}
                    >
                        <Text style={styles.filterText}>Delivered</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, statusFilter === 'cancelled' && styles.activeFilter]}
                        onPress={() => setStatusFilter('cancelled')}
                    >
                        <Text style={styles.filterText}>Cancelled</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <MaterialIcons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.orderList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Entypo name="box" size={50} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    orderCount: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    filterContainer: {
        marginBottom: 16,
    },
    statusFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    activeFilter: {
        backgroundColor: '#111827',
    },
    filterText: {
        fontSize: 14,
        color: '#6B7280',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    orderList: {
        paddingBottom: 16,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    customerName: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 8,
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    paymentText: {
        fontSize: 14,
        color: '#4B5563',
        marginLeft: 4,
    },
    shippingText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 12,
    },
    itemsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
        marginBottom: 12,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#6B7280',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 12,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 16,
    },
    errorText: {
        color: '#EF4444',
        marginBottom: 16,
    },
    retryText: {
        color: '#3B82F6',
        textDecorationLine: 'underline',
    },
});

export default AllOrdersPage;