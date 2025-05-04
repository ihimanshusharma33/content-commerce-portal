
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/data';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/signin');
    }
    
    // In a real app, this would verify the payment with the backend
  }, [navigate, user]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="container max-w-lg px-4">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your course is now available in your dashboard.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Go to My Courses
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to="/">
                  Back to Homepage
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
