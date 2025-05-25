import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useParking } from '@/hooks/useParking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Car, User } from 'lucide-react-native';

export default function AdminScreen() {
  const { user } = useAuth();
  const { getEntryRequests, getExitRequests, approveEntry, rejectEntry, approveExit, rejectExit } = useParking();
  
  const [entryRequests, setEntryRequests] = useState([]);
  const [exitRequests, setExitRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      Alert.alert('Unauthorized', 'You do not have permission to access this page');
      return;
    }
    
    loadRequests();
  }, [user]);
  
  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const entryData = await getEntryRequests();
      const exitData = await getExitRequests();
      
      setEntryRequests(entryData);
      setExitRequests(exitData);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveEntry = async (sessionId: number) => {
    try {
      setProcessingId(sessionId);
      await approveEntry(sessionId);
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve entry request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRejectEntry = async (sessionId: number) => {
    try {
      setProcessingId(sessionId);
      await rejectEntry(sessionId);
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject entry request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleApproveExit = async (sessionId: number) => {
    try {
      setProcessingId(sessionId);
      await approveExit(sessionId);
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to approve exit request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const handleRejectExit = async (sessionId: number) => {
    try {
      setProcessingId(sessionId);
      await rejectExit(sessionId);
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject exit request');
    } finally {
      setProcessingId(null);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1A97B9" />
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{entryRequests.length}</Text>
                <Text style={styles.statLabel}>Entry Requests</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{exitRequests.length}</Text>
                <Text style={styles.statLabel}>Exit Requests</Text>
              </View>
            </View>
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Entry Requests</Text>
            </View>
            
            {entryRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No entry requests pending</Text>
              </View>
            ) : (
              entryRequests.map((request: any) => (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.parkingName}>{request.parking.parkingName}</Text>
                    <View style={styles.statusBadge}>
                      <Clock size={16} color="#FF9800" style={styles.statusIcon} />
                      <Text style={styles.statusText}>PENDING</Text>
                    </View>
                  </View>
                  
                  <View style={styles.userInfo}>
                    <User size={16} color="#666" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{`${request.user.firstName} ${request.user.lastName}`}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Clock size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>Requested: {formatDate(request.entryDateTime)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Car size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>Plate: {request.plateNumber}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleRejectEntry(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <XCircle size={16} color="#FFFFFF" style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Reject</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApproveEntry(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <CheckCircle size={16} color="#FFFFFF" style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Approve</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exit Requests</Text>
            </View>
            
            {exitRequests.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No exit requests pending</Text>
              </View>
            ) : (
              exitRequests.map((request: any) => (
                <View key={request.id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.parkingName}>{request.parking.parkingName}</Text>
                    <View style={styles.statusBadge}>
                      <Clock size={16} color="#FF9800" style={styles.statusIcon} />
                      <Text style={styles.statusText}>EXIT PENDING</Text>
                    </View>
                  </View>
                  
                  <View style={styles.userInfo}>
                    <User size={16} color="#666" style={styles.infoIcon} />
                    <Text style={styles.infoText}>{`${request.user.firstName} ${request.user.lastName}`}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Clock size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>Entry: {formatDate(request.entryDateTime)}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Car size={16} color="#666" style={styles.detailIcon} />
                      <Text style={styles.detailText}>Plate: {request.plateNumber}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.feeContainer}>
                    <Text style={styles.feeLabel}>Fee:</Text>
                    <Text style={styles.feeAmount}>${(request.chargedAmount || 0).toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleRejectExit(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <XCircle size={16} color="#FFFFFF" style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Reject</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApproveExit(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <CheckCircle size={16} color="#FFFFFF" style={styles.buttonIcon} />
                          <Text style={styles.buttonText}>Approve</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            
            <View style={styles.spacer} />
          </>
        )}
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
    padding: 24,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0F3460',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#0F3460',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  parkingName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FF9800',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
  },
  detailRow: {
    marginBottom: 8,
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
    marginVertical: 12,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F44336',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  approveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  spacer: {
    height: 24,
  },
});