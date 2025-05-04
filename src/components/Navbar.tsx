
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { isAuthenticated, logoutUser, getCurrentUser } from '@/lib/data';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    setIsLoggedIn(isAuthenticated());

    // Add event listener for auth changes
    const checkLoginStatus = () => {
      setIsLoggedIn(isAuthenticated());
    };
    
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
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
            <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">
              My Courses
            </Link>
          )}
          
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" className="flex items-center" onClick={() => navigate('/dashboard')}>
                  <User className="h-5 w-5 mr-2" />
                  <span>{getCurrentUser()?.name || 'Account'}</span>
                </Button>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/signin')} variant="outline" size="sm">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/signup')} className="bg-primary" size="sm">
                  Sign Up
                </Button>
              </>
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
                to="/dashboard" 
                className="text-gray-600 hover:text-primary py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Courses
              </Link>
            )}
            <div className="pt-2 border-t border-gray-100">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>{getCurrentUser()?.name || 'Account'}</span>
                  </Button>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    variant="secondary" 
                    size="sm"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      navigate('/signin');
                      setMobileMenuOpen(false);
                    }}
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="bg-primary w-full" 
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
