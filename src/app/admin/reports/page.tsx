'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Filter,
  Eye,
  Users,
  Activity,
  Clock,
  DollarSign,
  Building2,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  User,
  FileText,
  PieChart,
  LineChart
} from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: 1,
    title: 'Patient Flow Analysis',
    description: 'Daily patient flow patterns and trends',
    type: 'analytics',
    department: 'All Departments',
    dateRange: 'Last 30 days',
    status: 'completed',
    generatedBy: 'System',
    generatedDate: '2024-01-15 10:30 AM',
    fileSize: '2.4 MB',
    format: 'PDF',
    insights: 'Patient flow increased by 15% compared to last month'
  },
  {
    id: 2,
    title: 'Department Performance Report',
    description: 'Comprehensive performance metrics for all departments',
    type: 'performance',
    department: 'All Departments',
    dateRange: 'Q4 2023',
    status: 'completed',
    generatedBy: 'Admin',
    generatedDate: '2024-01-14 02:15 PM',
    fileSize: '5.1 MB',
    format: 'Excel',
    insights: 'Cardiology department shows highest patient satisfaction'
  },
  {
    id: 3,
    title: 'Financial Summary',
    description: 'Revenue and expense analysis',
    type: 'financial',
    department: 'Administration',
    dateRange: 'Last 7 days',
    status: 'generating',
    generatedBy: 'Finance Team',
    generatedDate: null,
    fileSize: null,
    format: 'PDF',
    insights: null
  },
  {
    id: 4,
    title: 'Doctor Utilization Report',
    description: 'Doctor availability and patient load analysis',
    type: 'staffing',
    department: 'All Departments',
    dateRange: 'Last 30 days',
    status: 'completed',
    generatedBy: 'HR Department',
    generatedDate: '2024-01-13 09:45 AM',
    fileSize: '1.8 MB',
    format: 'PDF',
    insights: 'Average doctor utilization rate is 78%'
  },
  {
    id: 5,
    title: 'Equipment Maintenance Log',
    description: 'Medical equipment status and maintenance schedules',
    type: 'maintenance',
    department: 'Facilities',
    dateRange: 'Last 90 days',
    status: 'completed',
    generatedBy: 'Maintenance Team',
    generatedDate: '2024-01-12 11:20 AM',
    fileSize: '3.2 MB',
    format: 'Excel',
    insights: '5 equipment items due for maintenance this week'
  }
];

// Mock dashboard metrics
const mockMetrics = {
  totalPatients: 1247,
  patientsChange: 12.5,
  totalDoctors: 45,
  doctorsChange: 2.1,
  avgWaitTime: 18,
  waitTimeChange: -8.3,
  patientSatisfaction: 4.2,
  satisfactionChange: 3.8,
  departmentPerformance: [
    { name: 'Cardiology', patients: 145, satisfaction: 4.5, waitTime: 15, efficiency: 92 },
    { name: 'Orthopedics', patients: 98, satisfaction: 4.3, waitTime: 22, efficiency: 87 },
    { name: 'General Medicine', patients: 234, satisfaction: 4.1, waitTime: 18, efficiency: 85 },
    { name: 'Dermatology', patients: 67, satisfaction: 4.4, waitTime: 25, efficiency: 83 },
    { name: 'Neurology', patients: 89, satisfaction: 4.6, waitTime: 20, efficiency: 90 }
  ]
};

export default function AdminReports() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview'); // overview, reports, analytics
  const [typeFilter, setTypeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  const filteredReports = mockReports.filter(report => {
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesDepartment = departmentFilter === 'all' || report.department === departmentFilter;
    return matchesType && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      generating: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed;
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3" />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      analytics: BarChart3,
      performance: TrendingUp,
      financial: DollarSign,
      staffing: Users,
      maintenance: Activity
    };
    
    const Icon = icons[type as keyof typeof icons] || FileText;
    return <Icon className="h-5 w-5" />;
  };

  const getChangeIndicator = (change: number) => {
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center space-x-1 ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{Math.abs(change)}%</span>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics.</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: PieChart }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{mockMetrics.totalPatients.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Patients</div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    {getChangeIndicator(mockMetrics.patientsChange)}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{mockMetrics.totalDoctors}</div>
                      <div className="text-sm text-gray-600">Active Doctors</div>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Stethoscope className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    {getChangeIndicator(mockMetrics.doctorsChange)}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{mockMetrics.avgWaitTime}m</div>
                      <div className="text-sm text-gray-600">Avg Wait Time</div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    {getChangeIndicator(mockMetrics.waitTimeChange)}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{mockMetrics.patientSatisfaction}/5</div>
                      <div className="text-sm text-gray-600">Patient Satisfaction</div>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-3">
                    {getChangeIndicator(mockMetrics.satisfactionChange)}
                  </div>
                </div>
              </div>

              {/* Department Performance */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Performance</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Satisfaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wait Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Efficiency
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockMetrics.departmentPerformance.map((dept, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">{dept.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{dept.patients}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-900">{dept.satisfaction}/5</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full mr-1 ${
                                      i < Math.floor(dept.satisfaction) ? 'bg-yellow-400' : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900">{dept.waitTime}min</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{ width: `${dept.efficiency}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900">{dept.efficiency}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex space-x-4">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="analytics">Analytics</option>
                    <option value="performance">Performance</option>
                    <option value="financial">Financial</option>
                    <option value="staffing">Staffing</option>
                    <option value="maintenance">Maintenance</option>
                  </select>

                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Departments</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {filteredReports.length} of {mockReports.length} reports
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getTypeIcon(report.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                            <span>Department: {report.department}</span>
                            <span>•</span>
                            <span>Range: {report.dateRange}</span>
                            {report.generatedDate && (
                              <>
                                <span>•</span>
                                <span>Generated: {report.generatedDate}</span>
                              </>
                            )}
                          </div>
                          
                          {report.insights && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800 font-medium">Key Insight:</p>
                              <p className="text-sm text-blue-700">{report.insights}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {getStatusBadge(report.status)}
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {report.status === 'completed' && (
                            <button className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50">
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-500">Try adjusting your filters or generate a new report.</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <LineChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-gray-500 mb-6">Interactive charts and data visualization will be displayed here.</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  View Analytics Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h3>
                  <p className="text-gray-500">{selectedReport.description}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <AlertCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Type</span>
                    <span className="text-gray-900 capitalize">{selectedReport.type}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Status</span>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Department</span>
                    <span className="text-gray-900">{selectedReport.department}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-1">Date Range</span>
                    <span className="text-gray-900">{selectedReport.dateRange}</span>
                  </div>
                </div>

                {selectedReport.generatedDate && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Generated By</span>
                      <span className="text-gray-900">{selectedReport.generatedBy}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Generated Date</span>
                      <span className="text-gray-900">{selectedReport.generatedDate}</span>
                    </div>
                  </div>
                )}

                {selectedReport.fileSize && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">File Size</span>
                      <span className="text-gray-900">{selectedReport.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Format</span>
                      <span className="text-gray-900">{selectedReport.format}</span>
                    </div>
                  </div>
                )}

                {selectedReport.insights && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Key Insights</span>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">{selectedReport.insights}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  {selectedReport.status === 'completed' && (
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h3>
              <p className="text-gray-600 mb-6">
                Create a new report with customized parameters and data ranges.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Generate Report
                </button>
                <button
                  onClick={() => setShowGenerateModal(false)}
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