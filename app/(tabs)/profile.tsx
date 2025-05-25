import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Car, LogOut, User, CreditCard as Edit2, Mail, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState([
    { id: 1, plateNumber: 'ABC-123', name: 'Tesla Model 3' },
    { id: 2, plateNumber: 'XYZ-789', name: 'Toyota Camry' }
  ]);
  
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
    try {
      setIsLoading(true);
      await updateUser({ firstName, lastName, email });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddVehicle = () => {
    // This would be expanded in a real implementation
    Alert.alert('Add Vehicle', 'Vehicle management functionality would be implemented here');
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          {!isEditing && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={16} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
              style={styles.profileImage} 
            />
          </View>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <User size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <User size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Mail size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Text style={styles.saveButtonText}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{`${user?.firstName || ''} ${user?.lastName || ''}`}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
              
              <View style={styles.statusContainer}>
                <CheckCircle size={16} color="#4CAF50" style={styles.statusIcon} />
                <Text style={styles.statusText}>Verified Account</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Vehicles</Text>
          <TouchableOpacity onPress={handleAddVehicle}>
            <Text style={styles.addButtonText}>+ Add New</Text>
          </TouchableOpacity>
        </View>
        
        {vehicles.map(vehicle => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleIcon}>
              <Car size={24} color="#1A97B9" />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehiclePlate}>{vehicle.plateNumber}</Text>
            </View>
            <TouchableOpacity style={styles.vehicleEditButton}>
              <Edit2 size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <LogOut size={20} color="#FFFFFF" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        
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
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#0F3460',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A97B9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#4CAF50',
  },
  editForm: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    marginBottom: 16,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A97B9',
    marginLeft: 8,
  },
  saveButtonText: {
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
  addButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1A97B9',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  vehicleEditButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#0F3460',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  spacer: {
    height: 24,
  },
});