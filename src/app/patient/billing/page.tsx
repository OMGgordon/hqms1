'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  CreditCard,
  Calendar,
  DollarSign,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt,
  FileText,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Wallet,
  Building,
  User,
  Mail,
  Phone
} from 'lucide-react';

// Mock billing data
const mockBillingData = {
  totalBalance: 2450.00,
  paidThisMonth: 1200.00,
  pendingPayments: 1250.00,
  insuranceClaimed: 3200.00,
  bills: [
    {
      id: 1,
      billNumber: 'INV-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 850.00,
      paidAmount: 850.00,
      status: 'paid',
      description: 'Cardiology Consultation & Tests',
      doctor: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      services: [
        { name: 'Consultation Fee', cost: 200.00 },
        { name: 'ECG Test', cost: 150.00 },
        { name: 'Blood Work', cost: 300.00 },
        { name: 'Chest X-Ray', cost: 200.00 }
      ],
      insurance: {
        covered: 680.00,
        patientPortion: 170.00,
        provider: 'HealthFirst Insurance'
      },
      paymentDate: '2024-01-20',
      paymentMethod: 'Credit Card ending in 4532'
    },
    {
      id: 2,
      billNumber: 'INV-2024-002',
      date: '2024-01-22',
      dueDate: '2024-02-22',
      amount: 450.00,
      paidAmount: 0,
      status: 'pending',
      description: 'Orthopedic Follow-up',
      doctor: 'Dr. Michael Chen',
      department: 'Orthopedics',
      services: [
        { name: 'Follow-up Consultation', cost: 150.00 },
        { name: 'Physical Therapy Session', cost: 200.00 },
        { name: 'X-Ray Follow-up', cost: 100.00 }
      ],
      insurance: {
        covered: 360.00,
        patientPortion: 90.00,
        provider: 'HealthFirst Insurance'
      }
    },
    {
      id: 3,
      billNumber: 'INV-2024-003',
      date: '2024-01-25',
      dueDate: '2024-02-25',
      amount: 1200.00,
      paidAmount: 350.00,
      status: 'partial',
      description: 'Dermatology Treatment & Procedures',
      doctor: 'Dr. James Wilson',
      department: 'Dermatology',
      services: [
        { name: 'Dermatology Consultation', cost: 250.00 },
        { name: 'Skin Biopsy', cost: 400.00 },
        { name: 'Laser Treatment', cost: 550.00 }
      ],
      insurance: {
        covered: 960.00,
        patientPortion: 240.00,
        provider: 'HealthFirst Insurance'
      },
      paymentDate: '2024-01-30',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 4,
      billNumber: 'INV-2023-045',
      date: '2023-12-10',
      dueDate: '2024-01-10',
      amount: 300.00,
      paidAmount: 0,
      status: 'overdue',
      description: 'General Medicine Consultation',
      doctor: 'Dr. Emily Davis',
      department: 'General Medicine',
      services: [
        { name: 'Consultation Fee', cost: 180.00 },
        { name: 'Prescription', cost: 120.00 }
      ],
      insurance: {
        covered: 240.00,
        patientPortion: 60.00,
        provider: 'HealthFirst Insurance'
      }
    }
  ],
  paymentMethods: [
    {
      id: 1,
      type: 'credit',
      cardNumber: '**** **** **** 4532',
      cardType: 'Visa',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'bank',
      accountNumber: '**** **** 7890',
      bankName: 'First National Bank',
      accountType: 'Checking',
      isDefault: false
    }
  ],
  insuranceInfo: {
    provider: 'HealthFirst Insurance',
    policyNumber: 'HF123456789',
    groupNumber: 'GRP001',
    copay: 25.00,
    deductible: 1500.00,
    deductibleMet: 800.00,
    outOfPocketMax: 5000.00,
    outOfPocketMet: 1200.00
  }
};

export default function Billing() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'partial': return TrendingUp;
      case 'overdue': return AlertCircle;
      default: return FileText;
    }
  };

  const filteredBills = mockBillingData.bills.filter(bill => {
    const matchesSearch = bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePayment = (billId: number) => {
    setSelectedBill(mockBillingData.bills.find(b => b.id === billId));
    setShowPaymentModal(true);
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-1">Manage your medical bills, payments, and insurance claims</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">${mockBillingData.totalBalance.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Wallet className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid This Month</p>
              <p className="text-2xl font-bold text-green-600">${mockBillingData.paidThisMonth.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">${mockBillingData.pendingPayments.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Insurance Claimed</p>
              <p className="text-2xl font-bold text-blue-600">${mockBillingData.insuranceClaimed.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bills List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bills by number, description, or doctor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partial">Partially Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Bills */}
          <div className="space-y-4">
            {filteredBills.map(bill => {
              const StatusIcon = getStatusIcon(bill.status);
              const balance = bill.amount - bill.paidAmount;
              
              return (
                <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Receipt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{bill.billNumber}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                            <StatusIcon className="h-3 w-3 inline mr-1" />
                            {bill.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">{bill.description}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Bill Date: {new Date(bill.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{bill.doctor} - {bill.department}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">${bill.amount.toFixed(2)}</p>
                      {bill.paidAmount > 0 && (
                        <p className="text-sm text-green-600">Paid: ${bill.paidAmount.toFixed(2)}</p>
                      )}
                      {balance > 0 && (
                        <p className="text-sm text-red-600">Balance: ${balance.toFixed(2)}</p>
                      )}
                    </div>
                  </div>

                  {/* Insurance Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Insurance Coverage</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-blue-600">Insurance Covered</p>
                        <p className="font-medium text-blue-800">${bill.insurance.covered.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Your Portion</p>
                        <p className="font-medium text-blue-800">${bill.insurance.patientPortion.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-blue-600">Provider</p>
                        <p className="font-medium text-blue-800">{bill.insurance.provider}</p>
                      </div>
                    </div>
                  </div>

                  {/* Services Breakdown */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                    <div className="space-y-2">
                      {bill.services.map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{service.name}</span>
                          <span className="font-medium text-gray-900">${service.cost.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button className="text-green-600 hover:text-green-700 flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                    {balance > 0 && (
                      <button
                        onClick={() => handlePayment(bill.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Pay Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Insurance Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium text-gray-900">{mockBillingData.insuranceInfo.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Policy Number</p>
                <p className="font-medium text-gray-900">{mockBillingData.insuranceInfo.policyNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Copay</p>
                  <p className="font-medium text-gray-900">${mockBillingData.insuranceInfo.copay.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deductible</p>
                  <p className="font-medium text-gray-900">${mockBillingData.insuranceInfo.deductible.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Deductible Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(mockBillingData.insuranceInfo.deductibleMet / mockBillingData.insuranceInfo.deductible) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${mockBillingData.insuranceInfo.deductibleMet.toFixed(2)} of ${mockBillingData.insuranceInfo.deductible.toFixed(2)} met
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button className="text-blue-600 hover:text-blue-700">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {mockBillingData.paymentMethods.map(method => (
                <div key={method.id} className={`p-3 border rounded-lg ${method.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {method.type === 'credit' ? method.cardType : method.bankName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {method.type === 'credit' ? method.cardNumber : method.accountNumber}
                      </p>
                    </div>
                    {method.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Download Statement</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Mail className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Email Support</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                <Phone className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-gray-900">Call Billing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Make Payment</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Bill Number</p>
                <p className="font-medium text-gray-900">{selectedBill.billNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Due</p>
                <p className="text-xl font-bold text-gray-900">
                  ${(selectedBill.amount - selectedBill.paidAmount).toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select payment method</option>
                  {mockBillingData.paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.type === 'credit' ? `${method.cardType} ${method.cardNumber}` : `${method.bankName} ${method.accountNumber}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={!selectedPaymentMethod}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}