'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientData } from '@/lib/mockData';
import {
  Bell,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  Heart,
  Pill,
  Shield,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Archive,
  Star,
  Eye,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Sarah Johnson is scheduled for tomorrow at 10:30 AM. Please arrive 15 minutes early.',
    timestamp: new Date('2024-01-19T14:30:00'),
    read: false,
    priority: 'high',
    actionRequired: true,
    icon: Calendar,
    color: 'blue',
    category: 'appointment',
    relatedData: {
      appointmentId: 'APT-001234',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '2024-01-20',
      time: '10:30 AM'
    }
  },
  {
    id: 2,
    type: 'test_result',
    title: 'Lab Results Available',
    message: 'Your Complete Blood Count (CBC) results are now available. All parameters are within normal limits.',
    timestamp: new Date('2024-01-18T16:45:00'),
    read: false,
    priority: 'medium',
    actionRequired: false,
    icon: FileText,
    color: 'green',
    category: 'medical',
    relatedData: {
      testType: 'Complete Blood Count (CBC)',
      status: 'Normal',
      orderedBy: 'Dr. Sarah Johnson'
    }
  },
  {
    id: 3,
    type: 'billing',
    title: 'Payment Due Reminder',
    message: 'Your bill for consultation with Dr. Michael Chen (Invoice #INV-2024-002) is due on February 22nd. Amount due: $450.00',
    timestamp: new Date('2024-01-17T10:00:00'),
    read: true,
    priority: 'high',
    actionRequired: true,
    icon: AlertCircle,
    color: 'red',
    category: 'billing',
    relatedData: {
      billNumber: 'INV-2024-002',
      amount: 450.00,
      dueDate: '2024-02-22'
    }
  },
  {
    id: 4,
    type: 'medication',
    title: 'Medication Refill Reminder',
    message: 'Your prescription for Lisinopril is running low. You have 3 days remaining. Would you like to request a refill?',
    timestamp: new Date('2024-01-16T09:30:00'),
    read: true,
    priority: 'medium',
    actionRequired: true,
    icon: Pill,
    color: 'orange',
    category: 'medication',
    relatedData: {
      medication: 'Lisinopril 10mg',
      daysRemaining: 3,
      prescribedBy: 'Dr. Sarah Johnson'
    }
  },
  {
    id: 5,
    type: 'health_alert',
    title: 'Cholesterol Levels Alert',
    message: 'Your recent lipid panel shows elevated LDL cholesterol. Please schedule a follow-up appointment to discuss treatment options.',
    timestamp: new Date('2024-01-15T13:20:00'),
    read: true,
    priority: 'high',
    actionRequired: true,
    icon: Heart,
    color: 'red',
    category: 'health',
    relatedData: {
      testResult: 'Lipid Panel',
      parameter: 'LDL Cholesterol',
      value: '118 mg/dL',
      recommendedAction: 'Schedule follow-up'
    }
  },
  {
    id: 6,
    type: 'insurance',
    title: 'Insurance Claim Processed',
    message: 'Your insurance claim for cardiology consultation has been processed. Coverage amount: $680.00. Your portion: $170.00',
    timestamp: new Date('2024-01-14T11:15:00'),
    read: true,
    priority: 'low',
    actionRequired: false,
    icon: Shield,
    color: 'blue',
    category: 'insurance',
    relatedData: {
      claimNumber: 'CLM-2024-001',
      coverageAmount: 680.00,
      patientPortion: 170.00
    }
  },
  {
    id: 7,
    type: 'appointment_confirmed',
    title: 'Appointment Confirmed',
    message: 'Your appointment request with Dr. James Wilson for January 25th has been confirmed. You will receive a reminder 24 hours before.',
    timestamp: new Date('2024-01-13T15:45:00'),
    read: true,
    priority: 'low',
    actionRequired: false,
    icon: CheckCircle,
    color: 'green',
    category: 'appointment',
    relatedData: {
      appointmentId: 'APT-001237',
      doctor: 'Dr. James Wilson',
      date: '2024-01-25',
      time: '11:30 AM'
    }
  },
  {
    id: 8,
    type: 'system',
    title: 'Profile Update Required',
    message: 'Please update your emergency contact information to ensure we can reach you in case of emergency.',
    timestamp: new Date('2024-01-12T08:30:00'),
    read: true,
    priority: 'medium',
    actionRequired: true,
    icon: User,
    color: 'gray',
    category: 'system',
    relatedData: {
      section: 'Emergency Contact',
      lastUpdated: '2023-06-15'
    }
  }
];

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const categories = [
    { value: 'all', label: 'All', icon: Bell },
    { value: 'appointment', label: 'Appointments', icon: Calendar },
    { value: 'medical', label: 'Medical', icon: FileText },
    { value: 'billing', label: 'Billing', icon: AlertCircle },
    { value: 'medication', label: 'Medication', icon: Pill },
    { value: 'health', label: 'Health Alerts', icon: Heart },
    { value: 'insurance', label: 'Insurance', icon: Shield },
    { value: 'system', label: 'System', icon: Settings }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
    const matchesRead = !showUnreadOnly || !notification.read;
    return matchesSearch && matchesCategory && matchesPriority && matchesRead;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'gray': return 'bg-gray-100 text-gray-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your appointments, test results, and health information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Mail className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Action Required</p>
              <p className="text-2xl font-bold text-purple-600">
                {notifications.filter(n => n.actionRequired && !n.read).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
            <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Unread only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => {
          const Icon = notification.icon;
          const isSelected = selectedNotifications.includes(notification.id);
          
          return (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${
                notification.read 
                  ? 'border-gray-100' 
                  : 'border-blue-200 bg-blue-50'
              } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleNotificationSelection(notification.id)}
                    className="rounded"
                  />
                  <div className={`p-3 rounded-lg ${getNotificationColor(notification.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className={`text-lg font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {notification.actionRequired && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Action Required
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-gray-600 mb-4 ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  
                  {/* Related Data */}
                  {notification.relatedData && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {Object.entries(notification.relatedData).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="font-medium text-gray-900">
                              {typeof value === 'number' && key.includes('amount') 
                                ? `$${value.toFixed(2)}` 
                                : String(value)
                              }
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      {notification.actionRequired && (
                        <button className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Take Action</span>
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
                        <Star className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  selectedNotifications.forEach(id => markAsRead(id));
                  setSelectedNotifications([]);
                }}
                className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
              >
                Mark as Read
              </button>
              <button
                onClick={() => {
                  selectedNotifications.forEach(id => deleteNotification(id));
                  setSelectedNotifications([]);
                }}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive browser notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}