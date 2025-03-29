// app/(app)/user/tickets.tsx
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { MaterialIcons, FontAwesome, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  error: '#FF0000',
};

type Ticket = {
  _id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  responses: Array<{
    _id: string;
    sender: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
};

const UserTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/tickets/get-user-tickets', {
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

  const createNewTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/tickets/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newTicket)
      });

      if (!response.ok) throw new Error('Failed to create ticket');
      
      setNewTicket({ subject: '', message: '' });
      setShowNewTicketForm(false);
      fetchUserTickets();
      Alert.alert('Success', 'Ticket created successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create ticket');
    }
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
        body: JSON.stringify({ message: responseText })
      });

      if (!response.ok) throw new Error('Failed to submit response');
      
      handleResponseChange(ticketId, '');
      fetchUserTickets();
      Alert.alert('Success', 'Response submitted successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit response');
    }
  };

  const handleResponseChange = (ticketId: string, text: string) => {
    setResponseTexts(prev => ({ ...prev, [ticketId]: text }));
  };

  const toggleExpandTicket = (ticketId: string) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return colors.error;
      case 'in-progress': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderTicketItem = ({ item }: { item: Ticket }) => (
    <View style={styles.ticketCard}>
      <TouchableOpacity onPress={() => toggleExpandTicket(item._id)}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketSubject}>{item.subject}</Text>
          <View style={styles.headerRight}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
            <MaterialIcons 
              name={expandedTicket === item._id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
              size={24} 
              color={colors.text} 
            />
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.ticketMessage} numberOfLines={expandedTicket === item._id ? undefined : 2}>
        {item.message}
      </Text>
      
      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

      {expandedTicket === item._id && (
        <View onStartShouldSetResponder={() => true}>
          {item.responses?.length > 0 && (
            <View style={styles.responsesContainer}>
              <Text style={styles.responsesTitle}>Responses:</Text>
              {item.responses.map((response) => (
                <View 
                  key={response._id} 
                  style={[
                    styles.responseBubble,
                    response.sender === user?._id ? styles.userResponse : styles.adminResponse
                  ]}
                >
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
              placeholderTextColor={colors.text}
              value={responseTexts[item._id] || ''}
              onChangeText={(text) => handleResponseChange(item._id, text)}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={() => submitResponse(item._id)}
            >
              <MaterialIcons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading your tickets...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchUserTickets}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Support Tickets</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setShowNewTicketForm(!showNewTicketForm)}
        >
          <Text style={styles.buttonText}>
            {showNewTicketForm ? 'Cancel' : 'Create New Ticket'}
          </Text>
        </TouchableOpacity>
      </View>

      {showNewTicketForm && (
        <View style={styles.newTicketForm}>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor={colors.text}
            value={newTicket.subject}
            onChangeText={(text) => setNewTicket({...newTicket, subject: text})}
          />
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Message"
            placeholderTextColor={colors.text}
            value={newTicket.message}
            onChangeText={(text) => setNewTicket({...newTicket, message: text})}
            multiline
          />
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={createNewTicket}
          >
            <Text style={styles.buttonText}>Submit Ticket</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.ticketList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={50} color={colors.accent} />
            <Text style={styles.emptyText}>No tickets found</Text>
            <Text style={styles.emptySubText}>Create your first support ticket</Text>
          </View>
        }
        extraData={expandedTicket}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  newTicketForm: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.text,
  },
  messageInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  ticketList: {
    paddingBottom: 16,
  },
  ticketCard: {
    backgroundColor: 'white',
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
    color: colors.primary,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  ticketMessage: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  responsesContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  responsesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  responseBubble: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  adminResponse: {
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
  },
  userResponse: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-end',
  },
  responseText: {
    fontSize: 14,
    color: colors.text,
  },
  responseDate: {
    fontSize: 10,
    color: colors.text,
    opacity: 0.6,
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    textAlignVertical: 'top',
    color: colors.text,
  },
  sendButton: {
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  retryText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export default UserTicketsPage;