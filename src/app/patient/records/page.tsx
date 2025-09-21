'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getPatientData } from '@/lib/mockData';
import { 
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Weight,
  Ruler,
  Pill,
  TestTube,
  Image,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Share2,
  Printer,
  Upload,
  FolderOpen,
  Clock as Timeline,
  BarChart3,
  LineChart,
  Image as FileImage,
  FileText as FilePdf,
  FileSpreadsheet,
  Globe,
  Shield,
  BookOpen,
  Clipboard,
  Hospital,
  Phone,
  Mail,
  MapPin,
  Star,
  Info,
  Zap,
  Target,
  Archive,
  X
} from 'lucide-react';// Enhanced mock medical records data with comprehensive health information
const mockMedicalRecords = [
  {
    id: 1,
    date: '2024-01-15',
    type: 'Lab Report',
    title: 'Complete Blood Count (CBC)',
    doctor: 'Dr. Sarah Johnson',
    department: 'Pathology',
    status: 'completed',
    category: 'lab',
    priority: 'normal',
    summary: 'Blood test results showing normal ranges for all parameters',
    results: [
      { parameter: 'Hemoglobin', value: '14.2 g/dL', range: '12.0-15.5 g/dL', status: 'normal', trend: 'stable' },
      { parameter: 'White Blood Cell Count', value: '6.8 K/μL', range: '4.5-11.0 K/μL', status: 'normal', trend: 'up' },
      { parameter: 'Platelet Count', value: '285 K/μL', range: '150-450 K/μL', status: 'normal', trend: 'stable' },
      { parameter: 'Hematocrit', value: '42.1%', range: '36.0-46.0%', status: 'normal', trend: 'down' }
    ],
    attachments: [
      { name: 'cbc_report.pdf', type: 'pdf', size: '256 KB', url: '/documents/cbc_report.pdf' },
      { name: 'lab_summary.xlsx', type: 'excel', size: '45 KB', url: '/documents/lab_summary.xlsx' }
    ],
    tags: ['routine', 'annual', 'preventive'],
    notes: 'All parameters within normal limits. Continue current medication regimen.',
    followUp: 'Recheck in 6 months',
    cost: 120.00,
    insurance: 'Covered'
  },
  {
    id: 2,
    date: '2024-01-10',
    type: 'Imaging',
    title: 'Chest X-Ray',
    doctor: 'Dr. Michael Chen',
    department: 'Radiology',
    status: 'completed',
    category: 'imaging',
    priority: 'routine',
    summary: 'Chest X-ray examination - no abnormalities detected',
    findings: [
      'Heart size and shape are normal',
      'Lung fields are clear bilaterally',
      'No evidence of pneumonia or effusion',
      'Skeletal structures appear normal'
    ],
    attachments: [
      { name: 'chest_xray.jpg', type: 'image', size: '2.1 MB', url: '/images/chest_xray.jpg' },
      { name: 'radiology_report.pdf', type: 'pdf', size: '340 KB', url: '/documents/radiology_report.pdf' }
    ],
    tags: ['routine', 'screening'],
    notes: 'Normal chest X-ray. No follow-up required unless symptoms develop.',
    followUp: 'As needed',
    cost: 185.00,
    insurance: 'Covered'
  },
  {
    id: 3,
    date: '2024-01-05',
    type: 'Consultation',
    title: 'Cardiology Consultation',
    doctor: 'Dr. Emily Davis',
    department: 'Cardiology',
    status: 'completed',
    category: 'consultation',
    priority: 'normal',
    summary: 'Routine cardiac evaluation - no significant findings',
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      weight: '165 lbs',
      height: '5\'8"',
      oxygenSaturation: '98%',
      respiratoryRate: '16/min'
    },
    diagnosis: [
      { code: 'I10', description: 'Essential Hypertension', severity: 'mild' },
      { code: 'Z51.81', description: 'Therapeutic drug monitoring', severity: 'routine' }
    ],
    medications: [
      { 
        name: 'Lisinopril', 
        dosage: '10mg', 
        frequency: 'Once daily',
        duration: '3 months',
        startDate: '2024-01-05',
        prescribedBy: 'Dr. Emily Davis'
      },
      { 
        name: 'Metformin', 
        dosage: '500mg', 
        frequency: 'Twice daily',
        duration: 'Ongoing',
        startDate: '2023-06-15',
        prescribedBy: 'Dr. Emily Davis'
      }
    ],
    attachments: [
      { name: 'consultation_notes.pdf', type: 'pdf', size: '180 KB', url: '/documents/consultation_notes.pdf' },
      { name: 'ecg_results.pdf', type: 'pdf', size: '95 KB', url: '/documents/ecg_results.pdf' }
    ],
    tags: ['cardiology', 'follow-up', 'hypertension'],
    notes: 'Continue current antihypertensive therapy. Follow up in 3 months.',
    followUp: '3 months',
    cost: 285.00,
    insurance: 'Covered'
  },
  {
    id: 4,
    date: '2023-12-20',
    type: 'Lab Report',
    title: 'Comprehensive Metabolic Panel',
    doctor: 'Dr. Sarah Johnson',
    department: 'Pathology',
    status: 'completed',
    category: 'lab',
    priority: 'routine',
    summary: 'Complete metabolic assessment including glucose, electrolytes, and kidney function',
    results: [
      { parameter: 'Glucose', value: '92 mg/dL', range: '70-99 mg/dL', status: 'normal', trend: 'stable' },
      { parameter: 'Creatinine', value: '1.0 mg/dL', range: '0.7-1.3 mg/dL', status: 'normal', trend: 'stable' },
      { parameter: 'BUN', value: '18 mg/dL', range: '6-20 mg/dL', status: 'normal', trend: 'up' },
      { parameter: 'Sodium', value: '140 mEq/L', range: '136-145 mEq/L', status: 'normal', trend: 'stable' },
      { parameter: 'Potassium', value: '4.2 mEq/L', range: '3.5-5.0 mEq/L', status: 'normal', trend: 'stable' }
    ],
    attachments: [
      { name: 'cmp_report.pdf', type: 'pdf', size: '198 KB', url: '/documents/cmp_report.pdf' }
    ],
    tags: ['metabolic', 'diabetes', 'kidney'],
    notes: 'All metabolic parameters within normal limits. Continue current diabetes management.',
    followUp: '3 months',
    cost: 95.00,
    insurance: 'Covered'
  },
  {
    id: 5,
    date: '2023-12-15',
    type: 'Vaccination',
    title: 'Annual Flu Vaccination',
    doctor: 'Nurse Jennifer Wilson',
    department: 'Preventive Care',
    status: 'completed',
    category: 'vaccination',
    priority: 'routine',
    summary: 'Seasonal influenza vaccine administered',
    vaccine: {
      name: 'Influenza Vaccine (2023-2024)',
      lot: 'FLU2023A',
      manufacturer: 'Sanofi Pasteur',
      site: 'Left deltoid',
      route: 'Intramuscular',
      dose: '0.5 mL',
      expiration: '2024-12-31'
    },
    attachments: [
      { name: 'vaccination_record.pdf', type: 'pdf', size: '85 KB', url: '/documents/vaccination_record.pdf' },
      { name: 'vaccine_info_sheet.pdf', type: 'pdf', size: '120 KB', url: '/documents/vaccine_info.pdf' }
    ],
    tags: ['vaccination', 'preventive', 'flu'],
    notes: 'No adverse reactions observed. Next flu vaccine due October 2024.',
    followUp: 'October 2024',
    cost: 35.00,
    insurance: 'Covered'
  }
];

// Health timeline data for comprehensive health tracking
const healthTimeline = [
  {
    date: '2024-01-15',
    type: 'lab',
    title: 'Complete Blood Count',
    status: 'normal',
    importance: 'routine'
  },
  {
    date: '2024-01-10',
    type: 'imaging',
    title: 'Chest X-Ray',
    status: 'normal',
    importance: 'routine'
  },
  {
    date: '2024-01-05',
    type: 'consultation',
    title: 'Cardiology Follow-up',
    status: 'stable',
    importance: 'important'
  },
  {
    date: '2023-12-20',
    type: 'lab',
    title: 'Metabolic Panel',
    status: 'normal',
    importance: 'routine'
  },
  {
    date: '2023-12-15',
    type: 'vaccination',
    title: 'Flu Vaccine',
    status: 'completed',
    importance: 'preventive'
  }
];

// Health metrics for tracking key indicators
const healthMetrics = {
  bloodPressure: {
    current: '128/82',
    trend: 'stable',
    lastUpdated: '2024-01-05',
    target: '<130/80',
    status: 'controlled'
  },
  weight: {
    current: '168 lbs',
    trend: 'increasing',
    lastUpdated: '2023-11-28',
    target: '160-165 lbs',
    status: 'above-target'
  },
  cholesterol: {
    current: '210 mg/dL',
    trend: 'increasing',
    lastUpdated: '2023-10-30',
    target: '<200 mg/dL',
    status: 'elevated'
  },
  bloodSugar: {
    current: '92 mg/dL',
    trend: 'stable',
    lastUpdated: '2023-12-20',
    target: '70-99 mg/dL',
    status: 'normal'
  }
};

export default function MedicalRecords() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('records');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const categories = [
    { value: 'all', label: 'All Records', icon: FileText },
    { value: 'lab', label: 'Lab Reports', icon: TestTube },
    { value: 'imaging', label: 'Imaging', icon: Image },
    { value: 'consultation', label: 'Consultations', icon: Stethoscope },
    { value: 'vaccination', label: 'Vaccinations', icon: Plus },
    { value: 'procedure', label: 'Procedures', icon: Activity }
  ];

  const filteredRecords = mockMedicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParameterStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'high': return 'text-red-600';
      case 'low': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FilePdf className="h-4 w-4 text-red-600" />;
      case 'image': return <FileImage className="h-4 w-4 text-blue-600" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
      case 'archive': return <Archive className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'lab': return TestTube;
      case 'imaging': return Image;
      case 'consultation': return Stethoscope;
      case 'vaccination': return Plus;
      case 'procedure': return Activity;
      default: return FileText;
    }
  };

  const getHealthMetricColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'controlled': return 'text-blue-600';
      case 'elevated': return 'text-orange-600';
      case 'above-target': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">Comprehensive view of your health history and medical data</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share Records</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'records', name: 'Medical Records', icon: FileText },
            { id: 'timeline', name: 'Health Timeline', icon: Timeline },
            { id: 'metrics', name: 'Health Metrics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Medical Records Tab */}
      {activeTab === 'records' && (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search records, doctors, or departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 ${
                        selectedCategory === category.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Records List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredRecords.map(record => {
                const Icon = getCategoryIcon(record.category);
                const isExpanded = expandedRecord === record.id;
                
                return (
                  <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                              {record.priority && record.priority !== 'normal' && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  {record.priority}
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(record.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{record.doctor} - {record.department}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 mt-2">{record.summary}</p>
                            {record.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {record.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedRecord(record)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setExpandedRecord(isExpanded ? null : record.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          {/* Lab Results */}
                          {record.results && (
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-900 mb-3">Test Results</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-2 font-medium text-gray-700">Parameter</th>
                                      <th className="text-left py-2 font-medium text-gray-700">Value</th>
                                      <th className="text-left py-2 font-medium text-gray-700">Reference Range</th>
                                      <th className="text-left py-2 font-medium text-gray-700">Status</th>
                                      <th className="text-left py-2 font-medium text-gray-700">Trend</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {record.results.map((result: any, index: number) => (
                                      <tr key={index} className="border-b border-gray-100">
                                        <td className="py-2 text-gray-900">{result.parameter}</td>
                                        <td className="py-2 font-medium text-gray-900">{result.value}</td>
                                        <td className="py-2 text-gray-600">{result.range}</td>
                                        <td className={`py-2 font-medium ${getParameterStatusColor(result.status)}`}>
                                          {result.status}
                                        </td>
                                        <td className="py-2">
                                          {getTrendIcon(result.trend)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Enhanced Attachments */}
                          {record.attachments && record.attachments.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-900 mb-3">Documents & Files</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {record.attachments.map((file: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-3">
                                      {getFileIcon(file.type)}
                                      <div>
                                        <p className="text-gray-900 font-medium">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size}</p>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <button className="text-blue-600 hover:text-blue-700">
                                        <Eye className="h-4 w-4" />
                                      </button>
                                      <button className="text-green-600 hover:text-green-700">
                                        <Download className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Vital Signs */}
                          {record.vitals && (
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-900 mb-3">Vital Signs</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(record.vitals).map(([key, value]) => (
                                  <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                    <p className="font-medium text-gray-900">{value as string}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Medications */}
                          {record.medications && (
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-900 mb-3">Medications Prescribed</h4>
                              <div className="space-y-2">
                                {record.medications.map((med: any, index: number) => (
                                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                    <Pill className="h-4 w-4 text-blue-600" />
                                    <div className="flex-1">
                                      <p className="font-medium text-blue-800">{med.name} {med.dosage}</p>
                                      <p className="text-sm text-blue-600">{med.frequency} - {med.duration}</p>
                                      <p className="text-xs text-blue-500">Prescribed by {med.prescribedBy}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cost Information */}
                          {record.cost && (
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-900 mb-3">Billing Information</h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Total Cost:</span>
                                  <span className="font-medium text-gray-900">${record.cost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-gray-600">Insurance:</span>
                                  <span className="text-green-600">{record.insurance}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {record.notes && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                              <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredRecords.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Records</span>
                    <span className="font-bold text-gray-900">{mockMedicalRecords.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Lab Reports</span>
                    <span className="font-bold text-gray-900">
                      {mockMedicalRecords.filter(r => r.category === 'lab').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Consultations</span>
                    <span className="font-bold text-gray-900">
                      {mockMedicalRecords.filter(r => r.category === 'consultation').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Imaging Studies</span>
                    <span className="font-bold text-gray-900">
                      {mockMedicalRecords.filter(r => r.category === 'imaging').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Alerts */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Annual Physical Due</p>
                      <p className="text-xs text-yellow-700">Schedule your yearly checkup</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Medication Refill</p>
                      <p className="text-xs text-blue-700">Lisinopril expires in 2 weeks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Health Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Timeline</h3>
          <div className="space-y-6">
            {healthTimeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.importance === 'critical' ? 'bg-red-100' :
                    event.importance === 'important' ? 'bg-orange-100' :
                    event.importance === 'concerning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {getCategoryIcon(event.type)({ 
                      className: `h-5 w-5 ${
                        event.importance === 'critical' ? 'text-red-600' :
                        event.importance === 'important' ? 'text-orange-600' :
                        event.importance === 'concerning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }` 
                    })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'normal' ? 'bg-green-100 text-green-800' :
                      event.status === 'elevated' ? 'bg-red-100 text-red-800' :
                      event.status === 'stable' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(healthMetrics).map(([key, metric]) => (
            <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${getHealthMetricColor(metric.status)}`}>
                    {metric.status.replace(/-/g, ' ')}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-medium text-gray-900">{metric.current}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="text-gray-700">{metric.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-700">{metric.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Medical Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
              <p className="text-xs text-gray-500">Supports PDF, JPG, PNG files up to 10MB</p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}