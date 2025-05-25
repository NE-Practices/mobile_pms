import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User, UpdateUserData } from '@/types/auth';
import { authService } from '@/services/authService';

const defaultAuthContext: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from AsyncStorage
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@auth_token');
        const storedUser = await AsyncStorage.getItem('@user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call
      const { user, token } = await authService.login(email, password);
      
      // Store user and token in AsyncStorage
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      
      setUser(user);
      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would make an API call
      const { user, token } = await authService.register(firstName, lastName, email, password);
      
      // Store user and token in AsyncStorage
      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user', JSON.stringify(user));
      
      setUser(user);
      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.removeItem('@auth_token');
      await AsyncStorage.removeItem('@user');
      
      // Reset state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = async (data: UpdateUserData) => {
    try {
      setLoading(true);
      
      // In a real app, this would make an API call
      const updatedUser = await authService.updateUser(data);
      
      // Update AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
    } catch (error) {
      setError('Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};