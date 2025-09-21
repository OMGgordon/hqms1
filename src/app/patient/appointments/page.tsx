'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  Phone,
  Mail,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  RotateCcw
} from 'lucide-react';

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    appointmentId: 'APT-001234',
    date: '2024-01-20',
    time: '10:30 AM',
    department: 'Cardiology',
    doctor: 'Dr. Sarah Johnson',
    type: 'Consultation',
    status: 'confirmed',
    reason: 'Regular checkup',
    location: 'Room 204, 2nd Floor',
    notes: 'Please bring previous reports',
    canReschedule: true,
    canCancel: true
  },
  {
    id: 2,
    appointmentId: 'APT-001235',
    date: '2024-01-22',
    time: '02:15 PM',
    department: 'Orthopedics',
    doctor: 'Dr. Michael Chen',
    type: 'Follow-up',
    status: 'confirmed',
    reason: 'Knee injury follow-up',
    location: 'Room 301, 3rd Floor',
    notes: 'Bring X-ray reports',
    canReschedule: true,
    canCancel: true
  },
  {
    id: 3,
    appointmentId: 'APT-001236',
    date: '2024-01-18',
    time: '09:00 AM',
    department: 'General Medicine',
    doctor: 'Dr. Emily Davis',
    type: 'Consultation',
    status: 'completed',
    reason: 'Fever and cough',
    location: 'Room 105, 1st Floor',
    notes: 'Treatment completed successfully',
    canReschedule: false,
    canCancel: false
  },
  {
    id: 4,
    appointmentId: 'APT-001237',
    date: '2024-01-25',
    time: '11:30 AM',
    department: 'Dermatology',
    doctor: 'Dr. James Wilson',
    type: 'Consultation',
    status: 'pending',
    reason: 'Skin condition',
    location: 'Room 402, 4th Floor',
    notes: 'Waiting for doctor confirmation',
    canReschedule: false,
    canCancel: true
  },
  {
    id: 5,
    appointmentId: 'APT-001238',
    date: '2024-01-15',
    time: '03:30 PM',
    department: 'Neurology',
    doctor: 'Dr. Lisa Brown',
    type: 'Check-up',
    status: 'cancelled',
    reason: 'Headache evaluation',
    location: 'Room 305, 3rd Floor',
    notes: 'Cancelled by patient',
    canReschedule: false,
    canCancel: false
  }
];

export default function PatientAppointments() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.appointmentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      rescheduled: { color: 'bg-purple-100 text-purple-800', icon: RotateCcw }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getAppointmentStats = () => {
    const total = mockAppointments.length;
    const upcoming = mockAppointments.filter(apt => 
      (apt.status === 'confirmed' || apt.status === 'pending') && 
      new Date(apt.date) >= new Date()
    ).length;
    const completed = mockAppointments.filter(apt => apt.status === 'completed').length;
    const cancelled = mockAppointments.filter(apt => apt.status === 'cancelled').length;
    
    return { total, upcoming, completed, cancelled };
  };

  const stats = getAppointmentStats();

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleCancel = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const confirmReschedule = () => {
    // Handle reschedule logic here
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const confirmCancel = () => {
    // Handle cancel logic here
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your upcoming and past appointments.</p>
        </div>
        <button
          onClick={() => router.push('/patient/appointments/book')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Appointments</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.upcoming}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-500 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="check-up">Check-up</option>
            </select>

            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Date & Time */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{appointment.time}</span>
                  </div>
                </div>

                {/* Doctor & Department */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Doctor & Department</div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Stethoscope className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{appointment.doctor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{appointment.department}</span>
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Details</div>
                  <div className="mb-2">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {appointment.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{appointment.reason}</div>
                </div>

                {/* Status & Actions */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="mb-3">
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {appointment.appointmentId}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 ml-6">
                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                {appointment.canReschedule && (
                  <button
                    onClick={() => handleReschedule(appointment)}
                    className="text-orange-600 hover:text-orange-700 text-sm flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Reschedule</span>
                  </button>
                )}
                
                {appointment.canCancel && (
                  <button
                    onClick={() => handleCancel(appointment)}
                    className="text-red-600 hover:text-red-700 text-sm flex items-center space-x-1"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {appointment.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">Notes</div>
                <div className="text-sm text-gray-700">{appointment.notes}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500 mb-6">You don&apos;t have any appointments matching your criteria.</p>
          <button
            onClick={() => router.push('/patient/appointments/book')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Book Your First Appointment</span>
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppointment && !showRescheduleModal && !showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Appointment Details</h3>
                  <p className="text-gray-500">ID: {selectedAppointment.appointmentId}</p>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Date</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Time</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedAppointment.time}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Doctor</span>
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedAppointment.doctor}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Department</span>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{selectedAppointment.department}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Location</span>
                  <span className="text-sm text-gray-900">{selectedAppointment.location}</span>
                </div>

                {/* Appointment Type and Reason */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Type</span>
                    <span className="text-sm text-gray-900">{selectedAppointment.type}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Reason</span>
                    <span className="text-sm text-gray-900">{selectedAppointment.reason}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Notes</span>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  {selectedAppointment.canReschedule && (
                    <button
                      onClick={() => handleReschedule(selectedAppointment)}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                    >
                      Reschedule
                    </button>
                  )}
                  {selectedAppointment.canCancel && (
                    <button
                      onClick={() => handleCancel(selectedAppointment)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reschedule your appointment with {selectedAppointment?.doctor}?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmReschedule}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Yes, Reschedule
                </button>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Appointment</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your appointment with {selectedAppointment?.doctor}? 
                This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmCancel}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Keep Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}