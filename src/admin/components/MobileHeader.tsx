import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, X } from 'lucide-react';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  return (
    <div className="md:hidden bg-white w-full fixed top-0 left-0 z-30 border-b shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 mr-3"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <HomeIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;