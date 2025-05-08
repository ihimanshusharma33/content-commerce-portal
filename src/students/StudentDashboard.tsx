import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { isAuthenticated, getCurrentUser } from '@/lib/data';
import { User, CreditCard, Star, Settings } from 'lucide-react';

// Import our components
import PaymentHistory from './components/PaymentHistory';
import StudentReviews from './components/StudentReviews';
import StudentProfile from './components/StudentProfile';
import StudentSettings from './components/StudentSettings';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const user = getCurrentUser();
  
  // Get tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  // Set default tab value - use URL param if valid, otherwise default to 'profile'
  const defaultTab = ['profile', 'payment-history', 'my-reviews', 'settings']
    .includes(tabFromUrl || '') ? tabFromUrl : 'profile';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin', { state: { redirectTo: '/dashboard' } });
    }
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };
    
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate]);
  
  // Update URL when tab changes
  useEffect(() => {
    if (activeTab) {
      navigate(`/student-dashboard?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);
  
  // Mock payment history data
  const paymentHistory = [
    {
      id: 'pay_123456',
      courseTitle: 'Advanced React Development',
      date: new Date(2023, 10, 15),
      amount: 49.99,
      status: 'completed'
    },
    {
      id: 'pay_123457',
      courseTitle: 'Introduction to TypeScript',
      date: new Date(2023, 9, 3),
      amount: 29.99,
      status: 'completed'
    },
    {
      id: 'pay_123458',
      courseTitle: 'Full-Stack Development Bootcamp',
      date: new Date(2023, 8, 22),
      amount: 59.99,
      status: 'pending'
    }
  ];
  
  // Mock reviews data
  const myReviews = [
    {
      id: 'rev_123456',
      courseTitle: 'Advanced React Development',
      rating: 5,
      comment: 'This course was incredibly helpful and well-structured. The instructor was clear and the projects were challenging but rewarding.',
      date: new Date(2023, 10, 20)
    },
    {
      id: 'rev_123457',
      courseTitle: 'Introduction to TypeScript',
      rating: 4,
      comment: 'Great introduction to TypeScript. Would have liked more advanced examples, but overall very good content.',
      date: new Date(2023, 9, 10)
    }
  ];
  
  if (!isLoggedIn || !user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-4 sm:py-6">
        <div className="container-custom">
          <div className="w-full">
            {/* Tab Navigation - Enhanced Version */}
            <div className="mb-6 sm:mb-8">
              {/* Tab Selection for Medium+ Screens */}
              <div className="hidden sm:flex rounded-xl bg-gray-50 p-1 shadow-inner">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`relative flex items-center gap-2 px-6 py-3 flex-1 justify-center text-sm font-medium rounded-lg transition-all duration-200 
                    ${activeTab === 'profile' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-gray-600 hover:text-primary hover:bg-white/50'}`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                  {activeTab === 'profile' && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('payment-history')}
                  className={`relative flex items-center gap-2 px-6 py-3 flex-1 justify-center text-sm font-medium rounded-lg transition-all duration-200
                    ${activeTab === 'payment-history' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-gray-600 hover:text-primary hover:bg-white/50'}`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Payments</span>
                  {activeTab === 'payment-history' && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('my-reviews')}
                  className={`relative flex items-center gap-2 px-6 py-3 flex-1 justify-center text-sm font-medium rounded-lg transition-all duration-200
                    ${activeTab === 'my-reviews' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-gray-600 hover:text-primary hover:bg-white/50'}`}
                >
                  <Star className="h-4 w-4" />
                  <span>Reviews</span>
                  {activeTab === 'my-reviews' && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`relative flex items-center gap-2 px-6 py-3 flex-1 justify-center text-sm font-medium rounded-lg transition-all duration-200
                    ${activeTab === 'settings' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-gray-600 hover:text-primary hover:bg-white/50'}`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                  {activeTab === 'settings' && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </div>
              
              {/* Mobile Tab Navigation - Card Style with Focus on Icons */}
              <div className="sm:hidden">
                <div className="grid grid-cols-4 gap-1 bg-gray-50 rounded-xl p-1.5">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center py-3 px-1 rounded-lg transition-all duration-200
                      ${activeTab === 'profile'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-600'}`}
                  >
                    <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'profile' ? 'bg-primary/10' : ''}`}>
                      <User className={`h-5 w-5 ${activeTab === 'profile' ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-xs font-medium">Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('payment-history')}
                    className={`flex flex-col items-center py-3 px-1 rounded-lg transition-all duration-200
                      ${activeTab === 'payment-history'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-600'}`}
                  >
                    <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'payment-history' ? 'bg-primary/10' : ''}`}>
                      <CreditCard className={`h-5 w-5 ${activeTab === 'payment-history' ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-xs font-medium">Payments</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('my-reviews')}
                    className={`flex flex-col items-center py-3 px-1 rounded-lg transition-all duration-200
                      ${activeTab === 'my-reviews'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-600'}`}
                  >
                    <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'my-reviews' ? 'bg-primary/10' : ''}`}>
                      <Star className={`h-5 w-5 ${activeTab === 'my-reviews' ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-xs font-medium">Reviews</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex flex-col items-center py-3 px-1 rounded-lg transition-all duration-200
                      ${activeTab === 'settings'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-600'}`}
                  >
                    <div className={`p-1.5 rounded-full mb-1 ${activeTab === 'settings' ? 'bg-primary/10' : ''}`}>
                      <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-primary' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-xs font-medium">Settings</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300 ease-in-out">
              {activeTab === 'profile' && (
                <div className="animate-fadeIn">
                  <StudentProfile user={user} />
                </div>
              )}
              
              {activeTab === 'payment-history' && (
                <div className="animate-fadeIn">
                  <PaymentHistory payments={paymentHistory} />
                </div>
              )}
              
              {activeTab === 'my-reviews' && (
                <div className="animate-fadeIn">
                  <StudentReviews reviews={myReviews} />
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="animate-fadeIn">
                  <StudentSettings />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudentDashboard;
