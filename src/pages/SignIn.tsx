import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { clearAuth, setToken, setupAuthHeader } from '../services/authService';
import apiClient from '../utils/apiClient';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear auth data when the sign-in page is loaded
  useEffect(() => {
    clearAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the actual API endpoint
      const response = await apiClient.post('/login', {
        email,
        password
      });

      // Check if the login was successful
      if (response.data.status && response.data.data.token) {
        // Store the token
        const token = response.data.data.token;
        setToken(token);
        setupAuthHeader(token);

        // Show success message
        toast({
          title: "Login successful",
          description: response.data.message || "Welcome back!",
        });

        // Determine where to navigate based on user role (which might be extracted from the token)
        // For now, assume we redirect to a default dashboard
        if (email === 'admin@lms.com') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        // Handle unsuccessful login but with a 200 response
        toast({
          title: "Login failed",
          description: response.data.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract and display the error message from the API response
      const errorMessage = error.response?.data?.message || 
                          "Unable to sign in. Please check your credentials and try again.";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
