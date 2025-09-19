export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Patient extends User {
  role: 'patient';
  phone: string;
  dateOfBirth: Date;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  medicalHistory: string[];
  allergies: string[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  department: string;
  licenseNumber: string;
  phone: string;
  availability: {
    [key: string]: { // day of week
      start: string;
      end: string;
      available: boolean;
    };
  };
  experience: number; // years
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
  department?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  dateTime: Date;
  duration: number; // minutes
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueueEntry {
  id: string;
  patientId: string;
  doctorId: string;
  departmentId: string;
  queueNumber: number;
  joinTime: Date;
  estimatedWaitTime: number; // minutes
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'waiting' | 'called' | 'in-consultation' | 'completed' | 'skipped';
  appointmentId?: string; // if this is for a scheduled appointment
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  floor: number;
  room: string;
  phone: string;
  openHours: {
    [key: string]: {
      start: string;
      end: string;
      open: boolean;
    };
  };
  doctors: string[]; // doctor IDs
  currentQueue: string[]; // queue entry IDs
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'queue' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
}

export interface AppContextType {
  // Patient data
  appointments: Appointment[];
  queueEntries: QueueEntry[];
  
  // Doctor data
  patients: Patient[];
  schedule: Appointment[];
  
  // Admin data
  allUsers: User[];
  departments: Department[];
  allAppointments: Appointment[];
  allQueues: QueueEntry[];
  
  // Notifications
  notifications: Notification[];
  
  // Actions
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  joinQueue: (queueData: Omit<QueueEntry, 'id' | 'queueNumber' | 'joinTime' | 'estimatedWaitTime'>) => Promise<boolean>;
  leaveQueue: (queueId: string) => Promise<boolean>;
  callNextPatient: (doctorId: string) => Promise<QueueEntry | null>;
  markPatientDone: (queueId: string) => Promise<boolean>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  
  // Real-time updates
  refreshData: () => void;
}