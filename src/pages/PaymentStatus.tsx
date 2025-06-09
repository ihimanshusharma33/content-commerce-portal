import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status');
  const orderId = searchParams.get('order_id');
  const paymentId = searchParams.get('payment_id') || searchParams.get('transaction_id');

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [navigate, user]);

  const renderContent = () => {
    if (status === 'success') {
      return {
        icon: (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ),
        title: 'Payment Successful!',
        message: 'Thank you for your purchase. Your course is now available in your dashboard.',
      };
    }

    if (status === 'failed') {
      return {
        icon: (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ),
        title: 'Payment Failed!',
        message: 'Unfortunately, your payment was not successful. Please try again or contact support.',
      };
    }

    if (status === 'pending') {
      return {
        icon: (
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ),
        title: 'Payment Pending...',
        message: 'Your payment is Pending.',
      };
    }

    return {
      icon: null,
      title: 'Unknown Status',
      message: 'Something went wrong. Please contact support.',
    };
  };

  const { icon, title, message } = renderContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="container max-w-lg px-4">
          <Card className="p-6">
            <div className="text-center mb-6">
              {icon}
              <h1 className="text-2xl font-bold mb-2">{title}</h1>
              <p className="text-gray-600">{message}</p>
              {status === 'success' && (
                <>
                  {orderId && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Order ID: <strong>{orderId}</strong>
                    </p>
                  )}
                  
                </>
              )}
              {paymentId && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Transaction ID: <strong>{paymentId}</strong>
                    </p>
                  )}

            </div>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/my-courses">Go to My Courses</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Back to Homepage</Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentStatus;
