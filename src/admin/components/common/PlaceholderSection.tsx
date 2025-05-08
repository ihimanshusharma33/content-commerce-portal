import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PlaceholderSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ 
  icon: Icon, 
  title, 
  description 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center py-12">
      <Icon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
};

export default PlaceholderSection;