import React, { useState } from 'react';
import {
  User, Mail, GraduationCap, Calendar, MapPin, Phone, Edit, ShieldCheck, LockKeyhole, Info
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  purchasedCourses: string[];
  joinDate?: Date;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  id: number;
}

interface StudentProfileProps {
  user: User;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "+91 1234567890",
    location: user.location || "India",
    bio: user.bio || "Passionate learner focused on web development and UI design. Currently expanding my skills in React and TypeScript."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving updated user info:", formData);
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Account Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2 text-primary" />
          Account Summary
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Enrolled Courses</span>
            <span className="font-medium">{user.purchasedCourses.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Member Since</span>
            <span className="font-medium">
              {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '27th May 2025'}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-primary" />
          Personal Information
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-800">{formData.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-800">{formData.email}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md text-gray-800">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  {formData.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md text-gray-800">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  {formData.location}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            ) : (
              <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-800">{formData.bio}</div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Update Information
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
