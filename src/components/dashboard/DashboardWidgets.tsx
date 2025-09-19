'use client';

import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Heart,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Plus
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(change.value)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group text-left w-full"
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </button>
);

interface RecentActivityItem {
  id: string;
  type: 'appointment' | 'queue' | 'consultation' | 'registration';
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'cancelled' | 'in-progress';
}

const ActivityItem: React.FC<{ item: RecentActivityItem }> = ({ item }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'queue': return <Users className="h-4 w-4" />;
      case 'consultation': return <Heart className="h-4 w-4" />;
      case 'registration': return <Plus className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-gray-100 rounded-lg">
        {getTypeIcon(item.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{item.title}</p>
        <p className="text-xs text-gray-600">{item.description}</p>
      </div>
      <div className="text-right">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
          {item.status.replace('-', ' ')}
        </span>
        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
      </div>
    </div>
  );
};

const DashboardWidgets: React.FC<{ role: string }> = ({ role }) => {
  // Mock data for different roles
  const getStatsData = () => {
    if (role === 'patient') {
      return [
        {
          title: 'Queue Position',
          value: '#3',
          change: { value: 2, type: 'decrease' as const },
          icon: Users,
          color: 'blue' as const
        },
        {
          title: 'Next Appointment',
          value: 'Today',
          icon: Calendar,
          color: 'green' as const
        },
        {
          title: 'Wait Time',
          value: '15 min',
          change: { value: 5, type: 'decrease' as const },
          icon: Clock,
          color: 'yellow' as const
        },
        {
          title: 'Health Score',
          value: '85%',
          change: { value: 3, type: 'increase' as const },
          icon: Heart,
          color: 'red' as const
        }
      ];
    }

    if (role === 'doctor') {
      return [
        {
          title: 'Patients Today',
          value: 24,
          change: { value: 12, type: 'increase' as const },
          icon: Users,
          color: 'blue' as const
        },
        {
          title: 'Appointments',
          value: 18,
          change: { value: 5, type: 'increase' as const },
          icon: Calendar,
          color: 'green' as const
        },
        {
          title: 'Queue Length',
          value: 7,
          change: { value: 2, type: 'decrease' as const },
          icon: Clock,
          color: 'yellow' as const
        },
        {
          title: 'Consultations',
          value: 16,
          change: { value: 8, type: 'increase' as const },
          icon: Heart,
          color: 'purple' as const
        }
      ];
    }

    // Admin stats
    return [
      {
        title: 'Total Patients',
        value: 1247,
        change: { value: 8, type: 'increase' as const },
        icon: Users,
        color: 'blue' as const
      },
      {
        title: 'Active Doctors',
        value: 45,
        change: { value: 2, type: 'increase' as const },
        icon: Heart,
        color: 'green' as const
      },
      {
        title: 'Queue Length',
        value: 128,
        change: { value: 15, type: 'decrease' as const },
        icon: Clock,
        color: 'yellow' as const
      },
      {
        title: 'System Health',
        value: '99.9%',
        change: { value: 0.1, type: 'increase' as const },
        icon: Activity,
        color: 'purple' as const
      }
    ];
  };

  const getQuickActions = () => {
    if (role === 'patient') {
      return [
        {
          title: 'Join Queue',
          description: 'Join walk-in queue for immediate consultation',
          icon: Plus,
          color: 'bg-blue-500',
          onClick: () => console.log('Join queue')
        },
        {
          title: 'Book Appointment',
          description: 'Schedule appointment with your preferred doctor',
          icon: Calendar,
          color: 'bg-green-500',
          onClick: () => console.log('Book appointment')
        },
        {
          title: 'View Medical Records',
          description: 'Access your complete medical history',
          icon: Heart,
          color: 'bg-purple-500',
          onClick: () => console.log('View records')
        },
        {
          title: 'Emergency Contact',
          description: 'Contact hospital for emergency assistance',
          icon: AlertCircle,
          color: 'bg-red-500',
          onClick: () => console.log('Emergency')
        }
      ];
    }

    if (role === 'doctor') {
      return [
        {
          title: 'Call Next Patient',
          description: 'Call the next patient from your queue',
          icon: Users,
          color: 'bg-blue-500',
          onClick: () => console.log('Call patient')
        },
        {
          title: 'View Schedule',
          description: 'Check your appointments for today',
          icon: Calendar,
          color: 'bg-green-500',
          onClick: () => console.log('View schedule')
        },
        {
          title: 'Patient Records',
          description: 'Access patient medical records',
          icon: Heart,
          color: 'bg-purple-500',
          onClick: () => console.log('Patient records')
        },
        {
          title: 'Write Prescription',
          description: 'Create prescription for current patient',
          icon: Plus,
          color: 'bg-orange-500',
          onClick: () => console.log('Prescription')
        }
      ];
    }

    return [
      {
        title: 'Add New Patient',
        description: 'Register a new patient in the system',
        icon: Plus,
        color: 'bg-blue-500',
        onClick: () => console.log('Add patient')
      },
      {
        title: 'Manage Queues',
        description: 'Monitor and manage all department queues',
        icon: Users,
        color: 'bg-green-500',
        onClick: () => console.log('Manage queues')
      },
      {
        title: 'Generate Reports',
        description: 'Create system performance and analytics reports',
        icon: BarChart3,
        color: 'bg-purple-500',
        onClick: () => console.log('Generate reports')
      },
      {
        title: 'System Settings',
        description: 'Configure system parameters and settings',
        icon: Activity,
        color: 'bg-orange-500',
        onClick: () => console.log('Settings')
      }
    ];
  };

  const getRecentActivity = (): RecentActivityItem[] => {
    if (role === 'patient') {
      return [
        {
          id: '1',
          type: 'appointment',
          title: 'Appointment Confirmed',
          description: 'Dr. Sarah Johnson - Cardiology',
          time: '2 hours ago',
          status: 'completed'
        },
        {
          id: '2',
          type: 'queue',
          title: 'Joined Queue',
          description: 'Position #3 in Orthopedics queue',
          time: '30 minutes ago',
          status: 'in-progress'
        },
        {
          id: '3',
          type: 'consultation',
          title: 'Consultation Completed',
          description: 'General checkup with Dr. Michael Brown',
          time: '1 day ago',
          status: 'completed'
        }
      ];
    }

    if (role === 'doctor') {
      return [
        {
          id: '1',
          type: 'consultation',
          title: 'Patient Consultation',
          description: 'John Smith - Routine checkup completed',
          time: '15 minutes ago',
          status: 'completed'
        },
        {
          id: '2',
          type: 'appointment',
          title: 'New Appointment',
          description: 'Mary Johnson scheduled for tomorrow',
          time: '1 hour ago',
          status: 'pending'
        },
        {
          id: '3',
          type: 'queue',
          title: 'Patient Called',
          description: 'David Williams called for consultation',
          time: '2 hours ago',
          status: 'in-progress'
        }
      ];
    }

    return [
      {
        id: '1',
        type: 'registration',
        title: 'New Patient Registration',
        description: 'Emily Davis registered in system',
        time: '10 minutes ago',
        status: 'completed'
      },
      {
        id: '2',
        type: 'queue',
        title: 'Queue Alert',
        description: 'Cardiology queue exceeding average wait time',
        time: '25 minutes ago',
        status: 'pending'
      },
      {
        id: '3',
        type: 'appointment',
        title: 'Appointment Cancelled',
        description: 'Robert Wilson cancelled appointment',
        time: '1 hour ago',
        status: 'cancelled'
      }
    ];
  };

  const stats = getStatsData();
  const quickActions = getQuickActions();
  const recentActivity = getRecentActivity();

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {role === 'patient' ? 'Health Trends' : 
               role === 'doctor' ? 'Patient Flow' : 'System Overview'}
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would be here</p>
              <p className="text-xs text-gray-400">Integration with Chart.js or similar</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity.map(item => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;