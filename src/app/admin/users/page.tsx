'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  MoreVertical,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Stethoscope
} from 'lucide-react';

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+91 9876543210',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    experience: 12,
    status: 'active',
    lastActive: '2024-01-15 10:30 AM',
    joinDate: '2018-03-15',
    patientsToday: 8,
    address: '123 Medical Street, City',
    licenseNumber: 'MD-12345'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    phone: '+91 9876543211',
    role: 'doctor',
    department: 'Orthopedics',
    specialization: 'Orthopedic Surgeon',
    experience: 15,
    status: 'active',
    lastActive: '2024-01-15 11:15 AM',
    joinDate: '2015-07-20',
    patientsToday: 6,
    address: '456 Health Avenue, City',
    licenseNumber: 'MD-12346'
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+91 9876543212',
    role: 'patient',
    department: null,
    specialization: null,
    experience: null,
    status: 'active',
    lastActive: '2024-01-15 09:45 AM',
    joinDate: '2023-08-10',
    visitsCount: 5,
    address: '789 Patient Lane, City',
    emergencyContact: '+91 9876543213'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+91 9876543214',
    role: 'patient',
    department: null,
    specialization: null,
    experience: null,
    status: 'active',
    lastActive: '2024-01-14 02:30 PM',
    joinDate: '2023-12-05',
    visitsCount: 2,
    address: '321 Care Street, City',
    emergencyContact: '+91 9876543215'
  },
  {
    id: 5,
    name: 'Lisa Admin',
    email: 'lisa.admin@hospital.com',
    phone: '+91 9876543216',
    role: 'admin',
    department: 'Administration',
    specialization: 'Hospital Administrator',
    experience: 8,
    status: 'active',
    lastActive: '2024-01-15 12:00 PM',
    joinDate: '2020-01-15',
    address: '555 Admin Plaza, City',
    permissions: ['user_management', 'system_settings', 'reports']
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    email: 'james.wilson@hospital.com',
    phone: '+91 9876543217',
    role: 'doctor',
    department: 'Dermatology',
    specialization: 'Dermatologist',
    experience: 10,
    status: 'inactive',
    lastActive: '2024-01-10 04:20 PM',
    joinDate: '2019-06-12',
    patientsToday: 0,
    address: '777 Skin Care Blvd, City',
    licenseNumber: 'MD-12347'
  }
];

export default function AdminUsersManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, doctors, patients, admins

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesTab = activeTab === 'all' || u.role === activeTab.slice(0, -1); // Remove 's' from plural
    
    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  const getUserStats = () => {
    const total = mockUsers.length;
    const doctors = mockUsers.filter(u => u.role === 'doctor').length;
    const patients = mockUsers.filter(u => u.role === 'patient').length;
    const admins = mockUsers.filter(u => u.role === 'admin').length;
    const active = mockUsers.filter(u => u.status === 'active').length;
    
    return { total, doctors, patients, admins, active };
  };

  const stats = getUserStats();

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      doctor: { color: 'bg-blue-100 text-blue-800', icon: Stethoscope },
      patient: { color: 'bg-green-100 text-green-800', icon: User },
      admin: { color: 'bg-purple-100 text-purple-800', icon: Shield }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.patient;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{role}</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
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

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    setShowDeleteModal(false);
    setSelectedUser(null);
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage doctors, patients, and administrative staff.</p>
        </div>
        <div className="flex space-x-4">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.doctors}</div>
          <div className="text-sm text-gray-600">Doctors</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.patients}</div>
          <div className="text-sm text-gray-600">Patients</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.admins}</div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-500 mb-1">{stats.active}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'all', label: 'All Users', count: stats.total },
              { id: 'doctors', label: 'Doctors', count: stats.doctors },
              { id: 'patients', label: 'Patients', count: stats.patients },
              { id: 'admins', label: 'Admins', count: stats.admins }
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
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {u.role === 'doctor' ? (
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          ) : u.role === 'admin' ? (
                            <Shield className="h-5 w-5 text-purple-600" />
                          ) : (
                            <User className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{u.name}</div>
                          <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {getRoleBadge(u.role)}
                        {u.department && (
                          <div className="text-sm text-gray-500 mt-1">{u.department}</div>
                        )}
                        {u.specialization && (
                          <div className="text-xs text-gray-400">{u.specialization}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.phone}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.lastActive}</div>
                      <div className="text-xs text-gray-500">
                        Joined: {new Date(u.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(u)}
                          className="text-gray-600 hover:text-gray-700 p-1 rounded hover:bg-gray-50"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && !showEditModal && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Full Name</span>
                    <span className="text-lg font-semibold text-gray-900">{selectedUser.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Role</span>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Email</span>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedUser.email}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Phone</span>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedUser.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Address</span>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{selectedUser.address}</span>
                  </div>
                </div>

                {/* Professional Information (for doctors/admins) */}
                {(selectedUser.role === 'doctor' || selectedUser.role === 'admin') && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Department</span>
                      <span className="text-gray-900">{selectedUser.department}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Specialization</span>
                      <span className="text-gray-900">{selectedUser.specialization}</span>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'doctor' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Experience</span>
                      <span className="text-gray-900">{selectedUser.experience} years</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">License Number</span>
                      <span className="text-gray-900">{selectedUser.licenseNumber}</span>
                    </div>
                  </div>
                )}

                {/* Activity Information */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Status</span>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Last Active</span>
                    <span className="text-gray-900">{selectedUser.lastActive}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Join Date</span>
                    <span className="text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Role-specific stats */}
                {selectedUser.role === 'doctor' && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Today&apos;s Performance</span>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-700">
                        Patients seen today: <span className="font-medium">{selectedUser.patientsToday}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUser.role === 'patient' && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Patient Information</span>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Visits:</span>
                          <span className="font-medium ml-2">{selectedUser.visitsCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Emergency Contact:</span>
                          <span className="font-medium ml-2">{selectedUser.emergencyContact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleEditUser(selectedUser)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit User
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
              <p className="text-gray-600 mb-6">
                Create a new user account for the hospital management system.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create User
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

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
              <p className="text-gray-600 mb-6">
                Update information for {selectedUser?.name}.
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

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
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