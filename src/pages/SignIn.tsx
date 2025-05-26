import { useState } from 'react';
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
import { loginUser } from '@/services/apiService';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as { redirectTo?: string })?.redirectTo || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Admin login local check
      if (email === 'admin@lms.com' && password === 'admin123') {
        toast({
          title: "Admin login successful",
          description: "Welcome back, Admin!",
        });
        window.dispatchEvent(new Event('storage'));
        navigate('/admin-dashboard');
        return;
      }

      const data = await loginUser({ email, password });

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.name || 'User'}!`,
      });

      if ('token' in data && typeof data.token === 'string') {
        localStorage.setItem('authToken', data.token);
      }

      window.dispatchEvent(new Event('storage'));
      navigate(redirectTo);
    } catch (error: unknown) {
      let message = "Please check your credentials and try again.";
      if (error instanceof Error) message = error.message;

      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillSampleCredentials = () => {
    setEmail('user@example.com');
    setPassword('password');
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
