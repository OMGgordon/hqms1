'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockDepartments, mockDoctors } from '@/lib/mockData';
import {
  Users,
  Clock,
  MapPin,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

export default function JoinQueue() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [priority, setPriority] = useState('normal');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const availableDoctors = selectedDepartment
    ? mockDoctors.filter(doctor => doctor.department === selectedDepartment)
    : [];

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Redirect to queue status after 2 seconds
      setTimeout(() => {
        router.push('/patient/queue/status');
      }, 2000);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Joined Queue!</h2>
            <p className="text-gray-600">You have been added to the queue. Please wait for your turn.</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Queue Number:</span>
              <span className="font-bold text-green-800">#15</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-green-700">Estimated Wait:</span>
              <span className="font-bold text-green-800">25 minutes</span>
            </div>
          </div>

          <p className="text-sm text-gray-500">Redirecting to queue status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Join Queue</h1>
        <p className="text-gray-600 mt-1">Select a department and doctor to join the queue for consultation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Join Queue Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleJoinQueue} className="space-y-6">
              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department *
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedDoctor(''); // Reset doctor selection
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a department</option>
                  {mockDepartments.map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor (Optional)
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedDepartment}
                >
                  <option value="">Any available doctor</option>
                  {availableDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to be assigned to the next available doctor
                </p>
              </div>

              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'normal', label: 'Normal', desc: 'Regular consultation' },
                    { value: 'urgent', label: 'Urgent', desc: 'Need immediate attention' },
                    { value: 'emergency', label: 'Emergency', desc: 'Life-threatening condition' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={priority === option.value}
                        onChange={(e) => setPriority(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Symptoms
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedDepartment}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Users className="h-5 w-5" />
                    <span>Join Queue</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Queue Information Sidebar */}
        <div className="space-y-6">
          {/* Current Queue Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Queue Status</h3>
            
            {selectedDepartment ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="font-medium text-gray-900">{selectedDepartment}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Queue:</span>
                  <span className="font-bold text-orange-600">12 patients</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estimated Wait:</span>
                  <span className="font-bold text-blue-600">30 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Number:</span>
                  <span className="font-bold text-green-600">#15</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Select a department to see queue status</p>
            )}
          </div>

          {/* Available Doctors */}
          {selectedDepartment && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Doctors</h3>
              
              {availableDoctors.length > 0 ? (
                <div className="space-y-3">
                  {availableDoctors.map(doctor => (
                    <div key={doctor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{doctor.name}</p>
                        <p className="text-xs text-gray-500">{doctor.specialization}</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No doctors available in this department</p>
              )}
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Important</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Please arrive at least 15 minutes before your estimated time. 
                  You will receive notifications about your queue status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}