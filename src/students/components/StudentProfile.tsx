import React from 'react';
import { User, Mail, GraduationCap, Calendar, MapPin, Phone, Edit, Camera } from 'lucide-react';

interface User {
  name: string;
  email: string;
  purchasedCourses: string[];
  joinDate?: Date;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

interface StudentProfileProps {
  user: User;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  // Add some mock data to enrich the profile
  const enhancedUser = {
    ...user,
    joinDate: user.joinDate || new Date(2022, 5, 15),
    phone: user.phone || "+1 (555) 123-4567",
    location: user.location || "San Francisco, CA",
    bio: user.bio || "Passionate learner focused on web development and UI design. Currently expanding my skills in React and TypeScript."
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 h-32 sm:h-40 relative">
          <button className="absolute right-4 bottom-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm transition-colors">
            <Camera className="h-4 w-4 text-gray-700" />
          </button>
        </div>
        
        <div className="px-4 sm:px-6 pb-6 -mt-16 relative">
          <div className="relative inline-block">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              {enhancedUser.avatar ? (
                <img 
                  src={enhancedUser.avatar} 
                  alt={enhancedUser.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <User className="h-12 w-12 sm:h-16 sm:w-16 text-primary/70" />
                </div>
              )}
            </div>
            <button className="absolute bottom-1 right-1 bg-primary hover:bg-primary/90 p-1.5 rounded-full shadow-sm transition-colors">
              <Camera className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{enhancedUser.name}</h1>
              <p className="text-gray-600 text-sm sm:text-base flex items-center mt-1">
                <Mail className="h-3.5 w-3.5 mr-2" />
                {enhancedUser.email}
              </p>
            </div>
            
            <button className="mt-4 sm:mt-0 flex items-center gap-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition-colors">
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-800">{enhancedUser.name}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-800">{enhancedUser.email}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md text-gray-800">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  {enhancedUser.phone}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md text-gray-800">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  {enhancedUser.location}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
              <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-800">{enhancedUser.bio}</div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Update Information
            </button>
          </div>
        </div>
        
        {/* Account Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Account Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Enrolled Courses</span>
              </div>
              <span className="text-lg font-semibold">{enhancedUser.purchasedCourses.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">Member Since</span>
              </div>
              <span className="font-medium">{enhancedUser.joinDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric'
              })}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full py-2 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Go to My Courses
            </button>
          </div>
        </div>
      </div>
      
      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security
          </h2>
          <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Change Password
          </button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-1.5 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Enhance Your Account Security</h3>
              <p className="text-sm text-yellow-700">
                We recommend enabling two-factor authentication for added security. This will help protect your account from unauthorized access.
              </p>
              <button className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;