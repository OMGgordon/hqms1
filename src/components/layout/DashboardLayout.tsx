'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Users,
  Calendar,
  Clock,
  UserCheck,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Activity,
  FileText,
  BarChart3,
  Shield,
  Heart,
  Stethoscope,
  Building2,
  Phone,
  MessageSquare,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: NavigationItem[];
  roles?: string[];
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);

  // Navigation structure based on user role
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [];

    if (user?.role === 'patient') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Home,
          href: '/patient/dashboard'
        },
        {
          id: 'queue',
          label: 'Queue Management',
          icon: Users,
          children: [
            { id: 'join-queue', label: 'Join Queue', icon: UserCheck, href: '/patient/queue/join' },
            { id: 'queue-status', label: 'My Queue Status', icon: Clock, href: '/patient/queue/status' }
          ]
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: Calendar,
          children: [
            { id: 'book-appointment', label: 'Book Appointment', icon: Calendar, href: '/patient/appointments/book' },
            { id: 'my-appointments', label: 'My Appointments', icon: Clock, href: '/patient/appointments' },
            { id: 'appointment-history', label: 'History', icon: FileText, href: '/patient/appointments/history' }
          ]
        },
        {
          id: 'medical',
          label: 'Medical Records',
          icon: Heart,
          children: [
            { id: 'medical-history', label: 'Medical History', icon: FileText, href: '/patient/medical/history' },
            { id: 'prescriptions', label: 'Prescriptions', icon: FileText, href: '/patient/medical/prescriptions' },
            { id: 'lab-results', label: 'Lab Results', icon: Activity, href: '/patient/medical/labs' }
          ]
        },
        {
          id: 'profile',
          label: 'Profile & Settings',
          icon: User,
          children: [
            { id: 'personal-info', label: 'Personal Information', icon: User, href: '/patient/profile' },
            { id: 'insurance', label: 'Insurance Details', icon: Shield, href: '/patient/profile/insurance' },
            { id: 'emergency-contact', label: 'Emergency Contact', icon: Phone, href: '/patient/profile/emergency' }
          ]
        },
        {
          id: 'support',
          label: 'Support',
          icon: HelpCircle,
          children: [
            { id: 'help', label: 'Help Center', icon: HelpCircle, href: '/patient/support/help' },
            { id: 'contact', label: 'Contact Hospital', icon: MessageSquare, href: '/patient/support/contact' }
          ]
        }
      ];
    }

    if (user?.role === 'doctor') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Home,
          href: '/doctor/dashboard'
        },
        {
          id: 'queue',
          label: 'Queue Management',
          icon: Users,
          children: [
            { id: 'current-queue', label: 'Current Queue', icon: Users, href: '/doctor/queue/current' },
            { id: 'call-patient', label: 'Call Next Patient', icon: UserCheck, href: '/doctor/queue/call' },
            { id: 'queue-history', label: 'Queue History', icon: FileText, href: '/doctor/queue/history' }
          ]
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: Calendar,
          children: [
            { id: 'todays-schedule', label: "Today&apos;s Schedule", icon: Calendar, href: '/doctor/appointments/today' },
            { id: 'schedule-calendar', label: 'Schedule Calendar', icon: Calendar, href: '/doctor/appointments/calendar' },
            { id: 'appointment-requests', label: 'Appointment Requests', icon: Clock, href: '/doctor/appointments/requests' }
          ]
        },
        {
          id: 'patients',
          label: 'Patient Management',
          icon: Heart,
          children: [
            { id: 'patient-list', label: 'Patient List', icon: Users, href: '/doctor/patients' },
            { id: 'patient-records', label: 'Medical Records', icon: FileText, href: '/doctor/patients/records' },
            { id: 'consultations', label: 'Consultations', icon: Stethoscope, href: '/doctor/patients/consultations' }
          ]
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: BarChart3,
          children: [
            { id: 'patient-reports', label: 'Patient Reports', icon: FileText, href: '/doctor/reports/patients' },
            { id: 'appointment-stats', label: 'Appointment Statistics', icon: BarChart3, href: '/doctor/reports/appointments' }
          ]
        },
        {
          id: 'profile',
          label: 'Profile & Settings',
          icon: Settings,
          href: '/doctor/profile'
        }
      ];
    }

    if (user?.role === 'admin') {
      return [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Home,
          href: '/admin/dashboard'
        },
        {
          id: 'queue-management',
          label: 'Queue Management',
          icon: Users,
          children: [
            { id: 'all-queues', label: 'All Queues', icon: Users, href: '/admin/queues' },
            { id: 'queue-analytics', label: 'Queue Analytics', icon: BarChart3, href: '/admin/queues/analytics' },
            { id: 'queue-settings', label: 'Queue Settings', icon: Settings, href: '/admin/queues/settings' }
          ]
        },
        {
          id: 'user-management',
          label: 'User Management',
          icon: Users,
          children: [
            { id: 'patients', label: 'Patients', icon: Heart, href: '/admin/users/patients' },
            { id: 'doctors', label: 'Doctors', icon: Stethoscope, href: '/admin/users/doctors' },
            { id: 'staff', label: 'Staff Members', icon: Users, href: '/admin/users/staff' },
            { id: 'user-roles', label: 'User Roles', icon: Shield, href: '/admin/users/roles' }
          ]
        },
        {
          id: 'appointments',
          label: 'Appointment Management',
          icon: Calendar,
          children: [
            { id: 'all-appointments', label: 'All Appointments', icon: Calendar, href: '/admin/appointments' },
            { id: 'appointment-calendar', label: 'Calendar View', icon: Calendar, href: '/admin/appointments/calendar' },
            { id: 'appointment-reports', label: 'Reports', icon: FileText, href: '/admin/appointments/reports' }
          ]
        },
        {
          id: 'departments',
          label: 'Department Management',
          icon: Building2,
          children: [
            { id: 'department-list', label: 'Departments', icon: Building2, href: '/admin/departments' },
            { id: 'department-schedules', label: 'Schedules', icon: Clock, href: '/admin/departments/schedules' },
            { id: 'department-analytics', label: 'Analytics', icon: BarChart3, href: '/admin/departments/analytics' }
          ]
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: BarChart3,
          children: [
            { id: 'system-overview', label: 'System Overview', icon: BarChart3, href: '/admin/reports/overview' },
            { id: 'patient-analytics', label: 'Patient Analytics', icon: Users, href: '/admin/reports/patients' },
            { id: 'doctor-performance', label: 'Doctor Performance', icon: Stethoscope, href: '/admin/reports/doctors' },
            { id: 'wait-time-analysis', label: 'Wait Time Analysis', icon: Clock, href: '/admin/reports/wait-times' }
          ]
        },
        {
          id: 'system',
          label: 'System Settings',
          icon: Settings,
          children: [
            { id: 'general-settings', label: 'General Settings', icon: Settings, href: '/admin/settings/general' },
            { id: 'notification-settings', label: 'Notifications', icon: Bell, href: '/admin/settings/notifications' },
            { id: 'system-backup', label: 'Backup & Recovery', icon: Shield, href: '/admin/settings/backup' }
          ]
        }
      ];
    }

    return [];
  };

  const navigationItems = getNavigationItems();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavigationItem): boolean => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some(child => child.href && isActive(child.href));
    }
    return false;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isParentActive(item);

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              router.push(item.href);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
            active
              ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
              : 'text-gray-700 hover:bg-gray-100'
          } ${level > 0 ? 'ml-4' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="font-medium">{item.label}</span>
          </div>
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="h-4 w-4 text-gray-500" /> : 
              <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 ml-4 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HQMS</h1>
              <p className="text-xs text-gray-500">Hospital Management System</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  const Sidebar = () => (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      sidebarOpen ? 'w-64' : 'w-16'
    } fixed left-0 top-0 h-full z-40 overflow-y-auto`}>
      <div className="p-6">
        {sidebarOpen && (
          <div className="mb-8">
            <div className="flex items-center space-x-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                user?.role === 'patient' ? 'bg-green-100' :
                user?.role === 'doctor' ? 'bg-blue-100' :
                'bg-purple-100'
              }`}>
                {user?.role === 'patient' && <Heart className="h-6 w-6 text-green-600" />}
                {user?.role === 'doctor' && <Stethoscope className="h-6 w-6 text-blue-600" />}
                {user?.role === 'admin' && <Shield className="h-6 w-6 text-purple-600" />}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>
      </div>
    </aside>
  );

  const Breadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    return (
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="h-4 w-4" />
          {pathSegments.map((segment, index) => (
            <React.Fragment key={index}>
              <ChevronRight className="h-4 w-4" />
              <span className={index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : ''}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <Breadcrumbs />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;