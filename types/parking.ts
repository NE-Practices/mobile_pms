export interface ParkingSpace {
  id: number;
  parkingCode: string;
  parkingName: string;
  location: string;
  availableSpaces: number;
  chargingFeePerHour: number;
}

export interface ParkingSession {
  id: number;
  parkingId: number;
  userId: number;
  entryDateTime: string;
  exitDateTime?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  plateNumber: string;
  chargedAmount?: number;
  parking: ParkingSpace;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ParkingContextType {
  getAllParkings: () => Promise<ParkingSpace[]>;
  getNearblyParkings: () => Promise<ParkingSpace[]>;
  getParkingById: (id: number) => Promise<ParkingSpace>;
  getMySessions: () => Promise<ParkingSession[]>;
  getActiveSessions: () => Promise<ParkingSession[]>;
  requestParkingEntry: (parkingCode: string, plateNumber: string) => Promise<void>;
  requestParkingExit: (sessionId: number) => Promise<void>;
  getEntryRequests: () => Promise<ParkingSession[]>;
  getExitRequests: () => Promise<ParkingSession[]>;
  approveEntry: (sessionId: number) => Promise<void>;
  rejectEntry: (sessionId: number) => Promise<void>;
  approveExit: (sessionId: number) => Promise<void>;
  rejectExit: (sessionId: number) => Promise<void>;
}