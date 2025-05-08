import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { courses, purchaseCourse } from '@/lib/data';
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, AlertTriangle, Check, CreditCard, Wallet } from "lucide-react";

const PaymentPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === courseId);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [formData, setFormData] = useState({
    agreeTerms: false,
  });
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container-custom py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="mb-6 text-base">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="text-primary hover:underline text-base">
            Browse Available Courses
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as 'card' | 'paypal');
  };
  
  const handleTermsAgreement = () => {
    setHasAgreed(true);
    setFormData({...formData, agreeTerms: true});
    setIsTermsModalOpen(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms || !hasAgreed) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      purchaseCourse(course.id);
      
      toast.success("Payment successful!", {
        description: `You now have access to ${course.title}`
      });
      
      navigate(`/course/${course.id}/content`);
      
    } catch (error) {
      toast.error("Payment failed", {
        description: "There was an issue processing your payment. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add a function to directly open the terms modal
  const openTermsModal = () => {
    setIsTermsModalOpen(true);
  };
  
  const price = course.discountPrice || course.price;
  const showDiscount = course.discountPrice && course.discountPrice < course.price;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 sm:py-12">
        <div className="container-custom">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Complete Your Purchase</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-16 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{course.title}</h3>
                      <p className="text-base text-muted-foreground mb-1">by {course.instructor}</p>
                      <div className="flex items-center">
                        <span className="text-amber-500 mr-1 text-base">{course.rating.toFixed(1)}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(course.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-base ml-1 text-muted-foreground">
                          ({course.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2 text-base">
                      <span>Course Price</span>
                      <span>${course.price.toFixed(2)}</span>
                    </div>
                    
                    {showDiscount && (
                      <div className="flex justify-between mb-2 text-green-600 text-base">
                        <span>Discount</span>
                        <span>-${(course.price - course.discountPrice!).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-semibold text-xl mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>${price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-base">
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Full lifetime access to course</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>30-day money-back guarantee</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right Column - Payment Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                
                <form onSubmit={handleSubmit}>
                  <RadioGroup 
                    value={paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center text-base">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Credit / Debit Card
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex items-center text-base">
                          <Wallet className="w-5 h-5 mr-2" />
                          PayPal
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-blue-800 text-base">For your security, you'll be redirected to our secure payment processor.</p>
                            <p className="text-blue-700 text-sm mt-1">We do not collect or store your payment details.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-medium">Payment Summary</span>
                          <span className="text-base font-bold">${price.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          After clicking "Continue to Payment", you'll be redirected to our secure payment provider to complete your purchase.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          <svg className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-blue-800 text-base">You'll be redirected to PayPal to complete your purchase securely.</p>
                          <p className="text-blue-700 text-sm mt-1">Your account and payment details are protected by PayPal's encryption.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-2 mt-6">
                    <Checkbox 
                      id="terms" 
                      name="agreeTerms"
                      checked={formData.agreeTerms && hasAgreed}
                      onCheckedChange={(checked) => {
                        // If trying to check the box, show terms modal first
                        if (checked) {
                          setIsTermsModalOpen(true);
                          // Don't update checkbox state yet - wait for modal agreement
                        } else {
                          // Allow unchecking directly
                          setFormData({...formData, agreeTerms: false});
                          setHasAgreed(false);
                        }
                      }}
                      required
                    />
                    <Label htmlFor="terms" className="text-base">
                      I agree to the Terms of Service
                    </Label>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                      disabled={isProcessing || !formData.agreeTerms}
                    >
                      {isProcessing ? "Processing..." : `Continue to Payment`}
                    </Button>
                    
                    <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Your purchase is secure and encrypted
                    </div>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Terms and Conditions Modal */}
      <Dialog 
        open={isTermsModalOpen} 
        onOpenChange={(open) => {
          setIsTermsModalOpen(open);
          // If the dialog is being closed and not by agreement button
          if (!open && !hasAgreed) {
            // Make sure checkbox is unchecked
            setFormData({...formData, agreeTerms: false});
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Terms of Service & Legal Notice
            </DialogTitle>
            <DialogDescription className="text-base">
              Please read these terms carefully before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2 text-base">
            <section>
              <h3 className="font-bold text-lg mb-2">Course Content Usage</h3>
              <p className="mb-2">
                All content provided in this course is protected by copyright laws and intellectual property rights. By purchasing this course, you agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The course content is for your personal use only</li>
                <li><span className="font-semibold text-red-600">Sharing, distributing, or reselling course materials is strictly prohibited and may constitute a criminal offense</span></li>
                <li>You may not reproduce, duplicate, copy, sell, resell or exploit any portion of the course</li>
                <li>Recording, duplicating, or redistributing lectures, materials, or any course content is expressly forbidden</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-bold text-lg mb-2">Payment & Refunds</h3>
              <p className="mb-2">
                We offer a 30-day money-back guarantee if you're not satisfied with your purchase. Refund requests after this period will not be honored.
              </p>
              <p>
                <span className="font-semibold">Note on Payment Security:</span> We do not store your credit card details. All payment information is processed securely by our payment providers in compliance with PCI DSS standards.
              </p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg mb-2">Account Responsibility</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg mb-2">Termination</h3>
              <p>
                We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-amber-800">
                  <strong>Important:</strong> Unauthorized sharing or distribution of course content is a violation of copyright law and may result in legal action. By agreeing to these terms, you acknowledge that sharing course materials is illegal and subject to prosecution.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsTermsModalOpen(false)} className="text-base">
              I Need to Review
            </Button>
            <Button onClick={handleTermsAgreement} className="bg-primary text-base">
              I Agree to the Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PaymentPage;