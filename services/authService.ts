import { User, UpdateUserData } from '@/types/auth';
import { API_BASE_URL } from '@/config/constants';

// Mock data for demonstration purposes
const mockUsers = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'USER',
  },
  {
    id: 2,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
  },
];

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({
            user: userWithoutPassword as User,
            token: 'mock-jwt-token',
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },
  
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find((u) => u.email === email);
        
        if (existingUser) {
          reject(new Error('User already exists'));
        } else {
          const newUser = {
            id: mockUsers.length + 1,
            firstName,
            lastName,
            email,
            role: 'USER' as const,
          };
          
          resolve({
            user: newUser,
            token: 'mock-jwt-token',
          });
        }
      }, 1000);
    });
  },
  
  updateUser: async (data: UpdateUserData): Promise<User> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: 1,
          firstName: data.firstName || 'John',
          lastName: data.lastName || 'Doe',
          email: data.email || 'john@example.com',
          role: 'USER' as const,
          profilePicture: data.profilePicture,
        };
        
        resolve(user);
      }, 1000);
    });
  },
};