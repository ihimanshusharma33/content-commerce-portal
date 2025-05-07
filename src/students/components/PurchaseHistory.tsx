import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

interface PurchaseHistoryItem {
  id: string;
  courseName: string;
  purchaseDate: string;
  expiryDate: string;
  status: "active" | "expired";
  amount: number;
}

interface PurchaseHistoryProps {
  purchaseHistory: PurchaseHistoryItem[];
}

export const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ purchaseHistory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof PurchaseHistoryItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle sort toggle
  const handleSort = (field: keyof PurchaseHistoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort and filter the purchase history items
  const filteredAndSortedHistory = [...purchaseHistory]
    .filter(item => 
      item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      
      if (sortField === "purchaseDate" || sortField === "expiryDate") {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      
      const valueA = a[sortField].toString().toLowerCase();
      const valueB = b[sortField].toString().toLowerCase();
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    });

  // Toggle item expansion for mobile view
  const toggleItemExpansion = (id: string) => {
    setSelectedItem(selectedItem === id ? null : id);
  };

  // Get sort icon for table header
  const getSortIcon = (field: keyof PurchaseHistoryItem) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription className="mt-1">All your transactions and course purchases</CardDescription>
            </div>
            <div className="w-full md:max-w-xs">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8 rounded-md border-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedHistory.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No purchase history found</p>
          ) : (
            <div className="rounded-md">
              {/* Desktop view - table format */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("courseName")}
                      >
                        Course {getSortIcon("courseName")}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("purchaseDate")}
                      >
                        Purchase Date {getSortIcon("purchaseDate")}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("expiryDate")}
                      >
                        Expiry Date {getSortIcon("expiryDate")}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        Status {getSortIcon("status")}
                      </th>
                      <th 
                        scope="col" 
                        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        Amount {getSortIcon("amount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredAndSortedHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium">
                          {item.courseName}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(item.purchaseDate)}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(item.expiryDate)}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={item.status === "active" ? "default" : "destructive"}>
                            {item.status === "active" ? "Active" : "Expired"}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          ${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - card format */}
              <div className="md:hidden space-y-2">
                {filteredAndSortedHistory.map((item) => (
                  <div key={item.id} className="border rounded-md overflow-hidden">
                    <div 
                      className="p-4 flex items-center justify-between bg-muted/30 cursor-pointer"
                      onClick={() => toggleItemExpansion(item.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">{item.courseName}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Purchased: {formatDate(item.purchaseDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === "active" ? "default" : "destructive"} className="whitespace-nowrap">
                          {item.status === "active" ? "Active" : "Expired"}
                        </Badge>
                        <ChevronDown className={`h-5 w-5 transition-transform ${selectedItem === item.id ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    
                    {selectedItem === item.id && (
                      <div className="p-4 bg-card border-t">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Purchase Date</p>
                            <p className="text-sm">{formatDate(item.purchaseDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Expiry Date</p>
                            <p className="text-sm">{formatDate(item.expiryDate)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="text-sm font-semibold">${item.amount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Purchase summary */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedHistory.length} of {purchaseHistory.length} purchases
                </p>
                <p className="text-sm font-medium mt-2 sm:mt-0">
                  Total spent: <span className="font-bold">${filteredAndSortedHistory.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseHistory;