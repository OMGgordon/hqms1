'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Clock,
  MapPin,
  Stethoscope,
  CheckCircle,
  XCircle,
  RotateCcw,
  Bell,
  Phone,
  AlertTriangle,
  Activity,
  User,
  Calendar
} from 'lucide-react';

export default function QueueStatus() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queueData, setQueueData] = useState({
    queueNumber: 15,
    currentNumber: 8,
    estimatedWait: 25,
    status: 'waiting', // waiting, called, completed, cancelled
    department: 'Cardiology',
    doctor: 'Dr. Sarah Johnson',
    joinTime: '10:30 AM',
    estimatedTime: '11:15 AM'
  });

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time queue updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(prev => {
        const newCurrentNumber = Math.min(prev.currentNumber + Math.random() > 0.7 ? 1 : 0, prev.queueNumber - 1);
        const remainingPatients = prev.queueNumber - newCurrentNumber;
        const newEstimatedWait = Math.max(remainingPatients * 3, 0);
        
        return {
          ...prev,
          currentNumber: newCurrentNumber,
          estimatedWait: newEstimatedWait,
          status: newCurrentNumber === prev.queueNumber - 1 ? 'called' : prev.status
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLeaveQueue = () => {
    setQueueData(prev => ({ ...prev, status: 'cancelled' }));
    setTimeout(() => {
      router.push('/patient/dashboard');
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'called': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <Clock className="h-5 w-5" />;
      case 'called': return <Bell className="h-5 w-5" />;
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  if (queueData.status === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Queue Cancelled</h2>
          <p className="text-gray-600 mb-6">You have left the queue successfully.</p>
          <button
            onClick={() => router.push('/patient/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (queueData.status === 'called') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center border-4 border-green-500 animate-pulse">
          <Bell className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-green-700 mb-2">Your Turn!</h2>
          <p className="text-xl text-gray-600 mb-4">Please proceed to Room 204</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-green-700">Doctor:</span>
              <span className="font-bold text-green-800">{queueData.doctor}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-green-700">Department:</span>
              <span className="font-bold text-green-800">{queueData.department}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">Room:</span>
              <span className="font-bold text-green-800">204</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/patient/dashboard')}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Status</h1>
          <p className="text-gray-600 mt-1">Track your position and estimated wait time.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Queue Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Queue Status</h2>
              <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getStatusColor(queueData.status)}`}>
                {getStatusIcon(queueData.status)}
                <span className="capitalize">{queueData.status}</span>
              </div>
            </div>

            {/* Queue Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Queue Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {queueData.currentNumber} of {queueData.queueNumber}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(queueData.currentNumber / queueData.queueNumber) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-1">#{queueData.queueNumber}</div>
                <div className="text-sm text-blue-700">Your Number</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-1">#{queueData.currentNumber}</div>
                <div className="text-sm text-green-700">Now Serving</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-1">{queueData.estimatedWait}</div>
                <div className="text-sm text-orange-700">Minutes Left</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-1">{queueData.queueNumber - queueData.currentNumber}</div>
                <div className="text-sm text-purple-700">Ahead of You</div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Stethoscope className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{queueData.doctor}</p>
                  <p className="text-sm text-gray-500">Cardiologist</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{queueData.department}</p>
                  <p className="text-sm text-gray-500">2nd Floor, Room 204</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Joined at {queueData.joinTime}</p>
                  <p className="text-sm text-gray-500">Estimated time: {queueData.estimatedTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Refresh Status</span>
            </button>
            
            <button
              onClick={handleLeaveQueue}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <XCircle className="h-5 w-5" />
              <span>Leave Queue</span>
            </button>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Live Updates */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Updates</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Patient #8 called</p>
                  <p className="text-xs text-green-600">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Queue updated</p>
                  <p className="text-xs text-blue-600">5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Estimated delay: +5 min</p>
                  <p className="text-xs text-yellow-600">8 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-700">SMS notifications enabled</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">Call when your turn</span>
              </div>
              
              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                Update notification preferences
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/patient/appointments/book')}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Book next appointment</span>
              </button>
              
              <button 
                onClick={() => router.push('/patient/queue/history')}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
              >
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">View queue history</span>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">Contact support</span>
              </button>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Please Note</h4>
                <p className="text-sm text-amber-700 mt-1">
                  If you miss your call, you may need to rejoin the queue. 
                  Please stay within the hospital premises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}