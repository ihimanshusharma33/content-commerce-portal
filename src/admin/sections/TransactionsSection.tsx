import React, { useEffect, useState } from 'react';
import { Filter, Download, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionList from '../components/transactions/TransactionList';
import { Transaction } from '../../../types';
import { getPurchaseHistory } from '../../services/apiService';
import { useToast } from '@/components/ui/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface TransactionsSectionProps { }

const TransactionsSection: React.FC<TransactionsSectionProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [totalSuccessfulAmount, setTotalSuccessfulAmount] = useState<number>(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0);
  const { toast } = useToast();

  // Fetch transaction data
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getPurchaseHistory();
      setTransactions(data);
      setFilteredTransactions(data);
      calculateAmounts(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amounts
  const calculateAmounts = (transactions: Transaction[]) => {
    const successAmount = transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const pendingAmount = transactions
      .filter(t => t.status === 'initiated')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    setTotalSuccessfulAmount(successAmount);
    setTotalPendingAmount(pendingAmount);
  };

  // Filter transactions by date range
  const applyDateFilter = (mode: 'all' | 'today' | 'week' | 'month') => {
    setFilterMode(mode);
    
    if (mode === 'all') {
      setFilteredTransactions(transactions);
      return;
    }

    const today = new Date();
    let startDate: Date;

    switch (mode) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = startOfMonth(today);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }

    const filtered = transactions.filter(transaction => {
      const purchaseDate = new Date(transaction.purchased_at);
      return purchaseDate >= startDate;
    });

    setFilteredTransactions(filtered);
    calculateAmounts(filtered);
  };

  // Export transactions as CSV
  const exportTransactions = () => {
    // Format transactions for CSV
    const csvData = filteredTransactions.map(t => ({
      'ID': t.id,
      'Transaction ID': t.transaction_id,
      'Merchant Transaction ID': t.merchant_transaction_id || '',
      'Type': t.payment_type,
      'Item ID': t.course_or_subject_id,
      'Item Name': t.course_or_subject?.course_name || t.course_or_subject?.subject_name || 'N/A',
      'Student Name': t.user.name,
      'Student Email': t.user.email,
      'Amount': t.amount,
      'Status': t.status,
      'Date': format(new Date(t.purchased_at), 'yyyy-MM-dd HH:mm:ss')
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Transaction data has been exported successfully.",
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Get course vs subject purchase percentages
  const getPurchaseTypeStats = () => {
    const totalTransactions = filteredTransactions.length;
    if (totalTransactions === 0) return { coursePercent: 0, subjectPercent: 0 };
    
    const courseTransactions = filteredTransactions.filter(t => t.payment_type === 'course').length;
    const coursePercent = (courseTransactions / totalTransactions) * 100;
    const subjectPercent = 100 - coursePercent;
    
    return { coursePercent, subjectPercent };
  };

  const { coursePercent, subjectPercent } = getPurchaseTypeStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Payment Transactions</h1>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {filterMode === 'all' ? 'All Time' : 
                 filterMode === 'today' ? 'Today' : 
                 filterMode === 'week' ? 'This Week' : 'This Month'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col space-y-1">
                <Button 
                  variant={filterMode === 'all' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => applyDateFilter('all')}
                >
                  All Time
                </Button>
                <Button 
                  variant={filterMode === 'today' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => applyDateFilter('today')}
                >
                  Today
                </Button>
                <Button 
                  variant={filterMode === 'week' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => applyDateFilter('week')}
                >
                  This Week
                </Button>
                <Button 
                  variant={filterMode === 'month' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => applyDateFilter('month')}
                >
                  This Month
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button size="sm" onClick={exportTransactions}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {filterMode === 'all' ? 'All time' : 
               filterMode === 'today' ? 'Today' : 
               filterMode === 'week' ? 'Past 7 days' : 'This month'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Revenue</CardTitle>
            <div className="h-4 w-4 text-green-500">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSuccessfulAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter(t => t.status === 'success').length} successful payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <div className="h-4 w-4 text-yellow-500">₹</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter(t => t.status === 'initiated').length} pending payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchase Types</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${coursePercent}%` }}></div>
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${subjectPercent}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <div>Courses: {Math.round(coursePercent)}%</div>
              <div>Subjects: {Math.round(subjectPercent)}%</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TransactionList transactions={filteredTransactions} loading={loading} />
    </div>
  );
};

export default TransactionsSection;