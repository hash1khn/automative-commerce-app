// app/(app)/add-review/[id].tsx
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { Rating } from 'react-native-ratings';

const AddReviewScreen = () => {
  const { id: orderId } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:5000/api/reviews/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment: reviewText
        })
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      Alert.alert('Success', 'Thank you for your review!');
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Order</Text>
      
      <Rating
        type='star'
        ratingCount={5}
        imageSize={40}
        startingValue={rating}
        onFinishRating={setRating}
        style={styles.ratingContainer}
        tintColor="#fff" // Background color for the rating component
      />

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Write your review..."
        value={reviewText}
        onChangeText={setReviewText}
      />

      <TouchableOpacity
        style={[styles.submitButton, (isSubmitting || rating === 0) && styles.disabledButton]}
        onPress={handleSubmitReview}
        disabled={isSubmitting || rating === 0}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
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
    textAlign: 'center',
  },
  ratingContainer: {
    marginVertical: 20,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
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
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default AddReviewScreen;