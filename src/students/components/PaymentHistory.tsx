import { useEffect, useState } from 'react';
import { CalendarIcon, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { getStudentPaymentHistory } from '@/services/studentService';

export interface Payment {
  id: string;
  merchantTransactionId: string;
  courseTitle: string;
  paymentType: string;
  date: Date;
  amount: number;
  originalPrice?: number;
  discount?: number;
  status: string;
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const data = await getStudentPaymentHistory();
        const mappedPayments = data.map((item: any) => {
          const courseOrSubject = item.course_or_subject;
          const title = courseOrSubject?.subject_name || courseOrSubject?.course_name || 'Unknown Item';
          const originalPrice = parseFloat(courseOrSubject?.price || item.amount);
          const discount = parseFloat(courseOrSubject?.discount || 0);
          
          return {
            id: item.transaction_id,
            merchantTransactionId: item.merchant_transaction_id || 'N/A',
            courseTitle: title,
            paymentType: item.payment_type === 'course' ? 'Course' : 'Subject',
            date: new Date(item.purchased_at || item.created_at),
            amount: Number(item.amount),
            originalPrice: originalPrice,
            discount: discount,
            status: item.status === 'success' ? 'completed' : item.status,
          };
        });
        setPayments(mappedPayments);
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Payment History</h2>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b">
        <h2 className="text-lg sm:text-xl font-semibold">Payment History</h2>
        <p className="text-muted-foreground text-sm">View all your past transactions with detailed information</p>
      </div>
      
      {payments.length > 0 ? (
        <>
          {/* Desktop table - hidden on small screens */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium">{format(payment.date, 'MMM d, yyyy')}</div>
                          <div className="text-xs text-gray-500">{format(payment.date, 'h:mm a')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {payment.courseTitle}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.paymentType === 'Course' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {payment.paymentType}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">₹{payment.amount.toFixed(2)}</div>
                        {payment.discount && payment.discount > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="line-through">₹{payment.originalPrice?.toFixed(2)}</span>
                            <span className="ml-1 text-red-500">-₹{payment.discount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-mono">
                        <div className="text-gray-900">{payment.id}</div>
                        {payment.merchantTransactionId !== 'N/A' && (
                          <div className="text-gray-500 mt-1">
                            Merchant: {payment.merchantTransactionId.substring(0, 20)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile and Tablet card view */}
          <div className="lg:hidden divide-y divide-gray-200">
            {payments.map(payment => (
              <div key={payment.id} className="p-4 space-y-3">
                {/* Header with title and status */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{payment.courseTitle}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        payment.paymentType === 'Course' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {payment.paymentType}
                      </span>
                      <span className={`px-2 text-xs font-semibold rounded-full ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Amount section */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{format(payment.date, 'MMM d, yyyy')} at {format(payment.date, 'h:mm a')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">₹{payment.amount.toFixed(2)}</div>
                    {payment.discount && payment.discount > 0 && (
                      <div className="text-xs text-gray-500">
                        <span className="line-through">₹{payment.originalPrice?.toFixed(2)}</span>
                        <span className="ml-1 text-red-500">-₹{payment.discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Transaction IDs */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Transaction ID: </span>
                    <span className="font-mono">{payment.id}</span>
                  </div>
                  {payment.merchantTransactionId !== 'N/A' && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Merchant ID: </span>
                      <span className="font-mono">{payment.merchantTransactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <CreditCard className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-medium mb-2">No payment records found</h3>
          <p className="text-sm text-muted-foreground">
            When you purchase courses or subjects, your payment history will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;