'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  CreditCard,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  User,
  Building,
  Hospital,
  Stethoscope,
  Pill,
  Activity,
  TrendingUp,
  TrendingDown,
  Info,
  Star,
  ChevronRight,
  Globe,
  Printer,
  Share2,
  RefreshCw,
  Zap
} from 'lucide-react';

// Mock insurance data
const insuranceData = {
  primaryPlan: {
    id: 1,
    provider: 'Blue Cross Blue Shield',
    planName: 'PPO Premium',
    planType: 'PPO',
    memberId: 'BCBS123456789',
    groupNumber: 'GRP789012',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    status: 'active',
    premium: 485.50,
    deductible: {
      individual: 1500,
      family: 3000,
      met: 650,
      remaining: 850
    },
    outOfPocketMax: {
      individual: 8000,
      family: 16000,
      met: 2150,
      remaining: 5850
    },
    copays: {
      primaryCare: 25,
      specialist: 50,
      urgentCare: 75,
      emergencyRoom: 250
    },
    coinsurance: {
      inNetwork: 20,
      outOfNetwork: 40
    },
    coverage: {
      medical: true,
      dental: false,
      vision: false,
      prescription: true,
      mentalHealth: true
    },
    contacts: {
      memberServices: '1-800-555-0123',
      claims: '1-800-555-0124',
      website: 'www.bcbs.com',
      email: 'support@bcbs.com'
    }
  },
  secondaryPlan: {
    id: 2,
    provider: 'Delta Dental',
    planName: 'Dental PPO Plus',
    planType: 'Dental',
    memberId: 'DD987654321',
    groupNumber: 'DENT456',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31',
    status: 'active',
    premium: 45.00,
    benefits: {
      preventive: { coverage: 100, annual: 'Unlimited' },
      basic: { coverage: 80, annual: '$1,500' },
      major: { coverage: 50, annual: '$1,500' },
      orthodontics: { coverage: 50, lifetime: '$1,500' }
    },
    contacts: {
      memberServices: '1-800-555-0125',
      website: 'www.deltadental.com'
    }
  }
};

// Mock claims data
const claimsData = [
  {
    id: 'CLM-2024-001',
    date: '2024-01-15',
    provider: 'City General Hospital',
    service: 'Laboratory Services',
    serviceDate: '2024-01-10',
    amount: {
      billed: 285.00,
      allowed: 195.50,
      covered: 156.40,
      patientResponsibility: 39.10
    },
    status: 'paid',
    type: 'medical',
    diagnosis: 'Routine lab work',
    explanation: 'Claim processed according to your benefits'
  },
  {
    id: 'CLM-2024-002',
    date: '2024-01-08',
    provider: 'Dr. Sarah Johnson',
    service: 'Office Visit - Specialist',
    serviceDate: '2024-01-05',
    amount: {
      billed: 320.00,
      allowed: 280.00,
      covered: 230.00,
      patientResponsibility: 50.00
    },
    status: 'paid',
    type: 'medical',
    diagnosis: 'Hypertension management',
    explanation: 'Specialist copay applied'
  },
  {
    id: 'CLM-2024-003',
    date: '2024-01-03',
    provider: 'Regional Imaging Center',
    service: 'Chest X-Ray',
    serviceDate: '2023-12-28',
    amount: {
      billed: 450.00,
      allowed: 385.00,
      covered: 308.00,
      patientResponsibility: 77.00
    },
    status: 'processing',
    type: 'medical',
    diagnosis: 'Routine screening',
    explanation: 'Under review'
  },
  {
    id: 'CLM-2023-156',
    date: '2023-12-15',
    provider: 'Downtown Dental',
    service: 'Routine Cleaning',
    serviceDate: '2023-12-10',
    amount: {
      billed: 150.00,
      allowed: 120.00,
      covered: 120.00,
      patientResponsibility: 0.00
    },
    status: 'paid',
    type: 'dental',
    diagnosis: 'Preventive care',
    explanation: '100% coverage for preventive care'
  },
  {
    id: 'CLM-2023-142',
    date: '2023-11-28',
    provider: 'PharmaCare',
    service: 'Prescription Medication',
    serviceDate: '2023-11-25',
    amount: {
      billed: 89.50,
      allowed: 75.00,
      covered: 60.00,
      patientResponsibility: 15.00
    },
    status: 'paid',
    type: 'prescription',
    diagnosis: 'Lisinopril 10mg',
    explanation: 'Generic formulary tier 1'
  }
];

// Mock benefits data
const benefitsData = {
  annual: {
    deductibleProgress: 43.3, // percentage
    outOfPocketProgress: 26.9, // percentage
    totalClaimed: 1294.50,
    totalPaid: 874.40
  },
  utilization: {
    primaryCareVisits: { used: 3, remaining: 'Unlimited' },
    specialistVisits: { used: 5, remaining: 'Unlimited' },
    emergencyVisits: { used: 0, remaining: 'Unlimited' },
    prescriptions: { used: 12, remaining: 'Unlimited' }
  }
};

export default function InsuranceManagement() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [claimFilter, setClaimFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const filteredClaims = claimsData.filter(claim => {
    const matchesSearch = claim.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = claimFilter === 'all' || claim.type === claimFilter || claim.status === claimFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'denied': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
          <p className="text-gray-600 mt-1">Manage your insurance plans, claims, and benefits</p>
        </div>
        <div className="flex space-x-3">
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload Card</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Plan</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: Shield },
            { id: 'plans', name: 'Insurance Plans', icon: CreditCard },
            { id: 'claims', name: 'Claims', icon: FileText },
            { id: 'benefits', name: 'Benefits', icon: Star }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Plans</p>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">YTD Claims</p>
                  <p className="text-2xl font-bold text-green-600">{claimsData.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deductible Met</p>
                  <p className="text-2xl font-bold text-purple-600">{benefitsData.annual.deductibleProgress.toFixed(0)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Saved</p>
                  <p className="text-2xl font-bold text-orange-600">${(benefitsData.annual.totalClaimed - benefitsData.annual.totalPaid).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Plans Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Primary Insurance</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{insuranceData.primaryPlan.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{insuranceData.primaryPlan.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member ID:</span>
                  <span className="font-medium">{insuranceData.primaryPlan.memberId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deductible:</span>
                  <span className="font-medium">${insuranceData.primaryPlan.deductible.met} / ${insuranceData.primaryPlan.deductible.individual}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Deductible Progress</span>
                  <span>{benefitsData.annual.deductibleProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${benefitsData.annual.deductibleProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dental Insurance</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{insuranceData.secondaryPlan.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{insuranceData.secondaryPlan.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member ID:</span>
                  <span className="font-medium">{insuranceData.secondaryPlan.memberId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preventive:</span>
                  <span className="font-medium text-green-600">{insuranceData.secondaryPlan.benefits.preventive.coverage}% covered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
              <button 
                onClick={() => setActiveTab('claims')}
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {claimsData.slice(0, 3).map(claim => (
                <div key={claim.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(claim.status)}
                    <div>
                      <p className="font-medium text-gray-900">{claim.service}</p>
                      <p className="text-sm text-gray-600">{claim.provider} • {new Date(claim.serviceDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${claim.amount.billed.toFixed(2)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insurance Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Primary Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{insuranceData.primaryPlan.provider}</h3>
                  <p className="text-gray-600">{insuranceData.primaryPlan.planName} • Primary Plan</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Plan Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="text-gray-900">{insuranceData.primaryPlan.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Number:</span>
                    <span className="text-gray-900">{insuranceData.primaryPlan.groupNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Type:</span>
                    <span className="text-gray-900">{insuranceData.primaryPlan.planType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective Date:</span>
                    <span className="text-gray-900">{new Date(insuranceData.primaryPlan.effectiveDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Premium:</span>
                    <span className="text-gray-900">${insuranceData.primaryPlan.premium.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cost Sharing */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Cost Sharing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductible:</span>
                    <span className="text-gray-900">${insuranceData.primaryPlan.deductible.individual}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Out-of-Pocket Max:</span>
                    <span className="text-gray-900">${insuranceData.primaryPlan.outOfPocketMax.individual}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Care:</span>
                    <span className="text-gray-900">${insuranceData.primaryPlan.copays.primaryCare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialist:</span>
                    <span className="text-gray-900">${insuranceData.primaryPlan.copays.specialist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Room:</span>
                    <span className="text-gray-900">${insuranceData.primaryPlan.copays.emergencyRoom}</span>
                  </div>
                </div>
              </div>

              {/* Coverage */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Coverage Areas</h4>
                <div className="space-y-2">
                  {Object.entries(insuranceData.primaryPlan.coverage).map(([key, covered]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      {covered ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Services</p>
                    <p className="font-medium text-gray-900">{insuranceData.primaryPlan.contacts.memberServices}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="font-medium text-blue-600">{insuranceData.primaryPlan.contacts.website}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{insuranceData.secondaryPlan.provider}</h3>
                  <p className="text-gray-600">{insuranceData.secondaryPlan.planName} • Dental Plan</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Plan Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span className="text-gray-900">{insuranceData.secondaryPlan.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Number:</span>
                    <span className="text-gray-900">{insuranceData.secondaryPlan.groupNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Premium:</span>
                    <span className="text-gray-900">${insuranceData.secondaryPlan.premium.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Dental Benefits</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(insuranceData.secondaryPlan.benefits).map(([key, benefit]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key}:</span>
                      <span className="text-gray-900">{(benefit as any).coverage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claims Tab */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search claims by provider, service, or claim ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={claimFilter}
                onChange={(e) => setClaimFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Claims</option>
                <option value="medical">Medical</option>
                <option value="dental">Dental</option>
                <option value="prescription">Prescription</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          </div>

          {/* Claims List */}
          <div className="space-y-4">
            {filteredClaims.map(claim => (
              <div key={claim.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{claim.id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {claim.type}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span>Service: {claim.service}</span>
                          <span>Provider: {claim.provider}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span>Service Date: {new Date(claim.serviceDate).toLocaleDateString()}</span>
                          <span>Processed: {new Date(claim.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{claim.explanation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Billed:</span>
                        <span className="font-medium">${claim.amount.billed.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Allowed:</span>
                        <span className="font-medium">${claim.amount.allowed.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Covered:</span>
                        <span className="font-medium text-green-600">${claim.amount.covered.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-600">Your Cost:</span>
                        <span className="font-bold text-red-600">${claim.amount.patientResponsibility.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredClaims.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          {/* Annual Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deductible Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Individual Deductible</span>
                    <span>${insuranceData.primaryPlan.deductible.met} / ${insuranceData.primaryPlan.deductible.individual}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ width: `${benefitsData.annual.deductibleProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{benefitsData.annual.deductibleProgress.toFixed(0)}% complete</p>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium">${insuranceData.primaryPlan.deductible.remaining}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Out-of-Pocket Maximum</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Individual Out-of-Pocket</span>
                    <span>${insuranceData.primaryPlan.outOfPocketMax.met} / ${insuranceData.primaryPlan.outOfPocketMax.individual}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${benefitsData.annual.outOfPocketProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{benefitsData.annual.outOfPocketProgress.toFixed(0)}% complete</p>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium">${insuranceData.primaryPlan.outOfPocketMax.remaining}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Utilization Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Healthcare Utilization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(benefitsData.utilization).map(([key, usage]) => (
                <div key={key} className="text-center">
                  <div className="p-4 bg-blue-50 rounded-lg mb-3">
                    <Stethoscope className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <h4 className="font-medium text-gray-900 capitalize mb-2">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">{(usage as any).used}</p>
                  <p className="text-sm text-gray-600">of {(usage as any).remaining}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefit Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Coverage Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Copayments</h4>
                <div className="space-y-2">
                  {Object.entries(insuranceData.primaryPlan.copays).map(([key, amount]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium">${amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Coinsurance</h4>
                <div className="space-y-2">
                  {Object.entries(insuranceData.primaryPlan.coinsurance).map(([key, percentage]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}