'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Clock,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Eye,
  MessageSquare,
  Filter,
  Search,
  Bell,
  Activity,
  Calendar,
  MapPin
} from 'lucide-react';

// Mock queue data
const mockQueueData = [
  {
    id: 1,
    queueNumber: 8,
    patientName: 'John Smith',
    patientId: 'PAT-001',
    age: 45,
    gender: 'Male',
    priority: 'normal',
    reason: 'Chest pain evaluation',
    symptoms: 'Mild chest pain, occasional shortness of breath',
    waitTime: 15,
    joinTime: '09:30 AM',
    estimatedTime: '10:15 AM',
    status: 'current',
    contactNumber: '+91 9876543210',
    previousVisits: 3,
    lastVisit: '2024-01-10'
  },
  {
    id: 2,
    queueNumber: 9,
    patientName: 'Sarah Johnson',
    patientId: 'PAT-002',
    age: 32,
    gender: 'Female',
    priority: 'urgent',
    reason: 'Follow-up consultation',
    symptoms: 'Post-surgery follow-up, wound healing check',
    waitTime: 5,
    joinTime: '09:45 AM',
    estimatedTime: '10:30 AM',
    status: 'waiting',
    contactNumber: '+91 9876543211',
    previousVisits: 8,
    lastVisit: '2024-01-12'
  },
  {
    id: 3,
    queueNumber: 10,
    patientName: 'Michael Brown',
    patientId: 'PAT-003',
    age: 58,
    gender: 'Male',
    priority: 'normal',
    reason: 'Regular checkup',
    symptoms: 'Routine cardiac screening, hypertension monitoring',
    waitTime: 0,
    joinTime: '10:00 AM',
    estimatedTime: '10:45 AM',
    status: 'waiting',
    contactNumber: '+91 9876543212',
    previousVisits: 12,
    lastVisit: '2024-01-08'
  },
  {
    id: 4,
    queueNumber: 11,
    patientName: 'Emily Davis',
    patientId: 'PAT-004',
    age: 28,
    gender: 'Female',
    priority: 'emergency',
    reason: 'Severe chest pain',
    symptoms: 'Acute onset chest pain, sweating, nausea',
    waitTime: 0,
    joinTime: '10:15 AM',
    estimatedTime: '10:20 AM',
    status: 'waiting',
    contactNumber: '+91 9876543213',
    previousVisits: 1,
    lastVisit: null
  },
  {
    id: 5,
    queueNumber: 12,
    patientName: 'Robert Wilson',
    patientId: 'PAT-005',
    age: 67,
    gender: 'Male',
    priority: 'normal',
    reason: 'Medication review',
    symptoms: 'Medication adjustment for blood pressure',
    waitTime: 0,
    joinTime: '10:30 AM',
    estimatedTime: '11:00 AM',
    status: 'waiting',
    contactNumber: '+91 9876543214',
    previousVisits: 15,
    lastVisit: '2024-01-05'
  }
];

// Mock completed patients for today
const mockCompletedToday = [
  {
    id: 101,
    queueNumber: 5,
    patientName: 'Alice Cooper',
    patientId: 'PAT-101',
    consultationTime: '09:00 AM - 09:25 AM',
    diagnosis: 'Hypertension management',
    status: 'completed'
  },
  {
    id: 102,
    queueNumber: 6,
    patientName: 'David Miller',
    patientId: 'PAT-102',
    consultationTime: '09:25 AM - 09:45 AM',
    diagnosis: 'Routine cardiac screening',
    status: 'completed'
  },
  {
    id: 103,
    queueNumber: 7,
    patientName: 'Lisa Anderson',
    patientId: 'PAT-103',
    consultationTime: '09:45 AM - 10:10 AM',
    diagnosis: 'Post-operative follow-up',
    status: 'completed'
  }
];

export default function DoctorQueueManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('current'); // current, completed, analytics

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredQueue = mockQueueData.filter(patient => {
    const matchesPriority = priorityFilter === 'all' || patient.priority === priorityFilter;
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const currentPatient = filteredQueue.find(p => p.status === 'current');
  const waitingPatients = filteredQueue.filter(p => p.status === 'waiting');

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      normal: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      urgent: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      emergency: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.normal;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{priority}</span>
      </div>
    );
  };

  const handleCallNextPatient = () => {
    if (waitingPatients.length > 0) {
      setSelectedPatient(waitingPatients[0]);
      setShowCallModal(true);
    }
  };

  const confirmCallPatient = () => {
    // Logic to call the patient
    setShowCallModal(false);
    setSelectedPatient(null);
    // Update the patient status to current
  };

  const handleStartConsultation = (patient: any) => {
    setSelectedPatient(patient);
    setShowConsultationModal(true);
  };

  const getQueueStats = () => {
    const total = mockQueueData.length;
    const waiting = waitingPatients.length;
    const avgWaitTime = mockQueueData.reduce((sum, p) => sum + p.waitTime, 0) / total;
    const completed = mockCompletedToday.length;
    
    return { total, waiting, avgWaitTime: Math.round(avgWaitTime), completed };
  };

  const stats = getQueueStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600 mt-1">Manage your patient queue and consultations.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total in Queue</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.waiting}</div>
          <div className="text-sm text-gray-600">Waiting</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed Today</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600 mb-1">{stats.avgWaitTime}m</div>
          <div className="text-sm text-gray-600">Avg Wait Time</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'current', label: 'Current Queue', count: stats.total },
              { id: 'completed', label: 'Completed Today', count: stats.completed },
              { id: 'analytics', label: 'Analytics', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Current Queue Tab */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {/* Filters and Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="emergency">Emergency</option>
                    <option value="urgent">Urgent</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>

                <button
                  onClick={handleCallNextPatient}
                  disabled={waitingPatients.length === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Bell className="h-4 w-4" />
                  <span>Call Next Patient</span>
                </button>
              </div>

              {/* Current Patient */}
              {currentPatient && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-800">Current Patient</h3>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                      <span className="text-sm font-medium text-blue-700">In Consultation</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl font-bold text-blue-600">#{currentPatient.queueNumber}</div>
                        <div>
                          <div className="font-semibold text-gray-900">{currentPatient.patientName}</div>
                          <div className="text-sm text-gray-500">{currentPatient.patientId}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {currentPatient.age} years, {currentPatient.gender}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-1">Reason for Visit</div>
                      <div className="font-medium text-gray-900">{currentPatient.reason}</div>
                      <div className="text-sm text-gray-600 mt-1">{currentPatient.symptoms}</div>
                    </div>

                    <div className="flex items-center justify-end space-x-3">
                      {getPriorityBadge(currentPatient.priority)}
                      <button
                        onClick={() => handleStartConsultation(currentPatient)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Waiting Queue */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Waiting Queue ({waitingPatients.length})
                </h3>

                <div className="space-y-4">
                  {waitingPatients.map((patient, index) => (
                    <div key={patient.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">#{patient.queueNumber}</div>
                            <div className="text-xs text-gray-500">Position {index + 1}</div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="font-semibold text-gray-900">{patient.patientName}</div>
                              <div className="text-sm text-gray-500">{patient.patientId}</div>
                              {getPriorityBadge(patient.priority)}
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-1">
                              {patient.age} years, {patient.gender} • {patient.reason}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Joined: {patient.joinTime}</span>
                              <span>Wait: {patient.waitTime}min</span>
                              <span>Previous visits: {patient.previousVisits}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50">
                            <Phone className="h-4 w-4" />
                          </button>
                          
                          <button className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {waitingPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patients waiting</h3>
                    <p className="text-gray-500">All patients have been seen or the queue is empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completed Today Tab */}
          {activeTab === 'completed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Completed Consultations ({mockCompletedToday.length})
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                  <RotateCcw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {mockCompletedToday.map(patient => (
                <div key={patient.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">#{patient.queueNumber}</div>
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />
                      </div>

                      <div>
                        <div className="font-semibold text-gray-900">{patient.patientName}</div>
                        <div className="text-sm text-gray-500">{patient.patientId}</div>
                        <div className="text-sm text-gray-600 mt-1">{patient.diagnosis}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{patient.consultationTime}</div>
                      <div className="text-xs text-gray-500">Consultation completed</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Queue Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">4.2</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">18min</div>
                  <div className="text-sm text-gray-600">Avg Consultation Time</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">92%</div>
                  <div className="text-sm text-gray-600">Patient Satisfaction</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Today&apos;s Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patients Seen:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Wait Time:</span>
                    <span className="font-medium">15 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-time Performance:</span>
                    <span className="font-medium">85%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && !showCallModal && !showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Patient Details</h3>
                  <p className="text-gray-500">Queue #{selectedPatient.queueNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Patient Name</span>
                    <span className="text-lg font-semibold text-gray-900">{selectedPatient.patientName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Patient ID</span>
                    <span className="text-lg font-semibold text-gray-900">{selectedPatient.patientId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Age</span>
                    <span className="text-gray-900">{selectedPatient.age} years</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Gender</span>
                    <span className="text-gray-900">{selectedPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Priority</span>
                    {getPriorityBadge(selectedPatient.priority)}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-2">Reason for Visit</span>
                  <p className="text-gray-900">{selectedPatient.reason}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-2">Symptoms</span>
                  <p className="text-gray-900">{selectedPatient.symptoms}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Join Time</span>
                    <span className="text-gray-900">{selectedPatient.joinTime}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Wait Time</span>
                    <span className="text-gray-900">{selectedPatient.waitTime} minutes</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Previous Visits</span>
                    <span className="text-gray-900">{selectedPatient.previousVisits}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Last Visit</span>
                    <span className="text-gray-900">{selectedPatient.lastVisit || 'First time'}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCallModal(true);
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Call Patient
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Patient Modal */}
      {showCallModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Patient</h3>
              <p className="text-gray-600 mb-6">
                Call {selectedPatient.patientName} (Queue #{selectedPatient.queueNumber}) to Room 204?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmCallPatient}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Yes, Call Patient
                </button>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Complete Modal */}
      {showConsultationModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Consultation</h3>
              <p className="text-gray-600 mb-6">
                Mark consultation with {selectedPatient.patientName} as completed?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Yes, Complete
                </button>
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}