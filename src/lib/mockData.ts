export const mockPatients = [
  {
    id: '1',
    email: 'patient@example.com',
    name: 'John Smith',
    role: 'patient',
    phone: '+1-555-0101',
    dateOfBirth: new Date('1985-06-15'),
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1-555-0102',
      relationship: 'Spouse'
    },
    insurance: {
      provider: 'HealthFirst Insurance',
      policyNumber: 'HF123456789',
      groupNumber: 'GRP001'
    },
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin', 'Shellfish'],
    createdAt: new Date('2024-01-15'),
    lastVisit: new Date('2024-12-01')
  },
  {
    id: '2',
    email: 'mary.johnson@email.com',
    name: 'Mary Johnson',
    role: 'patient',
    phone: '+1-555-0201',
    dateOfBirth: new Date('1990-03-22'),
    address: '456 Oak Ave, Springfield, ST 54321',
    emergencyContact: {
      name: 'Robert Johnson',
      phone: '+1-555-0202',
      relationship: 'Husband'
    },
    insurance: {
      provider: 'MediCare Plus',
      policyNumber: 'MC987654321',
      groupNumber: 'GRP002'
    },
    medicalHistory: ['Asthma'],
    allergies: ['Peanuts'],
    createdAt: new Date('2024-02-10'),
    lastVisit: new Date('2024-11-28')
  }
];

export const mockDoctors = [
  {
    id: 'doc1',
    email: 'doctor@hospital.com',
    name: 'Dr. Sarah Smith',
    role: 'doctor',
    specialization: 'Cardiology',
    licenseNumber: 'MD123456',
    department: 'Cardiology',
    phone: '+1-555-1001',
    schedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '15:00' }
    },
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-12-03')
  },
  {
    id: 'doc2',
    email: 'dr.michael.brown@hospital.com',
    name: 'Dr. Michael Brown',
    role: 'doctor',
    specialization: 'Orthopedics',
    licenseNumber: 'MD789012',
    department: 'Orthopedics',
    phone: '+1-555-1002',
    schedule: {
      monday: { start: '08:00', end: '16:00' },
      tuesday: { start: '08:00', end: '16:00' },
      wednesday: { start: '08:00', end: '16:00' },
      thursday: { start: '08:00', end: '16:00' },
      friday: { start: '08:00', end: '14:00' }
    },
    createdAt: new Date('2023-03-10'),
    lastLogin: new Date('2024-12-03')
  }
];

export const mockAdmins = [
  {
    id: 'admin1',
    email: 'admin@hospital.com',
    name: 'Admin Manager',
    role: 'admin',
    permissions: ['user_management', 'system_settings', 'reports', 'queue_management'],
    department: 'Administration',
    phone: '+1-555-2001',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2024-12-03')
  }
];

export const mockDepartments = [
  {
    id: 'dept1',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system care',
    head: 'Dr. Sarah Smith',
    location: 'Building A, Floor 2',
    phone: '+1-555-3001',
    operatingHours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '16:00' }
    }
  },
  {
    id: 'dept2',
    name: 'Orthopedics',
    description: 'Bone, joint, and muscle treatment',
    head: 'Dr. Michael Brown',
    location: 'Building B, Floor 1',
    phone: '+1-555-3002',
    operatingHours: {
      monday: { start: '07:00', end: '17:00' },
      tuesday: { start: '07:00', end: '17:00' },
      wednesday: { start: '07:00', end: '17:00' },
      thursday: { start: '07:00', end: '17:00' },
      friday: { start: '07:00', end: '15:00' }
    }
  },
  {
    id: 'dept3',
    name: 'Emergency',
    description: '24/7 emergency medical care',
    head: 'Dr. James Wilson',
    location: 'Building C, Ground Floor',
    phone: '+1-555-3003',
    operatingHours: {
      monday: { start: '00:00', end: '23:59' },
      tuesday: { start: '00:00', end: '23:59' },
      wednesday: { start: '00:00', end: '23:59' },
      thursday: { start: '00:00', end: '23:59' },
      friday: { start: '00:00', end: '23:59' },
      saturday: { start: '00:00', end: '23:59' },
      sunday: { start: '00:00', end: '23:59' }
    }
  }
];

export const mockAppointments = [
  {
    id: 'apt1',
    patientId: '1',
    doctorId: 'doc1',
    departmentId: 'dept1',
    date: new Date('2024-12-05'),
    time: '10:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    reason: 'Routine cardiac checkup',
    notes: 'Patient reports occasional chest pain',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28')
  },
  {
    id: 'apt2',
    patientId: '2',
    doctorId: 'doc2',
    departmentId: 'dept2',
    date: new Date('2024-12-04'),
    time: '14:30',
    duration: 45,
    type: 'follow-up',
    status: 'completed',
    reason: 'Orthopedic follow-up',
    notes: 'Recovery progressing well',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-04')
  }
];

export const mockQueue = [
  {
    id: 'q1',
    patientId: '1',
    doctorId: 'doc1',
    departmentId: 'dept1',
    appointmentId: 'apt1',
    queueNumber: 1,
    estimatedWaitTime: 15,
    status: 'waiting',
    priority: 'normal',
    checkedInAt: new Date('2024-12-03T09:45:00'),
    createdAt: new Date('2024-12-03T09:45:00')
  },
  {
    id: 'q2',
    patientId: '2',
    doctorId: 'doc2',
    departmentId: 'dept2',
    queueNumber: 1,
    estimatedWaitTime: 30,
    status: 'in-progress',
    priority: 'normal',
    checkedInAt: new Date('2024-12-03T10:00:00'),
    calledAt: new Date('2024-12-03T10:15:00'),
    createdAt: new Date('2024-12-03T10:00:00')
  }
];

export const mockNotifications = [
  {
    id: 'notif1',
    userId: '1',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Sarah Smith is tomorrow at 10:00 AM',
    type: 'appointment',
    read: false,
    createdAt: new Date('2024-12-02T16:00:00')
  },
  {
    id: 'notif2',
    userId: '1',
    title: 'Queue Update',
    message: 'You are now #1 in the queue. Estimated wait time: 15 minutes',
    type: 'queue',
    read: false,
    createdAt: new Date('2024-12-03T09:45:00')
  }
];

// Helper functions that the dashboards expect
export const getUserByEmail = (email: string) => {
  return [...mockPatients, ...mockDoctors, ...mockAdmins].find(user => user.email === email);
};

export const getPatientData = (patientId: string) => {
  const patient = mockPatients.find(p => p.id === patientId);
  const appointments = mockAppointments.filter(apt => apt.patientId === patientId);
  const queueEntries = mockQueue.filter(entry => entry.patientId === patientId);
  const notifications = mockNotifications.filter(notif => notif.userId === patientId);
  
  return {
    patient,
    appointments,
    queueEntries,
    notifications,
    upcomingAppointments: appointments.filter(apt => new Date(apt.date) > new Date()),
    medicalHistory: patient?.medicalHistory || [],
    allergies: patient?.allergies || []
  };
};

export const getDoctorData = (doctorId: string) => {
  const doctor = mockDoctors.find(d => d.id === doctorId);
  const appointments = mockAppointments.filter(apt => apt.doctorId === doctorId);
  const queueEntries = mockQueue.filter(entry => entry.doctorId === doctorId);
  const notifications = mockNotifications.filter(notif => notif.userId === doctorId);
  
  return {
    doctor,
    appointments,
    queueEntries,
    notifications,
    todayAppointments: appointments.filter(apt => {
      const today = new Date();
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === today.toDateString();
    }),
    waitingPatients: queueEntries.filter(entry => entry.status === 'waiting').length,
    totalPatients: queueEntries.length
  };
};

export const getAdminData = () => {
  return {
    totalPatients: mockPatients.length,
    totalDoctors: mockDoctors.length,
    totalAppointments: mockAppointments.length,
    totalDepartments: mockDepartments.length,
    todayAppointments: mockAppointments.filter(apt => {
      const today = new Date();
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === today.toDateString();
    }).length,
    waitingInQueue: mockQueue.filter(entry => entry.status === 'waiting').length
  };
};