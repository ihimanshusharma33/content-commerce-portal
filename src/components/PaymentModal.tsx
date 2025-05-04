import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Course } from "@/lib/data";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onPaymentComplete: () => void;
}

const PaymentModal = ({ isOpen, onClose, course, onPaymentComplete }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // In a real application, this would call a Stripe API endpoint
      // For now, we'll simulate a payment process with a timeout
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentComplete();
        toast("Payment successful", {
          description: `You've successfully purchased ${course.title}`
        });
        onClose();
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      toast("Payment failed", {
        description: "There was an issue processing your payment. Please try again."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Course:</span>
            <span>{course.title}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Price:</span>
            <span className="font-bold">
              ${course.discountPrice ? course.discountPrice.toFixed(2) : course.price.toFixed(2)}
            </span>
          </div>
          
          {/* In a real implementation, this would be replaced with Stripe Elements */}
          <div className="rounded-md border p-4 space-y-3">
            <div className="space-y-1">
              <label htmlFor="cardNumber" className="text-sm font-medium">Card Number</label>
              <input 
                id="cardNumber"
                type="text" 
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="4242 4242 4242 4242"
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="expDate" className="text-sm font-medium">Expiration Date</label>
                <input 
                  id="expDate"
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="MM/YY"
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="cvc" className="text-sm font-medium">CVC</label>
                <input 
                  id="cvc"
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="123"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>This is a demo payment form. In a real application, this would use Stripe Elements for secure payment processing.</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayment} 
            disabled={isProcessing}
            className="bg-accent text-white hover:bg-accent/90"
          >
            {isProcessing ? "Processing..." : "Complete Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
