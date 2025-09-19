import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          HQMS
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Hospital Queue Management System
        </p>
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Streamline your hospital experience with our modern queue management system. 
          Patients can join queues, doctors can manage appointments, and administrators can oversee operations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Login
          </Link>
          <Link 
            href="/signup"
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Patients</h3>
            <p className="text-gray-600">Join queues, track wait times, and manage your appointments online.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Doctors</h3>
            <p className="text-gray-600">Manage patient queues, view schedules, and streamline consultations.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Administrators</h3>
            <p className="text-gray-600">Oversee operations, manage users, and optimize hospital workflows.</p>
          </div>
        </div>
      </div>
    </div>
  );
}