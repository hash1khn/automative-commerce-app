// app/(app)/support/new-ticket.tsx
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewTicketScreen = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const authToken = await AsyncStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          subject,
          description,
          userId: user?._id
        })
      });

      if (!response.ok) throw new Error('Failed to submit ticket');
      
      Alert.alert('Success', 'Your support ticket has been submitted');
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Support Ticket</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Describe your issue"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitting || !subject || !description}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#373D20',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#373D20',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewTicketScreen;