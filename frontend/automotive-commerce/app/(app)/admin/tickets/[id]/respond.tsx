// app/(app)/admin/tickets/[id]/respond.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
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
  status: string;
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

export default function RespondTicketScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const authToken = await AsyncStorage.getItem('authToken');
        
        const res = await fetch(`https://automative-commerce-app-production.up.railway.app/api/tickets/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!res.ok) throw new Error('Failed to fetch ticket');
        
        const data = await res.json();
        setTicket(data);
      } catch (error) {
        Alert.alert('Error', error instanceof Error ? error.message : 'Failed to load ticket');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      Alert.alert('Error', 'Please enter a response');
      return;
    }

    try {
      setSubmitting(true);
      const authToken = await AsyncStorage.getItem('authToken');
      
      const res = await fetch(`https://automative-commerce-app-production.up.railway.app/api/tickets/${id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ message: response })
      });

      if (!res.ok) throw new Error('Failed to submit response');
      
      Alert.alert('Success', 'Response submitted successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading ticket...</Text>
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
      <View style={styles.ticketHeader}>
        <Text style={styles.subject}>{ticket.subject}</Text>
        <Text style={styles.date}>Created: {formatDate(ticket.createdAt)}</Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{ticket.user.name}</Text>
        <Text style={styles.userEmail}>{ticket.user.email}</Text>
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{ticket.message}</Text>
      </View>

      {ticket.responses.length > 0 && (
        <View style={styles.responsesContainer}>
          <Text style={styles.responsesTitle}>Previous Responses</Text>
          {ticket.responses.map((res) => (
            <View key={res._id} style={[
              styles.responseBubble,
              res.user._id === user?._id ? styles.adminResponse : styles.userResponse
            ]}>
              <Text style={styles.responseUser}>{res.user.name}</Text>
              <Text style={styles.responseText}>{res.message}</Text>
              <Text style={styles.responseDate}>{formatDate(res.createdAt)}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.responseInputContainer}>
        <TextInput
          style={styles.responseInput}
          placeholder="Type your response here..."
          value={response}
          onChangeText={setResponse}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <MaterialIcons name="send" size={20} color="white" />
        <Text style={styles.submitButtonText}>
          {submitting ? 'Sending...' : 'Send Response'}
        </Text>
      </TouchableOpacity>
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
  ticketHeader: {
    marginBottom: 16,
  },
  subject: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  responsesContainer: {
    marginBottom: 24,
  },
  responsesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
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
  responseInputContainer: {
    marginBottom: 16,
  },
  responseInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});