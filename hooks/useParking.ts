import { useContext } from 'react';
import { ParkingContext } from '@/context/ParkingContext';

export const useParking = () => {
  const context = useContext(ParkingContext);
  
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  
  return context;
};