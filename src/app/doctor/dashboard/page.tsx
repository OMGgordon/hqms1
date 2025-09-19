'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import { getDoctorData, mockPatients, mockDepartments, mockAppointments } from '@/lib/mockData';
import {
  Users,
  Calendar,
  Clock,
  Stethoscope,
  Activity,
  FileText,
  CheckCircle,
  User,
  BarChart3,
  UserCheck
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
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

  const doctorData = getDoctorData(user.id);
  const { doctor, appointments, queueEntries } = doctorData;

  // Get today's appointments
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.date).toDateString() === today;
  });

  // Get current queue for this doctor
  const currentQueue = queueEntries.filter(patient => patient.status === 'waiting' || patient.status === 'called');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good morning, Dr. {user.name.split(' ').pop()}!</h1>
          <p className="text-gray-600 mt-1">Here's your schedule and patient overview for today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>View Patients</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </button>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <DashboardWidgets role="doctor" />

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today&apos;s Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium">
              {todayAppointments.filter(apt => apt.status === 'confirmed').length} confirmed
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Queue Patients</p>
              <p className="text-2xl font-bold text-gray-900">{currentQueue.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-orange-600 font-medium">
              {currentQueue.filter(p => p.status === 'waiting').length} waiting
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Department</p>
              <p className="text-lg font-bold text-gray-900">
                {doctor?.department || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-gray-600">
              {doctor?.department ? mockDepartments.find(d => d.name === doctor.department)?.location : 'N/A'}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Patient</p>
              <p className="text-lg font-bold text-gray-900">
                {currentQueue.length > 0 ? `#${currentQueue[0].queueNumber}` : 'None'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            {currentQueue.length > 0 ? (
              <span className="text-purple-600 font-medium">Ready to call</span>
            ) : (
              <span className="text-gray-600">Queue empty</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today&apos;s Schedule */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h3>
            <Calendar className="h-5 w-5 text-blue-500" />
          </div>

          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.slice(0, 5).map(appointment => {
                const patient = mockPatients.find(p => p.id === appointment.patientId);
                return (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient?.name}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    {appointment.reason && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Reason: {appointment.reason}</p>
                      </div>
                    )}
                    
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        View Details
                      </button>
                      <button className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                        Reschedule
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            )}
          </div>

          {todayAppointments.length > 5 && (
            <button className="w-full mt-4 text-center py-2 text-blue-600 hover:text-blue-700 font-medium border-t border-gray-200">
              View all {todayAppointments.length} appointments
            </button>
          )}
        </div>

        {/* Current Queue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Patient Queue</h3>
            <Users className="h-5 w-5 text-orange-500" />
          </div>

          <div className="space-y-4">
            {currentQueue.length > 0 ? (
              currentQueue.slice(0, 5).map(queuePatient => {
                const patient = mockPatients.find(p => p.id === queuePatient.patientId);
                return (
                  <div key={queuePatient.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-orange-600">
                          #{queuePatient.queueNumber}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient?.name}</p>
                          <p className="text-sm text-gray-600">
                            Waiting {queuePatient.estimatedWaitTime} min
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        queuePatient.status === 'called' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {queuePatient.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                        Call Patient
                      </button>
                      <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        View History
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No patients in queue</p>
                <p className="text-sm text-gray-400 mt-1">Patients will appear here when they join</p>
              </div>
            )}
          </div>

          {currentQueue.length > 5 && (
            <button className="w-full mt-4 text-center py-2 text-orange-600 hover:text-orange-700 font-medium border-t border-gray-200">
              View all {currentQueue.length} patients
            </button>
          )}
        </div>
      </div>

      {/* Recent Patient Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Patient Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Activity
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments
            .filter(a => a.status === 'completed')
            .slice(0, 3)
            .map(appointment => {
              const patient = mockPatients.find(p => p.id === appointment.patientId);
              return (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{patient?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                      )}
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600">Consultation completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Stethoscope className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <FileText className="h-6 w-6 text-blue-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Write Prescription</p>
              </button>
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <Activity className="h-6 w-6 text-green-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">View Lab Results</p>
              </button>
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <Calendar className="h-6 w-6 text-purple-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Schedule Appointment</p>
              </button>
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <BarChart3 className="h-6 w-6 text-orange-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Patient Reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}