import { CalendarIcon, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export interface Payment {
  id: string;
  courseTitle: string;
  date: Date;
  amount: number;
  status: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b">
        <h2 className="text-lg sm:text-xl font-semibold">Payment History</h2>
        <p className="text-muted-foreground text-sm">View all your past transactions</p>
      </div>
      
      {payments.length > 0 ? (
        <>
          {/* Desktop table - hidden on small screens */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 sm:px-6 py-2 sm:py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-2" />
                        <span>{format(payment.date, 'MMM d, yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-mono">{payment.id}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <span className="font-medium">{payment.courseTitle}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
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
          
          {/* Mobile card view - only shown on small screens */}
          <div className="sm:hidden divide-y divide-gray-200">
            {payments.map(payment => (
              <div key={payment.id} className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">{payment.courseTitle}</span>
                  <span className={`px-2 text-xs font-semibold rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>{format(payment.date, 'MMM d, yyyy')}</span>
                  </div>
                  <span className="font-medium">${payment.amount.toFixed(2)}</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  <span>ID: </span>
                  <span className="font-mono">{payment.id}</span>
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
            When you purchase courses, your payment history will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;