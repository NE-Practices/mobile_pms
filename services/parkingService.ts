import { ParkingSpace, ParkingSession } from '@/types/parking';
import { API_BASE_URL } from '@/config/constants';

// Mock data for demonstration purposes
const mockParkings: ParkingSpace[] = [
  {
    id: 1,
    parkingCode: 'PKG001',
    parkingName: 'Central City Parking',
    location: '123 Main Street, Downtown',
    availableSpaces: 15,
    chargingFeePerHour: 2.5,
  },
  {
    id: 2,
    parkingCode: 'PKG002',
    parkingName: 'Metro Mall Parking',
    location: '456 Commerce Ave, Eastside',
    availableSpaces: 0,
    chargingFeePerHour: 3.0,
  },
  {
    id: 3,
    parkingCode: 'PKG003',
    parkingName: 'Riverside Parking',
    location: '789 Waterfront Dr, Westside',
    availableSpaces: 8,
    chargingFeePerHour: 2.0,
  },
  {
    id: 4,
    parkingCode: 'PKG004',
    parkingName: 'North Station Parking',
    location: '101 Transit Way, Northside',
    availableSpaces: 5,
    chargingFeePerHour: 1.5,
  },
  {
    id: 5,
    parkingCode: 'PKG005',
    parkingName: 'Grand Plaza Parking',
    location: '202 Plaza Blvd, Southside',
    availableSpaces: 10,
    chargingFeePerHour: 4.0,
  },
];

let mockSessions: ParkingSession[] = [
  {
    id: 1,
    parkingId: 1,
    userId: 1,
    entryDateTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'APPROVED',
    plateNumber: 'ABC-123',
    parking: mockParkings[0],
    user: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
  },
];

let nextSessionId = 2;

export const parkingService = {
  getAllParkings: async (): Promise<ParkingSpace[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockParkings]);
      }, 1000);
    });
  },
  
  getNearblyParkings: async (): Promise<ParkingSpace[]> => {
    // In a real app, this would filter based on user location
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockParkings]);
      }, 1000);
    });
  },
  
  getParkingById: async (id: number): Promise<ParkingSpace> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const parking = mockParkings.find((p) => p.id === id);
        
        if (parking) {
          resolve({ ...parking });
        } else {
          reject(new Error('Parking not found'));
        }
      }, 500);
    });
  },
  
  getMySessions: async (): Promise<ParkingSession[]> => {
    // In a real app, this would filter based on authenticated user
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockSessions]);
      }, 1000);
    });
  },
  
  getActiveSessions: async (): Promise<ParkingSession[]> => {
    // In a real app, this would filter based on authenticated user and active status
    return new Promise((resolve) => {
      setTimeout(() => {
        const activeSessions = mockSessions.filter(
          (s) => s.status === 'APPROVED' && !s.exitDateTime
        );
        resolve([...activeSessions]);
      }, 1000);
    });
  },
  
  requestParkingEntry: async (parkingCode: string, plateNumber: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const parking = mockParkings.find((p) => p.parkingCode === parkingCode);
        
        if (!parking) {
          reject(new Error('Parking not found'));
          return;
        }
        
        if (parking.availableSpaces <= 0) {
          reject(new Error('No available parking spaces'));
          return;
        }
        
        const newSession: ParkingSession = {
          id: nextSessionId++,
          parkingId: parking.id,
          userId: 1, // Current user ID
          entryDateTime: new Date().toISOString(),
          status: 'PENDING',
          plateNumber,
          parking,
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
        };
        
        mockSessions.push(newSession);
        resolve();
      }, 1000);
    });
  },
  
  requestParkingExit: async (sessionId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
        
        if (sessionIndex === -1) {
          reject(new Error('Session not found'));
          return;
        }
        
        const session = { ...mockSessions[sessionIndex] };
        
        if (session.status !== 'APPROVED') {
          reject(new Error('Cannot request exit for non-approved session'));
          return;
        }
        
        if (session.exitDateTime) {
          reject(new Error('Exit already requested'));
          return;
        }
        
        // Calculate hours parked
        const entryTime = new Date(session.entryDateTime).getTime();
        const exitTime = Date.now();
        const hoursParked = (exitTime - entryTime) / (1000 * 60 * 60);
        
        // Calculate fee
        const fee = hoursParked * session.parking.chargingFeePerHour;
        
        session.exitDateTime = new Date().toISOString();
        session.chargedAmount = Math.round(fee * 100) / 100; // Round to 2 decimal places
        
        mockSessions[sessionIndex] = session;
        resolve();
      }, 1000);
    });
  },
  
  getEntryRequests: async (): Promise<ParkingSession[]> => {
    // In a real app, this would be accessible only to admins
    return new Promise((resolve) => {
      setTimeout(() => {
        const entryRequests = mockSessions.filter((s) => s.status === 'PENDING');
        resolve([...entryRequests]);
      }, 1000);
    });
  },
  
  getExitRequests: async (): Promise<ParkingSession[]> => {
    // In a real app, this would be accessible only to admins
    return new Promise((resolve) => {
      setTimeout(() => {
        const exitRequests = mockSessions.filter(
          (s) => s.status === 'APPROVED' && s.exitDateTime && !s.chargedAmount
        );
        resolve([...exitRequests]);
      }, 1000);
    });
  },
  
  approveEntry: async (sessionId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
        
        if (sessionIndex === -1) {
          reject(new Error('Session not found'));
          return;
        }
        
        const session = { ...mockSessions[sessionIndex] };
        
        if (session.status !== 'PENDING') {
          reject(new Error('Cannot approve non-pending session'));
          return;
        }
        
        session.status = 'APPROVED';
        
        // Reduce available spaces
        const parkingIndex = mockParkings.findIndex((p) => p.id === session.parkingId);
        if (parkingIndex !== -1) {
          mockParkings[parkingIndex] = {
            ...mockParkings[parkingIndex],
            availableSpaces: Math.max(0, mockParkings[parkingIndex].availableSpaces - 1),
          };
        }
        
        mockSessions[sessionIndex] = session;
        resolve();
      }, 1000);
    });
  },
  
  rejectEntry: async (sessionId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
        
        if (sessionIndex === -1) {
          reject(new Error('Session not found'));
          return;
        }
        
        const session = { ...mockSessions[sessionIndex] };
        
        if (session.status !== 'PENDING') {
          reject(new Error('Cannot reject non-pending session'));
          return;
        }
        
        session.status = 'REJECTED';
        mockSessions[sessionIndex] = session;
        resolve();
      }, 1000);
    });
  },
  
  approveExit: async (sessionId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
        
        if (sessionIndex === -1) {
          reject(new Error('Session not found'));
          return;
        }
        
        const session = { ...mockSessions[sessionIndex] };
        
        if (session.status !== 'APPROVED' || !session.exitDateTime) {
          reject(new Error('Cannot approve exit for invalid session'));
          return;
        }
        
        session.status = 'COMPLETED';
        
        // Increase available spaces
        const parkingIndex = mockParkings.findIndex((p) => p.id === session.parkingId);
        if (parkingIndex !== -1) {
          mockParkings[parkingIndex] = {
            ...mockParkings[parkingIndex],
            availableSpaces: mockParkings[parkingIndex].availableSpaces + 1,
          };
        }
        
        mockSessions[sessionIndex] = session;
        resolve();
      }, 1000);
    });
  },
  
  rejectExit: async (sessionId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const sessionIndex = mockSessions.findIndex((s) => s.id === sessionId);
        
        if (sessionIndex === -1) {
          reject(new Error('Session not found'));
          return;
        }
        
        const session = { ...mockSessions[sessionIndex] };
        
        if (session.status !== 'APPROVED' || !session.exitDateTime) {
          reject(new Error('Cannot reject exit for invalid session'));
          return;
        }
        
        // Reset exit date and fee
        session.exitDateTime = undefined;
        session.chargedAmount = undefined;
        
        mockSessions[sessionIndex] = session;
        resolve();
      }, 1000);
    });
  },
};