import React, { createContext, useState, ReactNode } from 'react';
import { ParkingContextType } from '@/types/parking';
import { parkingService } from '@/services/parkingService';

const defaultParkingContext: ParkingContextType = {
  getAllParkings: async () => [],
  getNearblyParkings: async () => [],
  getParkingById: async () => ({
    id: 0,
    parkingCode: '',
    parkingName: '',
    location: '',
    availableSpaces: 0,
    chargingFeePerHour: 0,
  }),
  getMySessions: async () => [],
  getActiveSessions: async () => [],
  requestParkingEntry: async () => {},
  requestParkingExit: async () => {},
  getEntryRequests: async () => [],
  getExitRequests: async () => [],
  approveEntry: async () => {},
  rejectEntry: async () => {},
  approveExit: async () => {},
  rejectExit: async () => {},
};

export const ParkingContext = createContext<ParkingContextType>(defaultParkingContext);

export const ParkingProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ParkingContext.Provider
      value={{
        getAllParkings: parkingService.getAllParkings,
        getNearblyParkings: parkingService.getNearblyParkings,
        getParkingById: parkingService.getParkingById,
        getMySessions: parkingService.getMySessions,
        getActiveSessions: parkingService.getActiveSessions,
        requestParkingEntry: parkingService.requestParkingEntry,
        requestParkingExit: parkingService.requestParkingExit,
        getEntryRequests: parkingService.getEntryRequests,
        getExitRequests: parkingService.getExitRequests,
        approveEntry: parkingService.approveEntry,
        rejectEntry: parkingService.rejectEntry,
        approveExit: parkingService.approveExit,
        rejectExit: parkingService.rejectExit,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};