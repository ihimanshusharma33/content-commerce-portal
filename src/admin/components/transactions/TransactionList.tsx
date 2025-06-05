import React, { useState } from 'react';
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from '../../../../types';
import { format } from 'date-fns';

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  
  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Status filter
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Payment type filter
    if (paymentTypeFilter !== 'all' && transaction.payment_type !== paymentTypeFilter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.transaction_id.toLowerCase().includes(searchLower) ||
        transaction.user.name.toLowerCase().includes(searchLower) ||
        transaction.user.email.toLowerCase().includes(searchLower) ||
        (transaction.course_or_subject?.course_name?.toLowerCase().includes(searchLower) || false) ||
        (transaction.course_or_subject?.subject_name?.toLowerCase().includes(searchLower) || false)
      );
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'initiated':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search by ID, student, or course..." 
              className="pl-10 w-full sm:w-80" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Successful</SelectItem>
                <SelectItem value="initiated">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="subject">Subjects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading transactions...</span>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.transaction_id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    <div>
                      <div>{transaction.user.name}</div>
                      <div className="text-xs text-muted-foreground">{transaction.user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.course_or_subject ? (
                      transaction.payment_type === 'course' 
                        ? transaction.course_or_subject.course_name
                        : transaction.course_or_subject.subject_name
                    ) : (
                      <span className="text-muted-foreground">Item #{transaction.course_or_subject_id}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={transaction.payment_type === 'course' ? 'bg-blue-50' : 'bg-purple-50'}>
                      {transaction.payment_type === 'course' ? 'Course' : 'Subject'}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{parseFloat(transaction.amount).toFixed(2)}</TableCell>
                  <TableCell>{formatDate(transaction.purchased_at)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center text-gray-500">
            {searchTerm || statusFilter !== 'all' || paymentTypeFilter !== 'all' 
              ? "No transactions match your search criteria" 
              : "No transactions found"}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions
        </div>
      </div>
    </div>
  );
};

export default TransactionList;