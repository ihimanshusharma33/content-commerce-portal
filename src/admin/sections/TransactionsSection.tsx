import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TransactionList from '../components/transactions/TransactionList';
import { Transaction } from '../../../types';

interface TransactionsSectionProps {
  transactions: Transaction[];
}

const TransactionsSection: React.FC<TransactionsSectionProps> = ({
  transactions
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Payment Transactions</h1>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            Export Report
          </Button>
        </div>
      </div>
      
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default TransactionsSection;