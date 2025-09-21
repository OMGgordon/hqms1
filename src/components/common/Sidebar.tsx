'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { 
  Home, 
  Calendar, 
  Users, 
  Clock, 
  Settings, 
  LogOut,
  Stethoscope,
  UserCircle,
  ClipboardList,
  FileText,
  Shield,
  Phone,
  History
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'patient':
        return [
          { href: '/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/appointments', icon: Calendar, label: 'Book Appointment' },
          { href: '/appointments/history', icon: History, label: 'Appointment History' },
          { href: '/queue-status', icon: Clock, label: 'Queue Status' },
          { href: '/records', icon: FileText, label: 'Medical Records' },
          { href: '/insurance', icon: Shield, label: 'Insurance' },
          { href: '/emergency-contacts', icon: Phone, label: 'Emergency Contacts' },
          { href: '/profile', icon: UserCircle, label: 'Profile' },
          { href: '/settings', icon: Settings, label: 'Settings' },
        ];
      case 'doctor':
        return [
          { href: '/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/patients', icon: Users, label: 'Patients' },
          { href: '/schedule', icon: Calendar, label: 'Schedule' },
          { href: '/queue', icon: Clock, label: 'Queue' },
        ];
      case 'admin':
        return [
          { href: '/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/manage-queue', icon: ClipboardList, label: 'Manage Queue' },
          { href: '/appointments', icon: Calendar, label: 'Appointments' },
          { href: '/users', icon: Users, label: 'Users' },
          { href: '/reports', icon: Settings, label: 'Reports' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'patient': return 'bg-green-100 text-green-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Stethoscope className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">HQMS</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hospital Queue Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            <Badge className={`text-xs mt-1 ${getRoleBadgeColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          className="w-full flex items-center space-x-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}