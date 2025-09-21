'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building2,
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Stethoscope,
  Calendar,
  User
} from 'lucide-react';

// Mock departments data
const mockDepartments = [
  {
    id: 1,
    name: 'Cardiology',
    description: 'Heart and cardiovascular system care',
    head: 'Dr. Sarah Johnson',
    location: '2nd Floor, Block A',
    phone: '+91 9876543210',
    email: 'cardiology@hospital.com',
    totalDoctors: 8,
    activeDoctors: 7,
    totalPatients: 145,
    todayPatients: 23,
    avgWaitTime: 18,
    status: 'active',
    beds: 25,
    occupiedBeds: 18,
    equipment: ['ECG Machine', 'Echocardiogram', 'Catheterization Lab'],
    openingHours: '24/7',
    emergencyServices: true,
    established: '2010',
    specialties: ['Interventional Cardiology', 'Cardiac Surgery', 'Electrophysiology']
  },
  {
    id: 2,
    name: 'Orthopedics',
    description: 'Bone, joint, and musculoskeletal care',
    head: 'Dr. Michael Chen',
    location: '3rd Floor, Block B',
    phone: '+91 9876543211',
    email: 'orthopedics@hospital.com',
    totalDoctors: 6,
    activeDoctors: 5,
    totalPatients: 98,
    todayPatients: 15,
    avgWaitTime: 22,
    status: 'active',
    beds: 20,
    occupiedBeds: 14,
    equipment: ['X-Ray Machine', 'MRI Scanner', 'Arthroscopy Equipment'],
    openingHours: '8:00 AM - 8:00 PM',
    emergencyServices: true,
    established: '2012',
    specialties: ['Joint Replacement', 'Sports Medicine', 'Spine Surgery']
  },
  {
    id: 3,
    name: 'General Medicine',
    description: 'Primary healthcare and general medical services',
    head: 'Dr. Emily Davis',
    location: '1st Floor, Block A',
    phone: '+91 9876543212',
    email: 'generalmedicine@hospital.com',
    totalDoctors: 12,
    activeDoctors: 11,
    totalPatients: 234,
    todayPatients: 45,
    avgWaitTime: 15,
    status: 'active',
    beds: 30,
    occupiedBeds: 22,
    equipment: ['Basic Diagnostic Tools', 'Blood Pressure Monitors', 'Thermometers'],
    openingHours: '24/7',
    emergencyServices: true,
    established: '2008',
    specialties: ['Internal Medicine', 'Preventive Care', 'Chronic Disease Management']
  },
  {
    id: 4,
    name: 'Dermatology',
    description: 'Skin, hair, and nail care',
    head: 'Dr. James Wilson',
    location: '4th Floor, Block C',
    phone: '+91 9876543213',
    email: 'dermatology@hospital.com',
    totalDoctors: 4,
    activeDoctors: 3,
    totalPatients: 67,
    todayPatients: 12,
    avgWaitTime: 25,
    status: 'maintenance',
    beds: 10,
    occupiedBeds: 6,
    equipment: ['Dermatoscope', 'Laser Equipment', 'Biopsy Tools'],
    openingHours: '9:00 AM - 6:00 PM',
    emergencyServices: false,
    established: '2015',
    specialties: ['Cosmetic Dermatology', 'Dermatopathology', 'Pediatric Dermatology']
  },
  {
    id: 5,
    name: 'Neurology',
    description: 'Brain, spinal cord, and nervous system care',
    head: 'Dr. Lisa Brown',
    location: '5th Floor, Block B',
    phone: '+91 9876543214',
    email: 'neurology@hospital.com',
    totalDoctors: 5,
    activeDoctors: 5,
    totalPatients: 89,
    todayPatients: 18,
    avgWaitTime: 30,
    status: 'active',
    beds: 15,
    occupiedBeds: 12,
    equipment: ['EEG Machine', 'CT Scanner', 'Neurostimulation Equipment'],
    openingHours: '24/7',
    emergencyServices: true,
    established: '2011',
    specialties: ['Stroke Care', 'Epilepsy Treatment', 'Movement Disorders']
  }
];

export default function AdminDepartments() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const filteredDepartments = mockDepartments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getDepartmentStats = () => {
    const total = mockDepartments.length;
    const active = mockDepartments.filter(d => d.status === 'active').length;
    const totalDoctors = mockDepartments.reduce((sum, d) => sum + d.totalDoctors, 0);
    const totalPatients = mockDepartments.reduce((sum, d) => sum + d.totalPatients, 0);
    const todayPatients = mockDepartments.reduce((sum, d) => sum + d.todayPatients, 0);
    
    return { total, active, totalDoctors, totalPatients, todayPatients };
  };

  const stats = getDepartmentStats();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const handleAddDepartment = () => {
    setShowAddModal(true);
  };

  const handleEditDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  const handleDeleteDepartment = (department: any) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    setShowDeleteModal(false);
    setSelectedDepartment(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-1">Manage hospital departments, staff, and resources.</p>
        </div>
        <button
          onClick={handleAddDepartment}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Departments</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.active}</div>
          <div className="text-sm text-gray-600">Active Departments</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalDoctors}</div>
          <div className="text-sm text-gray-600">Total Doctors</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalPatients}</div>
          <div className="text-sm text-gray-600">Total Patients</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600 mb-1">{stats.todayPatients}</div>
          <div className="text-sm text-gray-600">Today&apos;s Patients</div>
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
              placeholder="Search departments..."
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
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <div key={department.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Department Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <p className="text-sm text-gray-500">{department.description}</p>
                  </div>
                </div>
                {getStatusBadge(department.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                  <span>Head: {department.head}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{department.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{department.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{department.activeDoctors}</div>
                  <div className="text-xs text-blue-700">Active Doctors</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{department.todayPatients}</div>
                  <div className="text-xs text-green-700">Today&apos;s Patients</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{department.avgWaitTime}m</div>
                  <div className="text-xs text-orange-700">Avg Wait Time</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{department.occupiedBeds}/{department.beds}</div>
                  <div className="text-xs text-purple-700">Bed Occupancy</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Total Patients:</span>
                  <span className="font-medium">{department.totalPatients}</span>
                </div>
                <div className="flex justify-between">
                  <span>Emergency Services:</span>
                  <span className={`font-medium ${department.emergencyServices ? 'text-green-600' : 'text-red-600'}`}>
                    {department.emergencyServices ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Established:</span>
                  <span className="font-medium">{department.established}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDepartment(department)}
                  className="flex-1 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => handleEditDepartment(department)}
                  className="text-gray-600 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department)}
                  className="text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-2 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search criteria or add a new department.</p>
          <button
            onClick={handleAddDepartment}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Department</span>
          </button>
        </div>
      )}

      {/* Department Detail Modal */}
      {selectedDepartment && !showEditModal && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedDepartment.name}</h3>
                  <p className="text-gray-500">{selectedDepartment.description}</p>
                </div>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Department Head:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.head}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Hours:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.openingHours}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Established:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.established}</span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Equipment & Resources</h4>
                    <div className="space-y-2">
                      {selectedDepartment.equipment.map((item: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statistics and Specialties */}
                <div className="space-y-6">
                  {/* Current Statistics */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Current Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedDepartment.activeDoctors}/{selectedDepartment.totalDoctors}</div>
                        <div className="text-sm text-blue-700">Doctors Active</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedDepartment.todayPatients}</div>
                        <div className="text-sm text-green-700">Today&apos;s Patients</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{selectedDepartment.avgWaitTime}m</div>
                        <div className="text-sm text-orange-700">Avg Wait Time</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedDepartment.occupiedBeds}/{selectedDepartment.beds}</div>
                        <div className="text-sm text-purple-700">Bed Occupancy</div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Specialties</h4>
                    <div className="space-y-2">
                      {selectedDepartment.specialties.map((specialty: string, index: number) => (
                        <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status and Services */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Status & Services</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Department Status:</span>
                        {getStatusBadge(selectedDepartment.status)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Emergency Services:</span>
                        <span className={`text-sm font-medium ${selectedDepartment.emergencyServices ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDepartment.emergencyServices ? 'Available 24/7' : 'Not Available'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Patients Served:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedDepartment.totalPatients}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => handleEditDepartment(selectedDepartment)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Edit Department
                </button>
                <button
                  onClick={() => handleDeleteDepartment(selectedDepartment)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Department</h3>
              <p className="text-gray-600 mb-6">
                Create a new department in the hospital management system.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Department
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Department</h3>
              <p className="text-gray-600 mb-6">
                Update information for {selectedDepartment?.name}.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Department Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Department</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the {selectedDepartment?.name} department? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
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