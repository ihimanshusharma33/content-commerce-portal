import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, User, Settings, Star, CreditCard, LogOut, BookOpenCheck } from "lucide-react";
import { isAuthenticated, logoutUser, getCurrentUser } from '@/lib/data';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    setIsLoggedIn(isAuthenticated());

    // Add event listener for auth changes
    const checkLoginStatus = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener('storage', checkLoginStatus);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
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
          {isLoggedIn && (
            <Link
              to="/my-courses"
              className="text-gray-600 hover:text-primary font-medium"
            >
              My Courses
            </Link>
          )}

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="relative flex flex-start" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                  onClick={() => navigate('/student-dashboard')}
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>{getCurrentUser()?.name || 'Account'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="mr-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
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
            {isLoggedIn && (
              <Link
                to="/my-courses"
                className="text-gray-600 hover:text-primary py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Courses
              </Link>
            )}
            {isLoggedIn && (
              <>
                <Link
                  to="/student-dashboard?tab=profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-primary  py-2 flex items-center"
                >
                  Dashboard
                </Link>

              </>
            )}
            <div className="pt-2 border-t border-gray-100">
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    handleLogout();
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
