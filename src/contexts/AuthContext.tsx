'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'patient@example.com',
    password: 'password',
    name: 'John Smith',
    role: 'patient',
    avatar: '/avatars/patient.jpg',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'doctor@hospital.com',
    password: 'password',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    avatar: '/avatars/doctor.jpg',
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'admin@hospital.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
    avatar: '/avatars/admin.jpg',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hqms_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('hqms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email and password
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      const userData = {
        ...userWithoutPassword,
        lastLogin: new Date()
      };
      
      setUser(userData);
      localStorage.setItem('hqms_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    } else {
      // If exact match not found, use email-based role detection (fallback)
      let role: 'patient' | 'doctor' | 'admin' = 'patient';
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('doctor')) role = 'doctor';
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role,
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      setUser(userData);
      localStorage.setItem('hqms_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    }
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return false; // User already exists
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || 'patient',
      avatar: userData.avatar,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    // Add to mock users (in real app, this would be an API call)
    mockUsers.push({ ...newUser, password: userData.password });
    
    setUser(newUser);
    localStorage.setItem('hqms_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hqms_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('hqms_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    signup,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}