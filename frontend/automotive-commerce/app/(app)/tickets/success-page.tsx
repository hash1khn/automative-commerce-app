// app/(app)/support/success-page.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const colors = {
  primary: '#373D20',
  secondary: '#717744',
  accent: '#BCBD8B',
  background: '#F5F5F5',
  text: '#766153',
  success: '#4BB543',
};

export default function TicketSuccessPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="check-circle" size={80} color={colors.success} />
        </View>
        
        <Text style={styles.title}>Ticket Submitted Successfully!</Text>
        
        <Text style={styles.message}>
          Thank you for contacting us. Your support ticket has been received and we'll get back to you soon.
        </Text>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Reference ID:</Text> TKT-{Math.floor(Math.random() * 1000000)}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Expected Response:</Text> Within 24 hours
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.buttonText}>Go to my Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  details: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
    marginBottom: 25,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
});