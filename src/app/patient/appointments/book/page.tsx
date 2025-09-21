'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockDepartments, mockDoctors } from '@/lib/mockData';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Phone,
  Mail
} from 'lucide-react';

export default function BookAppointment() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Department/Doctor, 2: Date/Time, 3: Details, 4: Confirmation
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [priority, setPriority] = useState('normal');
  const [contactPreference, setContactPreference] = useState('sms');
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  const availableDoctors = selectedDepartment
    ? mockDoctors.filter(doctor => doctor.department === selectedDepartment)
    : [];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isAvailable = Math.random() > 0.3; // 70% availability
        slots.push({ time, available: isAvailable });
      }
    }
    
    return slots;
  };

  const calendarDays = generateCalendarDays();
  const timeSlots = generateTimeSlots();

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0; // Disable past dates and Sundays
  };

  const handleBookAppointment = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2000);
  };

  const getSelectedDoctorInfo = () => {
    return mockDoctors.find(doctor => doctor.id === selectedDoctor);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Confirmation Step
  if (step === 4) {
    const doctorInfo = getSelectedDoctorInfo();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
            <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Appointment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-700">Appointment ID:</span>
                <span className="font-semibold text-green-800">#APT-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Department:</span>
                <span className="font-semibold text-green-800">{selectedDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Doctor:</span>
                <span className="font-semibold text-green-800">{doctorInfo?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Date:</span>
                <span className="font-semibold text-green-800">
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Time:</span>
                <span className="font-semibold text-green-800">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Type:</span>
                <span className="font-semibold text-green-800 capitalize">{appointmentType}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Important Instructions</h4>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Please arrive 15 minutes before your appointment time</li>
                  <li>• Bring a valid ID and insurance card</li>
                  <li>• You will receive SMS/email reminders before your appointment</li>
                  <li>• To reschedule or cancel, contact us at least 24 hours in advance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/patient/appointments')}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View All Appointments
            </button>
            <button
              onClick={() => router.push('/patient/dashboard')}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-1">Schedule your appointment with our medical professionals.</p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Select Doctor', icon: Stethoscope },
            { step: 2, title: 'Choose Date & Time', icon: Calendar },
            { step: 3, title: 'Appointment Details', icon: User }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  step >= item.step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  <div className={`p-2 rounded-full ${
                    step >= item.step ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            
            {/* Step 1: Select Doctor */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Select Department & Doctor</h2>
                
                {/* Department Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedDoctor('');
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a department</option>
                    {mockDepartments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Selection */}
                {selectedDepartment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Doctor *
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      {availableDoctors.map(doctor => (
                        <div
                          key={doctor.id}
                          onClick={() => setSelectedDoctor(doctor.id)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedDoctor === doctor.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Stethoscope className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>License: {doctor.licenseNumber}</span>
                                <span>Available: Mon-Sat</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-green-600">Available</div>
                              <div className="text-xs text-gray-500">Next: Today 2:30 PM</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedDoctor}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Next: Choose Date & Time</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">Choose Date & Time</h2>
                </div>

                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                      const isDisabled = isDateDisabled(day);
                      const isSelected = selectedDate === day.toISOString().split('T')[0];
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (!isDisabled && isCurrentMonth) {
                              setSelectedDate(day.toISOString().split('T')[0]);
                            }
                          }}
                          disabled={isDisabled || !isCurrentMonth}
                          className={`p-2 text-sm rounded-lg ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : isDisabled || !isCurrentMonth
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 text-sm rounded-lg border ${
                            selectedTime === slot.time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : slot.available
                              ? 'border-gray-200 hover:border-gray-300 text-gray-900'
                              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                          {!slot.available && <div className="text-xs">Booked</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Next: Appointment Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Appointment Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type *
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'consultation', label: 'Consultation', desc: 'General consultation' },
                      { value: 'followup', label: 'Follow-up', desc: 'Follow-up visit' },
                      { value: 'checkup', label: 'Check-up', desc: 'Routine check-up' }
                    ].map(type => (
                      <button
                        key={type.value}
                        onClick={() => setAppointmentType(type.value)}
                        className={`p-4 text-left border rounded-lg ${
                          appointmentType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit *
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief description of your concern..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Symptoms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Symptoms
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Please describe your symptoms in detail..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'normal', label: 'Normal', desc: 'Regular appointment' },
                      { value: 'urgent', label: 'Urgent', desc: 'Need appointment soon' },
                      { value: 'emergency', label: 'Emergency', desc: 'Immediate attention needed' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="priority"
                          value={option.value}
                          checked={priority === option.value}
                          onChange={(e) => setPriority(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contact"
                        value="sms"
                        checked={contactPreference === 'sms'}
                        onChange={(e) => setContactPreference(e.target.value)}
                        className="mr-2"
                      />
                      <Phone className="h-4 w-4 mr-1" />
                      <span>SMS</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="contact"
                        value="email"
                        checked={contactPreference === 'email'}
                        onChange={(e) => setContactPreference(e.target.value)}
                        className="mr-2"
                      />
                      <Mail className="h-4 w-4 mr-1" />
                      <span>Email</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleBookAppointment}
                    disabled={loading || !reason}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Book Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Details Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
            
            <div className="space-y-3">
              {selectedDepartment && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedDepartment}</span>
                </div>
              )}
              
              {selectedDoctor && (
                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{getSelectedDoctorInfo()?.name}</span>
                </div>
              )}
              
              {selectedDate && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )}
              
              {selectedTime && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Booking Information</h4>
                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                  <li>• Appointments can be cancelled up to 24 hours in advance</li>
                  <li>• Please arrive 15 minutes early</li>
                  <li>• Bring valid ID and insurance card</li>
                  <li>• Consultation fee: ₹500</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>appointments@hospital.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}