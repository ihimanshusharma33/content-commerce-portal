import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');

    if (status === 'success') {
      toast({
        title: 'Email verified successfully',
        description: 'You can now log in.',
      });
    } else if (status === 'already_verified') {
      toast({
        title: 'Email already verified',
        description: 'Please log in.',
      });
    } else {
      toast({
        title: 'Verification failed',
        description: 'Please try verifying your email again.',
        variant: 'destructive',
      });
    }

    const timer = setTimeout(() => {
      navigate('/signin'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.search, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Verifying your email...</p>
    </div>
  );
};

export default EmailVerified;
