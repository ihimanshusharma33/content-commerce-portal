import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { clearAuth } from '../services/authService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirectTo from location state or default to '/student-dashboard'
  const redirectTo = (location.state as any)?.redirectTo || '/student-dashboard';
  
  // Get login, loading, and error state from our auth context
  const { login, loading: isLoading, error, user, logout } = useAuth();

  
  useEffect(() => {
    const clearAuthState = async () => {
      clearAuth();
      if (user) {
        try {
          await logout();
        } catch (error) {
          console.error("Logout error:", error);
          // Even if logout API fails, we've already cleared local state
        }
      }
    };
    
    clearAuthState();
    // Only run this once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Redirect if user becomes authenticated during the session
  useEffect(() => {
    // Only redirect if we have a user AND we're not in the process of clearing auth
    if (user && !isLoading) {
      // Check role to determine where to redirect
      if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, navigate, redirectTo, isLoading]);
  
  // Display error message if login fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Login failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call the login function from our auth context
      await login(email, password);
      
      // The redirection will be handled by the useEffect above
      // This prevents double redirects and multiple state updates
    } catch (error: any) {
      // Error is handled by the useEffect above
      console.error('Login error:', error);
    }
  };

  const fillSampleCredentials = () => {
    setEmail('tanyamishra1909@gmail.com');
    setPassword('tanya2005');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@lms.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm space-y-2">
                <button
                  type="button"
                  onClick={fillSampleCredentials}
                  className="text-primary hover:underline"
                >
                  Use demo credentials
                </button>
                <br />
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className='text-red-600 hover:underline'
                >
                  Use Admin credentials
                </button>
              </div>
            </CardContent>

            <CardFooter>
              <p className="text-center w-full text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;
