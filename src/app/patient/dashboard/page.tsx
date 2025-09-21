'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import { getPatientData, mockDepartments, getDoctorData } from '@/lib/mockData';
import { 
  Calendar, 
  Clock, 
  Users, 
  Bell, 
  User, 
  Plus, 
  History, 
  MapPin,
  Phone,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Settings,
  Activity,
  FileText,
  CreditCard
} from 'lucide-react';

export default function PatientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const patientData = getPatientData(user.id);
  const { patient, appointments, queueEntries, notifications } = patientData;
  
  // Get all doctors by mapping through appointments and queue entries to get unique doctor IDs
  const doctorIds = [...new Set([
    ...appointments.map(a => a.doctorId),
    ...queueEntries.map(q => q.doctorId)
  ])];
  const mockDoctors = doctorIds.map(id => getDoctorData(id).doctor).filter(Boolean);

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter(apt => 
    (apt.status === 'scheduled' || apt.status === 'confirmed') && 
    new Date(apt.date) >= new Date()
  );

  // Get patient medical history and allergies
  const medicalHistory = patient?.medicalHistory || [];
  const allergies = patient?.allergies || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your healthcare today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Join Queue</span>
          </button>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Appointment</p>
              <p className="text-lg font-bold text-gray-900">
                {upcomingAppointments.length > 0 ? 'Tomorrow 10:00 AM' : 'None scheduled'}
              </p>
              <p className="text-sm text-blue-600">Dr. Sarah Smith</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Queue Position</p>
              <p className="text-lg font-bold text-gray-900">
                {queueEntries.length > 0 ? `#${queueEntries[0]?.queueNumber || 'N/A'}` : 'Not in queue'}
              </p>
              <p className="text-sm text-green-600">
                {queueEntries.length > 0 ? `Est. ${queueEntries[0]?.estimatedWaitTime || 15} min wait` : 'Join a queue'}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-lg font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-orange-600">
                {notifications.filter(n => !n.read).length} unread
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Visit</p>
              <p className="text-lg font-bold text-gray-900">
                {patientData.patient?.lastVisit ? 
                  new Date(patientData.patient.lastVisit).toLocaleDateString() : 
                  'No visits yet'
                }
              </p>
              <p className="text-sm text-purple-600">Cardiology</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Current Queue Status & Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Queue Status */}
          {queueEntries.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Current Queue Status</h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live Updates</span>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">#{queueEntries[0]?.queueNumber}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">You&apos;re in the queue</p>
                      <p className="text-sm text-gray-600">Department: Cardiology</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Estimated wait</p>
                    <p className="text-lg font-bold text-green-600">{queueEntries[0]?.estimatedWaitTime || 15} min</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Doctor: Dr. Sarah Smith</span>
                  <div className="flex items-center gap-2">
                    <button className="text-red-600 hover:text-red-700">Leave Queue</button>
                    <button className="text-blue-600 hover:text-blue-700">Delay Turn</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
            <div className="p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600">Dr. Sarah Smith - Cardiology</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700">Reschedule</button>
                          <button className="text-sm text-red-600 hover:text-red-700">Cancel</button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Reason:</strong> {appointment.reason}</p>
                        <p><strong>Duration:</strong> {appointment.duration} minutes</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No upcoming appointments</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Book Your First Appointment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Visit History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Visit History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">Cardiology Consultation</p>
                      <span className="text-sm text-gray-600">Dec 1, 2024</span>
                    </div>
                    <p className="text-sm text-gray-600">Dr. Sarah Smith</p>
                    <p className="text-sm text-gray-500 mt-1">Routine checkup completed successfully</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">Blood Test</p>
                      <span className="text-sm text-gray-600">Nov 28, 2024</span>
                    </div>
                    <p className="text-sm text-gray-600">Lab Services</p>
                    <p className="text-sm text-gray-500 mt-1">Results available in patient portal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Quick Actions & Profile */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => router.push('/patient/appointments/book')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200"
              >
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Book Appointment</p>
                  <p className="text-sm text-gray-600">Schedule with your doctor</p>
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/patient/queue/join')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200"
              >
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Join Queue</p>
                  <p className="text-sm text-gray-600">Walk-in consultation</p>
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/patient/records')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200"
              >
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Medical Records</p>
                  <p className="text-sm text-gray-600">View your history</p>
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/patient/profile')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200"
              >
                <Settings className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Profile Settings</p>
                  <p className="text-sm text-gray-600">Update your info</p>
                </div>
              </button>

              <button 
                onClick={() => router.push('/patient/billing')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200"
              >
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">Billing & Payments</p>
                  <p className="text-sm text-gray-600">Manage your bills</p>
                </div>
              </button>

              <button 
                onClick={() => router.push('/patient/settings')}
                className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300"
              >
                <User className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Account Settings</p>
                  <p className="text-sm text-gray-600">Privacy & preferences</p>
                </div>
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {notifications.length > 3 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => router.push('/patient/notifications')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All Notifications →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Health Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.map((condition, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Insurance</p>
                  <p className="text-sm text-gray-600">{patientData.patient?.insurance?.provider}</p>
                  <p className="text-xs text-gray-500">Policy: {patientData.patient?.insurance?.policyNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
