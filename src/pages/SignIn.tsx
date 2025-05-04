
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a redirect path in the location state
  const redirectTo = location.state?.redirectTo || '/';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo, use email: user@example.com, password: password
    const user = loginUser(email, password);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (user) {
        toast({
          title: "Sign in successful",
          description: "Welcome back!",
        });
        // Trigger re-render of components listening to auth state
        window.dispatchEvent(new Event('storage'));
        navigate(redirectTo);
      } else {
        toast({
          title: "Sign in failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }, 1000); // Simulate API request
  };
  
  // For demo purposes, provide sample credentials
  const fillSampleCredentials = () => {
    setEmail('user@example.com');
    setPassword('password');
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
              
              <div className="mt-4 text-center text-sm">
                <button 
                  type="button" 
                  onClick={fillSampleCredentials} 
                  className="text-primary hover:underline"
                >
                  Use demo credentials
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
