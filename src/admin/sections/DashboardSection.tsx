import React, { useState } from 'react';
import { 
  ChevronDown, 
  RefreshCw,
  Users,
  UserPlus,
  ChevronRight,
  DollarSign,
  CalendarDays,
  GraduationCap,
  BookCopy,
  FileText,
  BookOpen,
  Star,
  CheckCircle,
  Timer,
  BadgeAlert,
  ShoppingCart,
  UserCheck,
  BarChart4,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  LucideProps
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Stats } from '../AdminDashoboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface DashboardSectionProps {
  stats: Stats | null;
  isLoading: boolean;
  onSetActiveSection: (section: string) => void;
  onApproveReview: (reviewId: number) => void;
  onRejectReview: (reviewId: number) => void;
  onViewAllCourses: () => void;
  onViewAllReviews: () => void;
  onViewAllTransactions: () => void;
  onViewAllStudents: () => void;
}

interface TrendIndicatorProps extends LucideProps {
  value: number;
  className?: string;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ value, className, ...props }) => {
  if (value === 0) return null;
  
  if (value > 0) {
    return (
      <div className={cn("flex items-center text-emerald-600", className)}>
        <ArrowUpRight className="h-3 w-3 mr-1" {...props} />
        <span>{value}%</span>
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center text-rose-600", className)}>
      <ArrowDownRight className="h-3 w-3 mr-1" {...props} />
      <span>{Math.abs(value)}%</span>
    </div>
  );
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats,
  isLoading,
  onSetActiveSection,
  onApproveReview,
  onRejectReview,
  onViewAllCourses,
  onViewAllReviews,
  onViewAllTransactions,
  onViewAllStudents
}) => {
  const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsPeriodSelectorOpen(false);
  };
  
  const handleRefresh = () => {
    // Refresh dashboard data
    window.location.reload();
  };
  
  // Format currency values for display
  const formatCurrency = (value: string | undefined): string => {
    if (!value) return '$0.00';
    return `$${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  // Calculate growth percentages - this is a placeholder
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Calculate total pending reviews
  const totalPendingReviews = stats ? 
    (stats.pending_course_reviews || 0) + (stats.pending_subject_reviews || 0) : 0;
  
  // Get percentage of purchasing users
  const purchasingPercentage = stats && stats.total_users > 0 
    ? Math.round((stats.total_purchasing_users / stats.total_users) * 100)
    : 0;
    
  // Mock growth rates (in a real app, these would come from comparing current/previous periods)
  const mockStudentGrowth = 8;
  const mockRevenueGrowth = 12;
  const mockContentGrowth = 5;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of your learning management system</p>
        </div>
        <div className="flex items-center space-x-2">
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="default" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh dashboard data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center p-12 bg-white rounded-lg border shadow-sm">
          <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
          <span className="text-gray-600 font-medium">Loading dashboard data...</span>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest statistics</p>
        </div>
      ) : (
        <>
          {/* Key Stats Overview - Clean Minimal Design */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Students - Clean Card */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <TrendIndicator value={mockStudentGrowth} className="text-xs" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Students</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">New today</span>
                      <span className="font-medium text-gray-900">{stats?.new_users_today || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Active users</span>
                      <span className="font-medium text-gray-900">{stats?.total_purchasing_users || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Revenue - Clean Card */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <TrendIndicator value={mockRevenueGrowth} className="text-xs" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.total_revenue)}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Transactions</span>
                      <span className="font-medium text-gray-900">{stats?.total_purchases || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Success rate</span>
                      <span className="font-medium text-gray-900">
                        {stats && (stats.total_purchases + stats.total_failed_transactions) > 0 
                          ? Math.round((stats.total_purchases / (stats.total_purchases + stats.total_failed_transactions)) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Content - Clean Card */}
            <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <TrendIndicator value={mockContentGrowth} className="text-xs" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Learning Content</h3>
                    <p className="text-2xl font-bold text-gray-900">
                      {(stats?.total_courses || 0) + (stats?.total_subjects || 0)}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Courses</span>
                      <span className="font-medium text-gray-900">{stats?.total_courses || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Subjects</span>
                      <span className="font-medium text-gray-900">{stats?.total_subjects || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews - Clean Card */}
            <Card className={cn(
              "bg-white border shadow-sm hover:shadow-md transition-all duration-200",
              totalPendingReviews > 0 
                ? "border-amber-200 bg-amber-50/30" 
                : "border-gray-100"
            )}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    totalPendingReviews > 0 
                      ? "bg-amber-100" 
                      : "bg-gray-50"
                  )}>
                    <Star className={cn(
                      "h-5 w-5",
                      totalPendingReviews > 0 ? "text-amber-600" : "text-gray-400"
                    )} />
                  </div>
                  {totalPendingReviews > 0 && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Reviews</h3>
                    <p className={cn(
                      "text-2xl font-bold",
                      totalPendingReviews > 0 ? "text-amber-600" : "text-gray-900"
                    )}>
                      {totalPendingReviews}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Course reviews</span>
                      <span className="font-medium text-gray-900">{stats?.pending_course_reviews || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500">Subject reviews</span>
                      <span className="font-medium text-gray-900">{stats?.pending_subject_reviews || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats - Clean Minimal Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Actions */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription className="text-sm text-gray-500">Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-12 border-gray-200 hover:bg-gray-50" 
                    onClick={onViewAllStudents}
                  >
                    <Users className="mr-3 h-4 w-4 text-gray-500" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Manage Students</div>
                      <div className="text-xs text-gray-500">{stats?.total_users || 0} total students</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-12 border-gray-200 hover:bg-gray-50" 
                    onClick={onViewAllCourses}
                  >
                    <GraduationCap className="mr-3 h-4 w-4 text-gray-500" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Manage Content</div>
                      <div className="text-xs text-gray-500">{(stats?.total_courses || 0) + (stats?.total_subjects || 0)} items</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left h-12 border-gray-200 hover:bg-gray-50",
                      totalPendingReviews > 0 && "border-amber-200 bg-amber-50/50 hover:bg-amber-100/50"
                    )}
                    onClick={onViewAllReviews}
                  >
                    <Star className={cn(
                      "mr-3 h-4 w-4",
                      totalPendingReviews > 0 ? "text-amber-500" : "text-gray-500"
                    )} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">Review Management</div>
                      <div className="text-xs text-gray-500">
                        {totalPendingReviews > 0 ? `${totalPendingReviews} pending` : 'All caught up'}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Revenue Breakdown</CardTitle>
                <CardDescription className="text-sm text-gray-500">Financial overview</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Total Revenue</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(stats?.total_revenue)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">This Month</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(stats?.total_revenue_this_month)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">This Week</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(stats?.total_revenue_this_week)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Average per transaction</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {stats && stats.total_purchases > 0 
                          ? formatCurrency((parseFloat(stats.total_revenue) / stats.total_purchases).toFixed(2))
                          : formatCurrency('0')
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900" onClick={onViewAllTransactions}>
                  View detailed report
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* System Status */}
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">System Status</CardTitle>
                <CardDescription className="text-sm text-gray-500">Platform health overview</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Successful Transactions</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stats?.total_purchases || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Pending Transactions</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stats?.total_pending_transactions || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">Failed Transactions</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stats?.total_failed_transactions || 0}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-semibold text-green-600">
                        {stats && (stats.total_purchases + stats.total_failed_transactions) > 0 
                          ? Math.round((stats.total_purchases / (stats.total_purchases + stats.total_failed_transactions)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${stats && (stats.total_purchases + stats.total_failed_transactions) > 0 
                            ? (stats.total_purchases / (stats.total_purchases + stats.total_failed_transactions)) * 100
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-100">
                <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900" onClick={onViewAllTransactions}>
                  View system logs
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardSection;