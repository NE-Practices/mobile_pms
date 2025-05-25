import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Search, MapPin, Car, CircleCheck } from 'lucide-react-native';
import { useParking } from '@/hooks/useParking';
import { ParkingSpace } from '@/types/parking';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ParkingsScreen() {
  const { getAllParkings } = useParking();
  const router = useRouter();
  
  const [parkings, setParkings] = useState<ParkingSpace[]>([]);
  const [filteredParkings, setFilteredParkings] = useState<ParkingSpace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadParkings = async () => {
      try {
        const data = await getAllParkings();
        setParkings(data);
        setFilteredParkings(data);
      } catch (error) {
        console.error('Error loading parkings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadParkings();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = parkings.filter(
        parking => 
          parking.parkingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parking.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredParkings(filtered);
    } else {
      setFilteredParkings(parkings);
    }
  }, [searchQuery, parkings]);
  
  const renderParkingItem = ({ item }: { item: ParkingSpace }) => (
    <TouchableOpacity 
      style={styles.parkingCard}
      onPress={() => router.push(`/parkings/${item.id}`)}
    >
      <View style={styles.parkingHeader}>
        <Text style={styles.parkingTitle}>{item.parkingName}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.availableSpaces > 0 ? '#E7F3E8' : '#FFEBEE' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.availableSpaces > 0 ? '#4CAF50' : '#F44336' }
          ]}>
            {item.availableSpaces > 0 ? 'Available' : 'Full'}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationRow}>
        <MapPin size={16} color="#666" style={styles.locationIcon} />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Car size={16} color="#0F3460" style={styles.detailIcon} />
          <Text style={styles.detailText}>{item.availableSpaces} spaces</Text>
        </View>
        <Text style={styles.feeText}>${item.chargingFeePerHour}/hour</Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.bookButton,
          { backgroundColor: item.availableSpaces > 0 ? '#1A97B9' : '#CCCCCC' }
        ]}
        disabled={item.availableSpaces === 0}
        onPress={() => router.push(`/parkings/${item.id}`)}
      >
        <Text style={styles.bookButtonText}>
          {item.availableSpaces > 0 ? 'Book Now' : 'No Spaces'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find Parking</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A97B9" />
            <Text style={styles.loadingText}>Loading parking spaces...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredParkings}
            renderItem={renderParkingItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No parking spaces found</Text>
              </View>
            }
          />
        )}
      </View>
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
    marginTop: 8,
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0F3460',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
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
  listContainer: {
    paddingBottom: 24,
  },
  parkingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  parkingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parkingTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  feeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#0F3460',
  },
  bookButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
  },
});