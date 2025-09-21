'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientData } from '@/lib/mockData';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Search,
  Filter,
  ChevronRight,
  Star,
  MessageSquare,
  Pill,
  Activity,
  TrendingUp,
  Eye,
  Phone,
  Mail
} from 'lucide-react';

// Mock appointment history data
const mockAppointmentHistory = [
  {
    id: 1,
    appointmentId: 'APT-001234',
    date: '2024-01-15',
    time: '10:30 AM',
    department: 'Cardiology',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      licenseNumber: 'MD-12345'
    },
    type: 'Consultation',
    status: 'completed',
    reason: 'Regular cardiac checkup',
    location: 'Room 204, 2nd Floor',
    duration: '45 minutes',
    visitSummary: {
      diagnosis: ['Essential Hypertension (I10)', 'Hyperlipidemia (E78.5)'],
      symptoms: ['Chest discomfort', 'Shortness of breath'],
      vitalSigns: {
        bloodPressure: '140/90 mmHg',
        heartRate: '78 bpm',
        temperature: '98.6°F',
        weight: '175 lbs',
        height: '5\'10"'
      },
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '3 months' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '3 months' }
      ],
      labOrders: ['Lipid Panel', 'Basic Metabolic Panel'],
      followUp: 'Follow up in 3 months',
      notes: 'Patient responding well to current treatment. Continue medication regimen.'
    },
    billing: {
      totalAmount: 350.00,
      insuranceCovered: 280.00,
      patientPaid: 70.00,
      copay: 25.00
    },
    rating: 5,
    feedback: 'Excellent care and very thorough examination.'
  },
  {
    id: 2,
    appointmentId: 'APT-001198',
    date: '2023-12-10',
    time: '02:15 PM',
    department: 'Orthopedics',
    doctor: {
      name: 'Dr. Michael Chen',
      specialization: 'Orthopedic Surgeon',
      licenseNumber: 'MD-67890'
    },
    type: 'Follow-up',
    status: 'completed',
    reason: 'Knee pain follow-up',
    location: 'Room 301, 3rd Floor',
    duration: '30 minutes',
    visitSummary: {
      diagnosis: ['Osteoarthritis of knee (M17.9)'],
      symptoms: ['Knee stiffness', 'Pain on movement'],
      vitalSigns: {
        bloodPressure: '130/85 mmHg',
        heartRate: '72 bpm',
        temperature: '98.4°F',
        weight: '175 lbs'
      },
      medications: [
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily as needed', duration: '2 weeks' }
      ],
      labOrders: [],
      followUp: 'Physical therapy referral',
      notes: 'Knee showing improvement. Continue with physical therapy exercises.'
    },
    billing: {
      totalAmount: 200.00,
      insuranceCovered: 160.00,
      patientPaid: 40.00,
      copay: 25.00
    },
    rating: 4,
    feedback: 'Good follow-up care, helpful recommendations.'
  },
  {
    id: 3,
    appointmentId: 'APT-001156',
    date: '2023-11-20',
    time: '09:00 AM',
    department: 'General Medicine',
    doctor: {
      name: 'Dr. Emily Davis',
      specialization: 'Family Medicine',
      licenseNumber: 'MD-13579'
    },
    type: 'Annual Physical',
    status: 'completed',
    reason: 'Annual health checkup',
    location: 'Room 105, 1st Floor',
    duration: '60 minutes',
    visitSummary: {
      diagnosis: ['Routine health maintenance (Z00.00)'],
      symptoms: [],
      vitalSigns: {
        bloodPressure: '125/80 mmHg',
        heartRate: '68 bpm',
        temperature: '98.6°F',
        weight: '173 lbs',
        height: '5\'10"'
      },
      medications: [],
      labOrders: ['Complete Blood Count', 'Comprehensive Metabolic Panel', 'Lipid Panel'],
      followUp: 'Annual physical next year',
      notes: 'Overall health is good. Continue current lifestyle and diet.'
    },
    billing: {
      totalAmount: 250.00,
      insuranceCovered: 250.00,
      patientPaid: 0.00,
      copay: 0.00
    },
    rating: 5,
    feedback: 'Very thorough annual exam, great preventive care.'
  },
  {
    id: 4,
    appointmentId: 'APT-001089',
    date: '2023-10-05',
    time: '11:15 AM',
    department: 'Dermatology',
    doctor: {
      name: 'Dr. James Wilson',
      specialization: 'Dermatologist',
      licenseNumber: 'MD-24680'
    },
    type: 'Consultation',
    status: 'completed',
    reason: 'Skin lesion examination',
    location: 'Room 402, 4th Floor',
    duration: '30 minutes',
    visitSummary: {
      diagnosis: ['Seborrheic keratosis (L82.1)'],
      symptoms: ['Skin lesion on back'],
      vitalSigns: {
        bloodPressure: '128/82 mmHg',
        heartRate: '75 bpm',
        temperature: '98.5°F'
      },
      medications: [],
      labOrders: [],
      followUp: 'Follow up if any changes in lesion',
      notes: 'Benign seborrheic keratosis. No treatment required at this time.'
    },
    billing: {
      totalAmount: 180.00,
      insuranceCovered: 144.00,
      patientPaid: 36.00,
      copay: 25.00
    },
    rating: 4,
    feedback: 'Quick and accurate diagnosis, professional service.'
  },
  {
    id: 5,
    appointmentId: 'APT-001023',
    date: '2023-09-15',
    time: '03:30 PM',
    department: 'Cardiology',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      licenseNumber: 'MD-12345'
    },
    type: 'Follow-up',
    status: 'completed',
    reason: 'Blood pressure check',
    location: 'Room 204, 2nd Floor',
    duration: '20 minutes',
    visitSummary: {
      diagnosis: ['Essential Hypertension (I10)'],
      symptoms: [],
      vitalSigns: {
        bloodPressure: '135/88 mmHg',
        heartRate: '74 bpm',
        temperature: '98.6°F',
        weight: '174 lbs'
      },
      medications: [
        { name: 'Lisinopril', dosage: '5mg', frequency: 'Once daily', duration: '3 months' }
      ],
      labOrders: [],
      followUp: 'Continue medication, follow up in 3 months',
      notes: 'Blood pressure improving with medication. Continue current dose.'
    },
    billing: {
      totalAmount: 150.00,
      insuranceCovered: 120.00,
      patientPaid: 30.00,
      copay: 25.00
    },
    rating: 5,
    feedback: 'Great follow-up care, medication is working well.'
  }
];

export default function AppointmentHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const departments = [...new Set(mockAppointmentHistory.map(apt => apt.department))];
  const doctors = [...new Set(mockAppointmentHistory.map(apt => apt.doctor.name))];
  const years = [...new Set(mockAppointmentHistory.map(apt => new Date(apt.date).getFullYear().toString()))];

  const filteredAppointments = mockAppointmentHistory.filter(appointment => {
    const matchesSearch = appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDoctor = selectedDoctor === 'all' || appointment.doctor.name === selectedDoctor;
    const matchesDepartment = selectedDepartment === 'all' || appointment.department === selectedDepartment;
    const matchesYear = selectedYear === 'all' || new Date(appointment.date).getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesDoctor && matchesDepartment && matchesYear;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const totalSpent = mockAppointmentHistory.reduce((sum, apt) => sum + apt.billing.patientPaid, 0);
  const totalAppointments = mockAppointmentHistory.length;
  const completedAppointments = mockAppointmentHistory.filter(apt => apt.status === 'completed').length;
  const averageRating = mockAppointmentHistory.reduce((sum, apt) => sum + (apt.rating || 0), 0) / mockAppointmentHistory.length;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointment History</h1>
        <p className="text-gray-600 mt-1">Complete record of your past appointments and visit summaries</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedAppointments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-purple-600">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments, doctors, or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Doctors</option>
            {doctors.map(doctor => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointment History List */}
      <div className="space-y-4">
        {filteredAppointments.map(appointment => (
          <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.appointmentId}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (appointment.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{appointment.doctor.name} - {appointment.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{appointment.reason}</p>
                  <p className="text-sm text-gray-500">Duration: {appointment.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-lg font-bold text-gray-900">${appointment.billing.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-green-600">You paid: ${appointment.billing.patientPaid.toFixed(2)}</p>
              </div>
            </div>

            {/* Visit Summary Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Visit Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Diagnosis:</p>
                  <div className="space-y-1">
                    {appointment.visitSummary.diagnosis.map((diag, index) => (
                      <span key={index} className="block text-gray-900">{diag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Follow-up:</p>
                  <p className="text-gray-900">{appointment.visitSummary.followUp}</p>
                </div>
                {appointment.visitSummary.medications.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="text-gray-600 mb-1">Medications Prescribed:</p>
                    <div className="flex flex-wrap gap-2">
                      {appointment.visitSummary.medications.map((med, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {med.name} {med.dosage}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Full Details</span>
                </button>
                <button className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
                <button className="text-purple-600 hover:text-purple-700 flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Contact Doctor</span>
                </button>
              </div>
              <button
                onClick={() => router.push('/patient/appointments/book')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Again</span>
              </button>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Detailed View Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Appointment Details - {selectedAppointment.appointmentId}
                </h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Appointment Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Appointment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">{selectedAppointment.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900">{selectedAppointment.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="text-gray-900">{selectedAppointment.doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="text-gray-900">{selectedAppointment.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{selectedAppointment.location}</span>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Billing Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="text-gray-900">${selectedAppointment.billing.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance Covered:</span>
                      <span className="text-green-600">${selectedAppointment.billing.insuranceCovered.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">You Paid:</span>
                      <span className="text-gray-900">${selectedAppointment.billing.patientPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Copay:</span>
                      <span className="text-gray-900">${selectedAppointment.billing.copay.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Vital Signs</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedAppointment.visitSummary.vitalSigns).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-gray-900">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                {selectedAppointment.visitSummary.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Medications Prescribed</h4>
                    <div className="space-y-2">
                      {selectedAppointment.visitSummary.medications.map((med: any, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800">{med.name} {med.dosage}</p>
                          <p className="text-sm text-blue-600">{med.frequency} - {med.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Full Notes */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Doctor's Notes</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedAppointment.visitSummary.notes}</p>
              </div>

              {/* Patient Feedback */}
              {selectedAppointment.feedback && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Your Feedback</h4>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedAppointment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({selectedAppointment.rating}/5)</span>
                    </div>
                    <p className="text-gray-700">{selectedAppointment.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}