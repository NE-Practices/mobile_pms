import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Car, Clock, CircleCheck, Timer } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useParking } from '@/hooks/useParking';
import { ParkingSpace } from '@/types/parking';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const { getNearblyParkings, getActiveSessions } = useParking();
  const router = useRouter();
  
  const [nearbyParkings, setNearbyParkings] = useState<ParkingSpace[]>([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const parkings = await getNearblyParkings();
        setNearbyParkings(parkings.slice(0, 3));
        
        const sessions = await getActiveSessions();
        setActiveSessions(sessions);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.firstName || 'User'}</Text>
          </View>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
              style={styles.profileImage} 
            />
          </View>
        </View>

        {activeSessions.length > 0 && (
          <View style={styles.activeSessionCard}>
            <View style={styles.activeSessionHeader}>
              <View style={styles.iconContainer}>
                <Timer size={20} color="#FFF" />
              </View>
              <Text style={styles.activeSessionTitle}>Active Parking Session</Text>
            </View>
            <View style={styles.activeSessionDetails}>
              <Text style={styles.parkingName}>Central City Parking</Text>
              <View style={styles.sessionInfo}>
                <Clock size={16} color="#666" style={styles.infoIcon} />
                <Text style={styles.infoText}>Started 2 hours ago</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Car size={16} color="#666" style={styles.infoIcon} />
                <Text style={styles.infoText}>ABC-123</Text>
              </View>
              <View style={styles.feeContainer}>
                <Text style={styles.feeLabel}>Current Fee:</Text>
                <Text style={styles.feeAmount}>$4.00</Text>
              </View>
              <TouchableOpacity 
                style={styles.endSessionButton}
                onPress={() => router.push('/sessions')}
              >
                <Text style={styles.endSessionButtonText}>End Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Parking</Text>
          <TouchableOpacity onPress={() => router.push('/parkings')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading parking spaces...</Text>
          </View>
        ) : (
          <>
            {nearbyParkings.map((parking, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.parkingCard}
                onPress={() => router.push(`/parkings/${parking.id}`)}
              >
                <View style={styles.parkingInfo}>
                  <Text style={styles.parkingTitle}>{parking.parkingName}</Text>
                  <Text style={styles.parkingLocation}>{parking.location}</Text>
                  <View style={styles.parkingDetails}>
                    <View style={styles.detailItem}>
                      <Car size={16} color="#0F3460" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{parking.availableSpaces} spaces</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <CircleCheck size={16} color={parking.availableSpaces > 0 ? '#4CAF50' : '#F44336'} style={styles.detailIcon} />
                      <Text style={[styles.detailText, { color: parking.availableSpaces > 0 ? '#4CAF50' : '#F44336' }]}>
                        {parking.availableSpaces > 0 ? 'Available' : 'Full'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeText}>${parking.chargingFeePerHour}/hour</Text>
                  </View>
                </View>
                <View style={styles.availabilityIndicator}>
                  <Text style={styles.availabilityText}>{parking.availableSpaces}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Car size={20} color="#1A97B9" />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Downtown Parking</Text>
            <Text style={styles.activityTime}>Yesterday, 2:30 PM</Text>
          </View>
          <Text style={styles.activityAmount}>$8.50</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityIcon}>
            <Car size={20} color="#1A97B9" />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Mall Parking</Text>
            <Text style={styles.activityTime}>Aug 22, 10:15 AM</Text>
          </View>
          <Text style={styles.activityAmount}>$5.25</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#0F3460',
  },
  profileImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  activeSessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeSessionHeader: {
    backgroundColor: '#1A97B9',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeSessionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  activeSessionDetails: {
    padding: 16,
  },
  parkingName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  feeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
  },
  feeAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#0F3460',
  },
  endSessionButton: {
    backgroundColor: '#0F3460',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endSessionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#0F3460',
  },
  seeAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1A97B9',
  },
  loadingContainer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  parkingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  parkingInfo: {
    flex: 1,
  },
  parkingTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  parkingLocation: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  parkingDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    marginRight: 4,
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  feeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#0F3460',
  },
  availabilityIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  availabilityText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#1A97B9',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  activityAmount: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#0F3460',
  },
  spacer: {
    height: 24,
  },
});