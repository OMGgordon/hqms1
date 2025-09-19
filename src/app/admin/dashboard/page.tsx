'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardWidgets from '@/components/dashboard/DashboardWidgets';
import { 
  getAdminData, 
  mockDepartments, 
  mockPatients, 
  mockAppointments,
  mockDoctors
} from '@/lib/mockData';
import {
  Users,
  Calendar,
  Building2,
  Activity,
  FileText,
  AlertCircle,
  CheckCircle,
  User,
  BarChart3,
  UserCheck,
  Stethoscope,
  Plus,
  Settings,
  Shield,
  Database,
  Monitor,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
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

  const adminData = getAdminData();

  // Calculate real-time statistics using direct mock data access
  const totalPatients = mockPatients.length;
  const activeDoctors = adminData.totalDoctors;
  const todayAppointments = mockAppointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.date).toDateString() === today;
  }).length;
  const activeDepartments = mockDepartments.length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Complete overview of hospital operations and performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </button>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <DashboardWidgets role="admin" />

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium">↑ 12%</span>
            <span className="text-gray-600 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{activeDoctors}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium">↑ 3%</span>
            <span className="text-gray-600 ml-1">from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today&apos;s Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{todayAppointments}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-purple-600 font-medium">89%</span>
            <span className="text-gray-600 ml-1">capacity</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">{activeDepartments}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-orange-600 font-medium">All</span>
            <span className="text-gray-600 ml-1">operational</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">Healthy</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Monitor className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="text-green-600 font-medium">99.9%</span>
            <span className="text-gray-600 ml-1">uptime</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>

          <div className="space-y-4">
            {mockDepartments.map(department => {
              const departmentDoctors = mockDoctors.filter((d: any) => d.department === department.name);
              const queueCount = 0; // Mock queue count for now
              
              return (
                <div key={department.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{department.name}</p>
                        <p className="text-sm text-gray-600">{department.location}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{departmentDoctors.length}</p>
                      <p className="text-gray-600">Doctors</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{queueCount}</p>
                      <p className="text-gray-600">Queue</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">85%</p>
                      <p className="text-gray-600">Capacity</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Server Performance</span>
                <span className="text-sm text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Database Health</span>
                <span className="text-sm text-green-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Network Connectivity</span>
                <span className="text-sm text-green-600">Optimal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '97%' }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">99.9%</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">1.2s</p>
                <p className="text-sm text-gray-600">Avg Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Logs
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            {
              id: 1,
              type: 'appointment',
              message: 'New appointment scheduled for Dr. Smith',
              time: '2 minutes ago',
              icon: Calendar,
              iconColor: 'text-blue-600',
              bgColor: 'bg-blue-100'
            },
            {
              id: 2,
              type: 'queue',
              message: 'Patient #45 joined Cardiology queue',
              time: '5 minutes ago',
              icon: Users,
              iconColor: 'text-orange-600',
              bgColor: 'bg-orange-100'
            },
            {
              id: 3,
              type: 'system',
              message: 'Database backup completed successfully',
              time: '15 minutes ago',
              icon: Database,
              iconColor: 'text-green-600',
              bgColor: 'bg-green-100'
            },
            {
              id: 4,
              type: 'user',
              message: 'New doctor registered: Dr. Johnson',
              time: '1 hour ago',
              icon: UserCheck,
              iconColor: 'text-purple-600',
              bgColor: 'bg-purple-100'
            },
            {
              id: 5,
              type: 'alert',
              message: 'High queue volume in Emergency department',
              time: '2 hours ago',
              icon: AlertCircle,
              iconColor: 'text-red-600',
              bgColor: 'bg-red-100'
            }
          ].map(activity => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`p-2 ${activity.bgColor} rounded-lg`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-600">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Administration</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <Users className="h-6 w-6 text-blue-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Manage Users</p>
              </button>
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <Building2 className="h-6 w-6 text-green-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Departments</p>
              </button>
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <BarChart3 className="h-6 w-6 text-purple-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Reports</p>
              </button>
              <button className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                <Settings className="h-6 w-6 text-orange-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-900">System Config</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}