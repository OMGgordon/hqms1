'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  Heart,
  UserPlus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Shield,
  Home,
  Building,
  Car,
  Briefcase,
  X,
  Save,
  UserCheck,
  UserX,
  Globe,
  Calendar
} from 'lucide-react';

// Mock emergency contacts data
const mockEmergencyContacts = [
  {
    id: 1,
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    isPrimary: true,
    phoneNumbers: [
      { type: 'Mobile', number: '(555) 123-4567', isPrimary: true },
      { type: 'Work', number: '(555) 987-6543', isPrimary: false }
    ],
    email: 'sarah.johnson@email.com',
    address: {
      street: '123 Main Street',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    notes: 'Primary emergency contact. Available 24/7.',
    medicalAuthority: true,
    canPickUpPrescriptions: true,
    languagesSpoken: ['English', 'Spanish'],
    dateAdded: '2023-01-15',
    lastUpdated: '2024-01-10'
  },
  {
    id: 2,
    name: 'Michael Johnson',
    relationship: 'Father',
    isPrimary: false,
    phoneNumbers: [
      { type: 'Mobile', number: '(555) 234-5678', isPrimary: true },
      { type: 'Home', number: '(555) 345-6789', isPrimary: false }
    ],
    email: 'michael.johnson@email.com',
    address: {
      street: '456 Oak Avenue',
      city: 'Hometown',
      state: 'CA',
      zipCode: '54321',
      country: 'USA'
    },
    notes: 'Retired. Usually available during business hours.',
    medicalAuthority: true,
    canPickUpPrescriptions: false,
    languagesSpoken: ['English'],
    dateAdded: '2023-01-15',
    lastUpdated: '2023-12-05'
  },
  {
    id: 3,
    name: 'Jennifer Smith',
    relationship: 'Sister',
    isPrimary: false,
    phoneNumbers: [
      { type: 'Mobile', number: '(555) 345-6789', isPrimary: true }
    ],
    email: 'jennifer.smith@email.com',
    address: {
      street: '789 Pine Street',
      city: 'Nearby City',
      state: 'CA',
      zipCode: '67890',
      country: 'USA'
    },
    notes: 'Nurse at City Hospital. Has medical background.',
    medicalAuthority: false,
    canPickUpPrescriptions: true,
    languagesSpoken: ['English', 'French'],
    dateAdded: '2023-02-20',
    lastUpdated: '2023-11-15'
  },
  {
    id: 4,
    name: 'Dr. Robert Davis',
    relationship: 'Family Friend',
    isPrimary: false,
    phoneNumbers: [
      { type: 'Mobile', number: '(555) 456-7890', isPrimary: true },
      { type: 'Office', number: '(555) 567-8901', isPrimary: false }
    ],
    email: 'robert.davis@medical.com',
    address: {
      street: '321 Medical Plaza',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    notes: 'Family physician and close friend. Medical professional.',
    medicalAuthority: true,
    canPickUpPrescriptions: true,
    languagesSpoken: ['English'],
    dateAdded: '2023-03-10',
    lastUpdated: '2024-01-05'
  }
];

// Available relationship types
const relationshipTypes = [
  'Spouse',
  'Partner',
  'Parent',
  'Father',
  'Mother',
  'Child',
  'Son',
  'Daughter',
  'Sibling',
  'Brother',
  'Sister',
  'Grandparent',
  'Grandchild',
  'Uncle',
  'Aunt',
  'Cousin',
  'Friend',
  'Family Friend',
  'Neighbor',
  'Caregiver',
  'Legal Guardian',
  'Other'
];

// Phone number types
const phoneTypes = [
  'Mobile',
  'Home',
  'Work',
  'Office',
  'Emergency',
  'Other'
];

export default function EmergencyContacts() {
  const { user } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState(mockEmergencyContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    isPrimary: false,
    phoneNumbers: [{ type: 'Mobile', number: '', isPrimary: true }],
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    notes: '',
    medicalAuthority: false,
    canPickUpPrescriptions: false,
    languagesSpoken: ['English']
  });

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddContact = () => {
    const newContact = {
      ...formData,
      id: Math.max(...contacts.map(c => c.id)) + 1,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setContacts([...contacts, newContact]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditContact = () => {
    const updatedContacts = contacts.map(contact =>
      contact.id === editingContact.id
        ? { ...formData, id: editingContact.id, dateAdded: editingContact.dateAdded, lastUpdated: new Date().toISOString().split('T')[0] }
        : contact
    );
    setContacts(updatedContacts);
    setShowEditModal(false);
    setEditingContact(null);
    resetForm();
  };

  const handleDeleteContact = () => {
    setContacts(contacts.filter(contact => contact.id !== editingContact.id));
    setShowDeleteModal(false);
    setEditingContact(null);
  };

  const openEditModal = (contact: any) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setShowEditModal(true);
  };

  const openDeleteModal = (contact: any) => {
    setEditingContact(contact);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      isPrimary: false,
      phoneNumbers: [{ type: 'Mobile', number: '', isPrimary: true }],
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      notes: '',
      medicalAuthority: false,
      canPickUpPrescriptions: false,
      languagesSpoken: ['English']
    });
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, { type: 'Mobile', number: '', isPrimary: false }]
    });
  };

  const removePhoneNumber = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData({
        ...formData,
        phoneNumbers: formData.phoneNumbers.filter((_, i) => i !== index)
      });
    }
  };

  const updatePhoneNumber = (index: number, field: string, value: string | boolean) => {
    const updated = formData.phoneNumbers.map((phone, i) => 
      i === index ? { ...phone, [field]: value } : phone
    );
    setFormData({ ...formData, phoneNumbers: updated });
  };

  const getRelationshipIcon = (relationship: string) => {
    const rel = relationship.toLowerCase();
    if (rel.includes('spouse') || rel.includes('partner')) return <Heart className="h-4 w-4" />;
    if (rel.includes('parent') || rel.includes('father') || rel.includes('mother')) return <User className="h-4 w-4" />;
    if (rel.includes('child') || rel.includes('son') || rel.includes('daughter')) return <UserPlus className="h-4 w-4" />;
    if (rel.includes('friend')) return <Users className="h-4 w-4" />;
    if (rel.includes('doctor') || rel.includes('dr.')) return <Shield className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900">Emergency Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your emergency contacts and medical authorization</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-blue-600">{contacts.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Primary Contact</p>
              <p className="text-lg font-bold text-green-600">
                {contacts.find(c => c.isPrimary)?.name || 'None'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medical Authority</p>
              <p className="text-2xl font-bold text-purple-600">
                {contacts.filter(c => c.medicalAuthority).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Can Pick Up Rx</p>
              <p className="text-2xl font-bold text-orange-600">
                {contacts.filter(c => c.canPickUpPrescriptions).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts by name, relationship, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map(contact => (
          <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {getRelationshipIcon(contact.relationship)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    {contact.isPrimary && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Primary
                      </span>
                    )}
                    {contact.medicalAuthority && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        Medical Authority
                      </span>
                    )}
                    {contact.canPickUpPrescriptions && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                        Prescription Pickup
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4" />
                        <span>Relationship: {contact.relationship}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phoneNumbers.find(p => p.isPrimary)?.number}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="h-4 w-4" />
                        <span>{contact.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="h-4 w-4" />
                        <span>{contact.address.city}, {contact.address.state}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Globe className="h-4 w-4" />
                        <span>Languages: {contact.languagesSpoken.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Updated: {new Date(contact.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {contact.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{contact.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <User className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditModal(contact)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openDeleteModal(contact)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new contact</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add First Contact
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {showAddModal ? 'Add Emergency Contact' : 'Edit Emergency Contact'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Relationship</option>
                      {relationshipTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone Numbers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Phone Numbers</h4>
                  <button
                    type="button"
                    onClick={addPhoneNumber}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Phone</span>
                  </button>
                </div>
                {formData.phoneNumbers.map((phone, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <select
                      value={phone.type}
                      onChange={(e) => updatePhoneNumber(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {phoneTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone.number}
                      onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                      placeholder="Phone number"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={phone.isPrimary}
                          onChange={(e) => updatePhoneNumber(index, 'isPrimary', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Primary</span>
                      </label>
                      {formData.phoneNumbers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneNumber(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Address */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Address</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, city: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, state: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, zipCode: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Permissions & Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Set as primary emergency contact</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.medicalAuthority}
                      onChange={(e) => setFormData({ ...formData, medicalAuthority: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Can make medical decisions on my behalf</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.canPickUpPrescriptions}
                      onChange={(e) => setFormData({ ...formData, canPickUpPrescriptions: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Can pick up prescriptions for me</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this contact..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={showAddModal ? handleAddContact : handleEditContact}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{showAddModal ? 'Add Contact' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Contact</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{editingContact?.name}</strong> from your emergency contacts?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteContact}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-4 bg-blue-100 rounded-lg">
                  {getRelationshipIcon(selectedContact.relationship)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h4>
                  <p className="text-gray-600">{selectedContact.relationship}</p>
                  <div className="flex space-x-2 mt-2">
                    {selectedContact.isPrimary && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Primary</span>
                    )}
                    {selectedContact.medicalAuthority && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Medical Authority</span>
                    )}
                    {selectedContact.canPickUpPrescriptions && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Prescription Pickup</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Contact Information</h5>
                  <div className="space-y-3">
                    {selectedContact.phoneNumbers.map((phone: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{phone.number}</span>
                        <span className="text-xs text-gray-500">({phone.type})</span>
                        {phone.isPrimary && <span className="text-xs text-blue-600">Primary</span>}
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{selectedContact.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Address</h5>
                  <div className="space-y-1 text-gray-700">
                    <p>{selectedContact.address.street}</p>
                    <p>{selectedContact.address.city}, {selectedContact.address.state} {selectedContact.address.zipCode}</p>
                    <p>{selectedContact.address.country}</p>
                  </div>
                </div>
              </div>

              {selectedContact.notes && (
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-3">Notes</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedContact.notes}</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Added: {new Date(selectedContact.dateAdded).toLocaleDateString()}</span>
                  <span>Last Updated: {new Date(selectedContact.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}