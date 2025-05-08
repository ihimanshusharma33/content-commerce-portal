import React from 'react';
import { Users, Settings } from 'lucide-react';
import PlaceholderSection from '../common/PlaceholderSection';

const StudentsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Management</h1>
      <PlaceholderSection 
        icon={Users}
        title="Student Management Coming Soon"
        description="This section is under development. Soon you'll be able to manage all students, view their enrollments, and communicate directly from this dashboard."
      />
    </div>
  );
};

export const SettingsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Platform Settings</h1>
      <PlaceholderSection 
        icon={Settings}
        title="Settings Coming Soon"
        description="Platform settings will be available here soon. You'll be able to configure notification preferences, payment gateways, and platform appearance."
      />
    </div>
  );
};
export default StudentsSection;