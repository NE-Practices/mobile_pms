import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useParking } from '@/hooks/useParking';
import { ParkingSpace } from '@/types/parking';
import { ArrowLeft, Car, MapPin, Clock, CreditCard } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ParkingDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getParkingById, requestParkingEntry } = useParking();
  const router = useRouter();
  
  const [parking, setParking] = useState<ParkingSpace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plateNumber, setPlateNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadParking = async () => {
      try {
        setIsLoading(true);
        const data = await getParkingById(Number(id));
        setParking(data);
      } catch (error) {
        console.error('Error loading parking:', error);
        Alert.alert('Error', 'Failed to load parking details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      loadParking();
    }
  }, [id]);
  
  const handleBookParking = async () => {
    if (!plateNumber) {
      Alert.alert('Error', 'Please enter your license plate number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await requestParkingEntry(parking?.parkingCode || '', plateNumber);
      Alert.alert(
        'Success',
        'Parking request submitted successfully',
        [{ text: 'OK', onPress: () => router.push('/sessions') }]
      );
    } catch (error) {
      console.error('Error booking parking:', error);
      Alert.alert('Error', 'Failed to book parking');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A97B9" />
          <Text style={styles.loadingText}>Loading parking details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (!parking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Parking not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButtonIcon}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.parkingName}>{parking.parkingName}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#666" style={styles.locationIcon} />
            <Text style={styles.locationText}>{parking.location}</Text>
          </View>
        </View>
        
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Parking Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Car size={20} color="#0F3460" style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Available Spaces</Text>
                <Text style={styles.detailValue}>{parking.availableSpaces}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <CreditCard size={20} color="#0F3460" style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Fee</Text>
                <Text style={styles.detailValue}>${parking.chargingFeePerHour}/hour</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Clock size={20} color="#0F3460" style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Hours</Text>
                <Text style={styles.detailValue}>24/7</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>Book a Spot</Text>
          
          <View style={styles.inputContainer}>
            <Car size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter license plate number"
              placeholderTextColor="#999"
              value={plateNumber}
              onChangeText={setPlateNumber}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.bookButton,
              { backgroundColor: parking.availableSpaces > 0 ? '#1A97B9' : '#CCCCCC' }
            ]}
            onPress={handleBookParking}
            disabled={parking.availableSpaces === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.bookButtonText}>
                {parking.availableSpaces > 0 ? 'Request Parking' : 'No Spaces Available'}
              </Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.infoText}>
            Note: Your request will be reviewed by the parking admin.
            You will receive a notification once your request is approved.
          </Text>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#F44336',
    marginBottom: 16,
  },
  backButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    backgroundColor: '#1A97B9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  header: {
    marginBottom: 24,
  },
  parkingName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#0F3460',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 12,
  },
  detailLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  bookButton: {
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  spacer: {
    height: 24,
  },
});