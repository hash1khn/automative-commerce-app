// app/(app)/admin/tickets/[id].tsx
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  responses: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
};

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const authToken = await AsyncStorage.getItem('authToken');
        
        const response = await fetch(`https://automative-commerce-app-production.up.railway.app/api/tickets/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) throw new Error('Failed to fetch ticket');
        
        const data = await response.json();
        setTicket(data);
      } catch (error) {
        Alert.alert('Error', error instanceof Error ? error.message : 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const updateTicketStatus = async (newStatus: 'resolved' | 'closed') => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const endpoint = newStatus === 'resolved' 
        ? `resolve` 
        : `close`;
      
      const response = await fetch(
        `https://automative-commerce-app-production.up.railway.app/api/tickets/${id}/${endpoint}`, 
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) throw new Error(`Failed to ${endpoint} ticket`);
      
      Alert.alert('Success', `Ticket has been ${newStatus}`);
      // Refresh ticket data
      const updatedData = await response.json();
      setTicket(updatedData);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : `Failed to ${newStatus} ticket`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Text>Ticket not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
            <Text style={styles.statusText}>{ticket.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.date}>Created: {formatDate(ticket.createdAt)}</Text>
        </View>
        
        <Text style={styles.subject}>{ticket.subject}</Text>
        
        <View style={styles.userInfo}>
          <FontAwesome name="user" size={16} color="#6B7280" />
          <Text style={styles.userText}>
            {ticket.user.name} ({ticket.user.email})
          </Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.messageLabel}>Original Message:</Text>
        <Text style={styles.messageText}>{ticket.message}</Text>
      </View>

      {ticket.responses.length > 0 && (
        <View style={styles.responsesContainer}>
          <Text style={styles.sectionTitle}>Responses</Text>
          {ticket.responses.map((response) => (
            <View 
              key={response._id} 
              style={[
                styles.responseBubble,
                response.user._id === user?._id ? styles.adminResponse : styles.userResponse
              ]}
            >
              <Text style={styles.responseUser}>{response.user.name}</Text>
              <Text style={styles.responseText}>{response.message}</Text>
              <Text style={styles.responseDate}>{formatDate(response.createdAt)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.respondButton]}
          onPress={() => router.push(`/admin/tickets/${id}/respond`)}
        >
          <Ionicons name="chatbubble-ellipses" size={20} color="white" />
          <Text style={styles.buttonText}>Respond</Text>
        </TouchableOpacity>

        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <TouchableOpacity
            style={[styles.button, styles.resolveButton]}
            onPress={() => updateTicketStatus('resolved')}
          >
            <Feather name="check-circle" size={20} color="white" />
            <Text style={styles.buttonText}>Mark Resolved</Text>
          </TouchableOpacity>
        )}

        {ticket.status !== 'closed' && (
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => updateTicketStatus('closed')}
          >
            <MaterialIcons name="close" size={20} color="white" />
            <Text style={styles.buttonText}>Close Ticket</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  subject: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userText: {
    fontSize: 16,
    color: '#6B7280',
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 1,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  responsesContainer: {
    marginBottom: 24,
  },
  responseBubble: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    maxWidth: '80%',
  },
  adminResponse: {
    alignSelf: 'flex-end',
    backgroundColor: '#EFF6FF',
    borderTopRightRadius: 0,
  },
  userResponse: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 0,
  },
  responseUser: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  responseText: {
    color: '#374151',
    marginBottom: 4,
  },
  responseDate: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    minWidth: '48%',
  },
  respondButton: {
    backgroundColor: '#3B82F6',
  },
  resolveButton: {
    backgroundColor: '#10B981',
  },
  closeButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});