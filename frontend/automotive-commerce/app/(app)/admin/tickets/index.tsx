// app/(app)/admin/tickets.tsx
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Ticket = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  responses: any[];
  createdAt: string;
};

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, searchQuery]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');

      const response = await fetch('http://localhost:5000/api/tickets/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch tickets');

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (ticketId: string, text: string) => {
    setResponseTexts(prev => ({ ...prev, [ticketId]: text }));
  };

  const submitResponse = async (ticketId: string) => {
    const responseText = responseTexts[ticketId];
    if (!responseText?.trim()) {
      Alert.alert('Error', 'Please enter a response');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: responseText,
          // Add role if needed by your API
          role: 'admin' // or get this from user context
        })
      });

      if (!response.ok) throw new Error('Failed to submit response');

      const data = await response.json();

      // Handle the API response properly
      if (data.ticket) {
        // Update the local state with the returned ticket
        setTickets(tickets.map(t =>
          t._id === ticketId ? { ...t, ...data.ticket } : t
        ));
      }

      // Clear the response input
      handleResponseChange(ticketId, '');
      Alert.alert('Success', 'Response submitted successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit response');
    }
  };

  const filterTickets = () => {
    let result = [...tickets];

    if (statusFilter !== 'all') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket =>
        ticket.user.name.toLowerCase().includes(query) ||
        ticket.user.email.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.message.toLowerCase().includes(query)
      );
    }

    setFilteredTickets(result);
  };

  const resolveTicket = async (ticketId: string) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');

      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/resolve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to resolve ticket');

      Alert.alert('Success', 'Ticket has been marked as resolved');
      fetchTickets();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to resolve ticket');
    }
  };

  const closeTicket = async (ticketId: string) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');

      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}/close`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to close ticket');

      Alert.alert('Success', 'Ticket has been closed');
      fetchTickets();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to close ticket');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444'; // red
      case 'in-progress': return '#F59E0B'; // amber
      case 'resolved': return '#10B981'; // green
      case 'closed': return '#6B7280'; // gray
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const toggleExpandTicket = (ticketId: string) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => {
    return (
      <View style={styles.ticketCard}>
        {/* Header with expand/collapse */}
        <TouchableOpacity
          onPress={() => toggleExpandTicket(item._id)}
          activeOpacity={0.8}
        >
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketSubject}>{item.subject}</Text>
            <View style={styles.headerRight}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
              </View>
              <MaterialIcons
                name={expandedTicket === item._id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#6B7280"
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Ticket content */}
        <View>
          <Text style={styles.ticketMessage} numberOfLines={expandedTicket === item._id ? undefined : 2}>
            {item.message}
          </Text>

          <View style={styles.ticketFooter}>
            <View style={styles.userInfo}>
              <FontAwesome name="user" size={14} color="#6B7280" />
              <Text style={styles.userText}>{item.user.name} ({item.user.email})</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        {/* Expanded content */}
        {expandedTicket === item._id && (
          <View onStartShouldSetResponder={() => true}>
            {item.responses?.length > 0 && (
              <View style={styles.responsesContainer}>
                <Text style={styles.responsesTitle}>Previous Responses:</Text>
                {item.responses.map((response) => (
                  <View
                    key={response._id || response.createdAt}
                    style={[
                      styles.responseBubble,
                      response.sender === user?._id ? styles.adminResponse : styles.userResponse
                    ]}
                  >
                    <Text style={styles.responseUser}>
                      {response.sender === user?._id ? 'You' : item.user.name}
                    </Text>
                    <Text style={styles.responseText}>{response.message}</Text>
                    <Text style={styles.responseDate}>{formatDate(response.createdAt)}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.responseInputContainer}>
              <TextInput
                style={styles.responseInput}
                placeholder="Type your response here..."
                placeholderTextColor="#9CA3AF"
                value={responseTexts[item._id] || ''}
                onChangeText={(text) => handleResponseChange(item._id, text)}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => submitResponse(item._id)}
              >
                <MaterialIcons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          {item.status !== 'resolved' && item.status !== 'closed' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.resolveButton]}
              onPress={() => resolveTicket(item._id)}
            >
              <Feather name="check-circle" size={16} color="white" />
              <Text style={styles.actionButtonText}> Resolve</Text>
            </TouchableOpacity>
          )}

          {item.status !== 'closed' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.closeButton]}
              onPress={() => closeTicket(item._id)}
            >
              <MaterialIcons name="close" size={16} color="white" />
              <Text style={styles.actionButtonText}> Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading tickets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchTickets}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support Tickets</Text>
        <Text style={styles.ticketCount}>{filteredTickets.length} tickets found</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.statusFilter}>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
            onPress={() => setStatusFilter('all')}
          >
            <Text style={[styles.filterText, statusFilter === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'open' && styles.activeFilter]}
            onPress={() => setStatusFilter('open')}
          >
            <Text style={[styles.filterText, statusFilter === 'open' && styles.activeFilterText]}>Open</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'in-progress' && styles.activeFilter]}
            onPress={() => setStatusFilter('in-progress')}
          >
            <Text style={[styles.filterText, statusFilter === 'in-progress' && styles.activeFilterText]}>In Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'resolved' && styles.activeFilter]}
            onPress={() => setStatusFilter('resolved')}
          >
            <Text style={[styles.filterText, statusFilter === 'resolved' && styles.activeFilterText]}>Resolved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'closed' && styles.activeFilter]}
            onPress={() => setStatusFilter('closed')}
          >
            <Text style={[styles.filterText, statusFilter === 'closed' && styles.activeFilterText]}>Closed</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tickets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        data={filteredTickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ticketList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={50} color="#D1D5DB" />
            <Text style={styles.emptyText}>No tickets found</Text>
          </View>
        }
        extraData={expandedTicket} // Add this to ensure re-renders when expandedTicket changes
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
  ticketCount: {
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
    color: '#111827',
  },
  ticketList: {
    paddingBottom: 16,
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ticketMessage: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  respondButton: {
    backgroundColor: '#3B82F6', // blue
  },
  resolveButton: {
    backgroundColor: '#10B981', // green
  },
  closeButton: {
    backgroundColor: '#EF4444', // red
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
  responsesContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  responsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  responseBubble: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  adminResponse: {
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-end',
  },
  userResponse: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  responseUser: {
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 4,
  },
  responseText: {
    fontSize: 14,
  },
  responseDate: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  responseInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  responseInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default AdminTicketsPage;