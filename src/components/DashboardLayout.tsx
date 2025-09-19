'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  Activity,
  UserCheck,
  Building,
  BarChart,
  Shield,
  Stethoscope,
  Heart,
  UserPlus,
  ClipboardList,
  Database,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
  roles?: ('patient' | 'doctor' | 'admin')[];
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['patient', 'doctor', 'admin']
  },
  {
    name: 'Queue Management',
    href: '/queue',
    icon: Users,
    roles: ['patient', 'doctor', 'admin'],
    children: [
      { name: 'Join Queue', href: '/patient/queue', icon: UserPlus, roles: ['patient'] },
      { name: 'My Queue', href: '/doctor/queue', icon: ClipboardList, roles: ['doctor'] },
      { name: 'All Queues', href: '/admin/queues', icon: Activity, roles: ['admin'] }
    ]
  },
  {
    name: 'Appointments',
    href: '/appointments',
    icon: Calendar,
    roles: ['patient', 'doctor', 'admin'],
    children: [
      { name: 'My Appointments', href: '/patient/appointments', icon: Calendar, roles: ['patient'] },
      { name: 'Book Appointment', href: '/patient/book', icon: UserPlus, roles: ['patient'] },
      { name: 'Patient Schedule', href: '/doctor/schedule', icon: Clock, roles: ['doctor'] },
      { name: 'All Appointments', href: '/admin/appointments', icon: Activity, roles: ['admin'] }
    ]
  },
  {
    name: 'Patients',
    href: '/patients',
    icon: Heart,
    roles: ['doctor', 'admin'],
    children: [
      { name: 'Patient List', href: '/doctor/patients', icon: Users, roles: ['doctor'] },
      { name: 'Add Patient', href: '/admin/patients/add', icon: UserPlus, roles: ['admin'] },
      { name: 'Patient Records', href: '/admin/patients', icon: FileText, roles: ['admin'] }
    ]
  },
  {
    name: 'Medical Records',
    href: '/records',
    icon: FileText,
    roles: ['patient', 'doctor'],
    children: [
      { name: 'My Records', href: '/patient/records', icon: FileText, roles: ['patient'] },
      { name: 'Patient Records', href: '/doctor/records', icon: Database, roles: ['doctor'] }
    ]
  },
  {
    name: 'Doctors',
    href: '/doctors',
    icon: Stethoscope,
    roles: ['admin'],
    children: [
      { name: 'Doctor List', href: '/admin/doctors', icon: Users, roles: ['admin'] },
      { name: 'Add Doctor', href: '/admin/doctors/add', icon: UserPlus, roles: ['admin'] },
      { name: 'Schedules', href: '/admin/schedules', icon: Calendar, roles: ['admin'] }
    ]
  },
  {
    name: 'Departments',
    href: '/departments',
    icon: Building,
    roles: ['admin'],
    children: [
      { name: 'All Departments', href: '/admin/departments', icon: Building, roles: ['admin'] },
      { name: 'Add Department', href: '/admin/departments/add', icon: UserPlus, roles: ['admin'] }
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart,
    roles: ['admin'],
    children: [
      { name: 'Reports', href: '/admin/reports', icon: BarChart, roles: ['admin'] },
      { name: 'Wait Times', href: '/admin/analytics/wait-times', icon: Clock, roles: ['admin'] },
      { name: 'Usage Stats', href: '/admin/analytics/usage', icon: Activity, roles: ['admin'] }
    ]
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserCheck,
    roles: ['patient', 'doctor', 'admin']
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['patient', 'doctor', 'admin']
  }
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  if (!user) {
    return <>{children}</>;
  }

  const filteredNavigation = navigation.filter(item => 
    !item.roles || item.roles.includes(user.role)
  ).map(item => ({
    ...item,
    children: item.children?.filter(child => 
      !child.roles || child.roles.includes(user.role)
    )
  }));

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === `/${user.role}/dashboard` || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getActualHref = (href: string) => {
    if (href === '/dashboard') {
      return `/${user.role}/dashboard`;
    }
    if (href.startsWith('/profile')) {
      return `/${user.role}/profile`;
    }
    if (href.startsWith('/settings')) {
      return `/${user.role}/settings`;
    }
    return href;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 bg-blue-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-white">HQMS</h1>
            <p className="text-xs text-blue-200">Hospital Management</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 bg-blue-600 border-b border-blue-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-blue-200 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    expandedItems.includes(item.name)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    expandedItems.includes(item.name) ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={getActualHref(child.href)}
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(child.href)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <child.icon className="mr-3 h-4 w-4" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={getActualHref(item.href)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">
          <HelpCircle className="mr-3 h-5 w-5" />
          Help & Support
        </button>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 mt-1"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-64 bg-white h-full">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white shadow-lg">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Breadcrumbs */}
              <nav className="ml-4 lg:ml-0">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <Link href="/" className="hover:text-gray-700">
                      <Home className="h-4 w-4" />
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="capitalize font-medium text-gray-900">{user.role} Dashboard</li>
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button className="flex items-center max-w-xs bg-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">{user.name}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}