import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useParking } from '@/hooks/useParking';
import { ParkingSession } from '@/types/parking';
import { Car, Clock, CircleCheck as CheckCircle, Circle as XCircle, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SessionsScreen() {
  const { getMySessions, requestParkingExit } = useParking();
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  
  useEffect(() => {
    loadSessions();
  }, []);
  
  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await getMySessions();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRequestExit = async (sessionId: number) => {
    try {
      setProcessingIds(prev => [...prev, sessionId]);
      await requestParkingExit(sessionId);
      // Refresh the sessions list
      loadSessions();
    } catch (error) {
      console.error('Error requesting exit:', error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== sessionId));
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#FF9800';
      case 'APPROVED': return '#4CAF50';
      case 'REJECTED': return '#F44336';
      case 'COMPLETED': return '#2196F3';
      default: return '#999';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'REJECTED':
        return <XCircle size={16} color="#F44336" />;
      case 'PENDING':
        return <Clock size={16} color="#FF9800" />;
      case 'COMPLETED':
        return <CheckCircle size={16} color="#2196F3" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const renderSessionItem = ({ item }: { item: ParkingSession }) => {
    const isProcessing = processingIds.includes(item.id);
    const isActive = item.status === 'APPROVED' && !item.exitDateTime;
    
    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Text style={styles.parkingName}>{item.parking.parkingName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <View style={styles.statusIconContainer}>
              {getStatusIcon(item.status)}
            </View>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Clock size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailText}>Entry: {formatDate(item.entryDateTime)}</Text>
          </View>
        </View>
        
        {item.exitDateTime && (
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <ArrowRight size={16} color="#666" style={styles.detailIcon} />
              <Text style={styles.detailText}>Exit: {formatDate(item.exitDateTime)}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Car size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailText}>Plate: {item.plateNumber}</Text>
          </View>
        </View>
        
        {item.chargedAmount && (
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Fee:</Text>
            <Text style={styles.feeAmount}>${item.chargedAmount.toFixed(2)}</Text>
          </View>
        )}
        
        {isActive && (
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => handleRequestExit(item.id)}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.exitButtonText}>Request Exit</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Parking Sessions</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A97B9" />
            <Text style={styles.loadingText}>Loading sessions...</Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderSessionItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No parking sessions found</Text>
                <Text style={styles.emptySubtext}>Book a parking space to get started</Text>
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
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  parkingName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusIconContainer: {
    marginRight: 4,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  detailRow: {
    marginBottom: 12,
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
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
  exitButton: {
    backgroundColor: '#0F3460',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  exitButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});