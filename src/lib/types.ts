export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  insurance: string;
  medicalRecord: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  department: string;
  avatar?: string;
  available: boolean;
}

export interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  departmentId: string;
  position: number;
  estimatedWait: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'skipped';
  joinedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
}