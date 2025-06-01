import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50 border-b">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">LearnHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/courses" className="text-gray-600 hover:text-primary font-medium">
            Browse Courses
          </Link>
          {user && (
            <Link
              to="/my-courses"
              className="text-gray-600 hover:text-primary font-medium"
            >
              My Courses
            </Link>
          )}

          <div className="flex items-center space-x-2">
            {user ? (
              <div className="relative flex flex-start" ref={dropdownRef}>
                <Link to='/student-dashboard'
                  className="flex text-gray-600 font-medium hover:text-primary items-center"
                >
                  Account
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-8 flex justify-center font-medium text-red-600 bg-white"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-red-600">&nbsp;Sign Out</span>
                </button>
              </div>
            ) : (
              <Button onClick={() => navigate('/signin')} className="bg-primary">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 border-b border-gray-200 animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Link
              to="/courses"
              className="text-gray-600 hover:text-primary py-2 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Courses
            </Link>
            {user && (
              <Link
                to="/my-courses"
                className="text-gray-600 hover:text-primary py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Courses
              </Link>
            )}
            {user && (
              <>
                <Link
                  to="/student-dashboard?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-primary py-2 flex items-center"
                >
                  Dashboard
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <Button
                  onClick={async () => {
                    await handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="destructive"
                  size="sm"
                  className="w-full justify-center flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/signin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-primary"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
